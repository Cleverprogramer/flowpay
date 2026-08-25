import { db } from "@flowpay/db";
import { recurringRule } from "@flowpay/db/schema/recurring-rule";
import { transaction } from "@flowpay/db/schema/transaction";
import { wallet } from "@flowpay/db/schema/wallet";
import { desc, eq, and, lte, sql } from "drizzle-orm";
import { computeNextRunAt } from "@/utils/recurrence";
import { recordBalanceChange } from "./balance-audit.service";

const MAX_CATCH_UP_OCCURRENCES = 100;

export async function listRecurringRules(
  userId: string,
  options?: {
    interval?: "daily" | "weekly" | "monthly" | "yearly";
    isActive?: boolean;
  },
) {
  const conditions = [eq(recurringRule.userId, userId)];
  if (options?.interval)
    conditions.push(eq(recurringRule.interval, options.interval));
  if (options?.isActive !== undefined)
    conditions.push(eq(recurringRule.isActive, options.isActive));

  return db
    .select()
    .from(recurringRule)
    .where(and(...conditions))
    .orderBy(desc(recurringRule.createdAt));
}

export async function getRecurringRuleById(userId: string, id: string) {
  const [result] = await db
    .select()
    .from(recurringRule)
    .where(and(eq(recurringRule.id, id), eq(recurringRule.userId, userId)));
  return result
    ? { ...result, amount: Number(result.amount) }
    : null;
}

export async function createRecurringRule(
  userId: string,
  data: {
    walletId: string;
    categoryId?: string;
    type: "income" | "expense";
    amount: number;
    description: string;
    note?: string;
    interval: "daily" | "weekly" | "monthly" | "yearly";
    startDate?: string;
  },
) {
  const startDate = data.startDate ? new Date(data.startDate) : new Date();

  const [result] = await db
    .insert(recurringRule)
    .values({
      userId,
      walletId: data.walletId,
      categoryId: data.categoryId,
      type: data.type,
      amount: String(data.amount),
      description: data.description,
      note: data.note,
      interval: data.interval,
      startDate,
      nextRunAt: computeNextRunAt(startDate, data.interval),
    })
    .returning();

  if (!result) return null;
  return { ...result, amount: Number(result.amount) };
}

export async function updateRecurringRule(
  userId: string,
  id: string,
  data: {
    categoryId?: string | null;
    amount?: number;
    description?: string;
    note?: string | null;
    interval?: "daily" | "weekly" | "monthly" | "yearly";
    isActive?: boolean;
  },
) {
  const updateData: Record<string, unknown> = {};
  if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;
  if (data.amount !== undefined) updateData.amount = String(data.amount);
  if (data.description !== undefined) updateData.description = data.description;
  if (data.note !== undefined) updateData.note = data.note;
  if (data.interval !== undefined) updateData.interval = data.interval;
  if (data.isActive !== undefined) updateData.isActive = data.isActive;

  const [result] = await db
    .update(recurringRule)
    .set(updateData)
    .where(and(eq(recurringRule.id, id), eq(recurringRule.userId, userId)))
    .returning();

  if (!result) return null;

  if (data.interval !== undefined) {
    const [rescheduled] = await db
      .update(recurringRule)
      .set({
        nextRunAt: computeNextRunAt(new Date(), data.interval),
      })
      .where(eq(recurringRule.id, result.id))
      .returning();
    if (rescheduled) return { ...rescheduled, amount: Number(rescheduled.amount) };
  }

  return { ...result, amount: Number(result.amount) };
}

export async function deleteRecurringRule(userId: string, id: string) {
  const [result] = await db
    .delete(recurringRule)
    .where(and(eq(recurringRule.id, id), eq(recurringRule.userId, userId)))
    .returning();
  return result ? { ...result, amount: Number(result.amount) } : null;
}

export async function processDueRecurringRules(userId: string) {
  const now = new Date();

  const dueRules = await db
    .select()
    .from(recurringRule)
    .where(
      and(
        eq(recurringRule.userId, userId),
        eq(recurringRule.isActive, true),
        lte(recurringRule.nextRunAt, now),
      ),
    );

  let createdTransactions = 0;

  for (const rule of dueRules) {
    let cursor = rule.nextRunAt;
    let lastRun: Date | null = rule.lastRunAt;
    let occurrences = 0;

    while (cursor <= now && occurrences < MAX_CATCH_UP_OCCURRENCES) {
      const [created] = await db
        .insert(transaction)
        .values({
          userId: rule.userId,
          walletId: rule.walletId,
          categoryId: rule.categoryId,
          type: rule.type,
          amount: rule.amount,
          description: rule.description,
          note: rule.note,
          transactionDate: cursor,
          isRecurring: true,
          recurringInterval: rule.interval,
        })
        .returning({ id: transaction.id });

      const balanceChange =
        rule.type === "income" ? Number(rule.amount) : -Number(rule.amount);
      const [updatedWallet] = await db
        .update(wallet)
        .set({ balance: sql`${wallet.balance} + ${balanceChange}` })
        .where(
          and(eq(wallet.id, rule.walletId), eq(wallet.userId, rule.userId)),
        )
        .returning({ balance: wallet.balance });

      if (created && updatedWallet) {
        await recordBalanceChange({
          userId: rule.userId,
          walletId: rule.walletId,
          transactionId: created.id,
          reason: "recurring_generated",
          changeAmount: balanceChange,
          balanceAfter: Number(updatedWallet.balance),
        }).catch((err) =>
          console.error("Failed to record audit entry:", err),
        );
      }

      lastRun = cursor;
      cursor = computeNextRunAt(cursor, rule.interval);
      occurrences++;
      createdTransactions++;
    }

    await db
      .update(recurringRule)
      .set({ nextRunAt: cursor, lastRunAt: lastRun })
      .where(eq(recurringRule.id, rule.id));
  }

  return { processedRules: dueRules.length, createdTransactions };
}

const INTERVAL_MONTHLY_FACTOR = {
  daily: 30,
  weekly: 30 / 7,
  monthly: 1,
  yearly: 1 / 12,
} as const;

export async function pauseRecurringRule(userId: string, id: string) {
  return updateRecurringRule(userId, id, { isActive: false });
}

export async function resumeRecurringRule(userId: string, id: string) {
  const [rule] = await db
    .select({ nextRunAt: recurringRule.nextRunAt })
    .from(recurringRule)
    .where(and(eq(recurringRule.id, id), eq(recurringRule.userId, userId)));
  if (!rule) return null;

  const now = new Date();
  if (rule.nextRunAt <= now) {
    const [fresh] = await db
      .select({ interval: recurringRule.interval })
      .from(recurringRule)
      .where(eq(recurringRule.id, id));
    if (fresh) {
      const nextRunAt = computeNextRunAt(now, fresh.interval);
      const [result] = await db
        .update(recurringRule)
        .set({ isActive: true, nextRunAt })
        .where(eq(recurringRule.id, id))
        .returning();
      return result
        ? { ...result, amount: Number(result.amount) }
        : null;
    }
  }

  return updateRecurringRule(userId, id, { isActive: true });
}

export async function listRecurringRulesWithCosts(
  userId: string,
  options?: {
    interval?: "daily" | "weekly" | "monthly" | "yearly";
    isActive?: boolean;
  },
) {
  const rules = await listRecurringRules(userId, options);
  return rules.map((rule) => ({
    ...rule,
    amount: Number(rule.amount),
    monthlyEquivalent:
      Math.round(
        Number(rule.amount) * INTERVAL_MONTHLY_FACTOR[rule.interval] * 100,
      ) / 100,
    daysUntilNextRun: Math.max(
      0,
      Math.ceil(
        (new Date(rule.nextRunAt).getTime() - Date.now()) /
          (24 * 60 * 60 * 1000),
      ),
    ),
  }));
}
