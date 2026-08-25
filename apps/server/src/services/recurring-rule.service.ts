import { db } from "@flowpay/db";
import { recurringRule } from "@flowpay/db/schema/recurring-rule";
import { transaction } from "@flowpay/db/schema/transaction";
import { wallet } from "@flowpay/db/schema/wallet";
import { desc, eq, and, lte, sql } from "drizzle-orm";
import { computeNextRunAt } from "@/utils/recurrence";
import { recordBalanceChange } from "./balance-audit.service";

const MAX_CATCH_UP_OCCURRENCES = 100;

export async function listRecurringRules(userId: string) {
  return db
    .select()
    .from(recurringRule)
    .where(eq(recurringRule.userId, userId))
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
