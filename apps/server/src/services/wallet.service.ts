import { db } from "@flowpay/db";
import { wallet } from "@flowpay/db/schema/wallet";
import { transaction } from "@flowpay/db/schema/transaction";
import { eq, and, desc, sql } from "drizzle-orm";
import { recordBalanceChange } from "./balance-audit.service";

export async function listWallets(
  userId: string,
  options?: { archived?: boolean; type?: "bank" | "credit" | "cash" | "mobile" },
) {
  const conditions = [eq(wallet.userId, userId)];
  conditions.push(eq(wallet.archived, options?.archived ?? false));
  if (options?.type) conditions.push(eq(wallet.type, options.type));
  return db
    .select()
    .from(wallet)
    .where(and(...conditions))
    .orderBy(desc(wallet.createdAt));
}

export async function getWalletById(userId: string, id: string) {
  const [result] = await db
    .select()
    .from(wallet)
    .where(and(eq(wallet.id, id), eq(wallet.userId, userId)));
  return result ?? null;
}

export async function getDefaultWallet(userId: string) {
  const [result] = await db
    .select()
    .from(wallet)
    .where(and(eq(wallet.userId, userId), eq(wallet.isDefault, true)));
  return result ?? null;
}

export async function createWallet(
  userId: string,
  data: {
    name: string;
    type: "bank" | "credit" | "cash" | "mobile";
    icon?: string;
    currency?: string;
    isDefault?: boolean;
  },
) {
  if (data.isDefault) {
    await db
      .update(wallet)
      .set({ isDefault: false })
      .where(eq(wallet.userId, userId));
  }

  const [result] = await db
    .insert(wallet)
    .values({
      userId,
      name: data.name,
      type: data.type,
      icon: data.icon,
      currency: data.currency ?? "USD",
      isDefault: data.isDefault ?? false,
    })
    .returning();

  return result;
}

export async function updateWallet(
  userId: string,
  id: string,
  data: {
    name?: string;
    type?: "bank" | "credit" | "cash" | "mobile";
    icon?: string;
    currency?: string;
    isDefault?: boolean;
    archived?: boolean;
  },
) {
  if (data.isDefault) {
    await db
      .update(wallet)
      .set({ isDefault: false })
      .where(eq(wallet.userId, userId));
  }

  const [result] = await db
    .update(wallet)
    .set({ ...data, ...(data.archived ? { isDefault: false } : {}) })
    .where(and(eq(wallet.id, id), eq(wallet.userId, userId)))
    .returning();

  return result ?? null;
}

export async function deleteWallet(userId: string, id: string) {
  const [result] = await db
    .delete(wallet)
    .where(and(eq(wallet.id, id), eq(wallet.userId, userId)))
    .returning();

  if (result?.isDefault) {
    const [successor] = await db
      .select({ id: wallet.id })
      .from(wallet)
      .where(
        and(eq(wallet.userId, userId), eq(wallet.archived, false)),
      )
      .orderBy(desc(wallet.createdAt))
      .limit(1);

    if (successor) {
      await db
        .update(wallet)
        .set({ isDefault: true })
        .where(eq(wallet.id, successor.id));
    }
  }

  return result ?? null;
}

export async function adjustWalletBalance(
  userId: string,
  id: string,
  amount: number,
) {
  const [updated] = await db
    .update(wallet)
    .set({ balance: sql`${wallet.balance} + ${amount}` })
    .where(and(eq(wallet.id, id), eq(wallet.userId, userId)))
    .returning();

  if (!updated) return null;

  await recordBalanceChange({
    userId,
    walletId: id,
    reason: "manual_adjustment",
    changeAmount: amount,
    balanceAfter: Number(updated.balance),
  }).catch(() => undefined);

  return updated;
}

export async function recalculateWalletBalances(userId: string) {
  const wallets = await db
    .select({ id: wallet.id })
    .from(wallet)
    .where(eq(wallet.userId, userId));

  let corrected = 0;

  for (const item of wallets) {
    const [totals] = await db
      .select({
        net: sql<string>`COALESCE(SUM(CASE WHEN ${transaction.type} = 'income' THEN ${transaction.amount} ELSE -${transaction.amount} END), 0)`,
      })
      .from(transaction)
      .where(
        and(eq(transaction.walletId, item.id), eq(transaction.userId, userId)),
      );

    const ledgerBalance = Number(totals?.net ?? 0);
    const [current] = await db
      .select({ balance: wallet.balance })
      .from(wallet)
      .where(eq(wallet.id, item.id));

    if (current && Math.abs(Number(current.balance) - ledgerBalance) >= 0.01) {
      await db
        .update(wallet)
        .set({ balance: String(ledgerBalance) })
        .where(eq(wallet.id, item.id));
      corrected++;
    }
  }

  return { checked: wallets.length, corrected };
}