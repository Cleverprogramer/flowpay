import { db } from "@flowpay/db";
import { wallet } from "@flowpay/db/schema/wallet";
import { transaction } from "@flowpay/db/schema/transaction";
import { and, eq, gte, lte, sql } from "drizzle-orm";
import { createNotification } from "./notification.service";

export async function getWalletLimitStatus(userId: string, walletId: string) {
  const [record] = await db
    .select({ monthlyLimit: wallet.monthlyLimit })
    .from(wallet)
    .where(and(eq(wallet.id, walletId), eq(wallet.userId, userId)));

  if (!record) return null;
  if (!record.monthlyLimit) {
    return { limit: null, spentThisMonth: null, percentage: null };
  }

  const now = new Date();
  const monthStart = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1),
  );
  const monthEnd = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0, 23, 59, 59),
  );

  const [spentResult] = await db
    .select({ total: sql<string>`COALESCE(SUM(${transaction.amount}), 0)` })
    .from(transaction)
    .where(
      and(
        eq(transaction.userId, userId),
        eq(transaction.walletId, walletId),
        eq(transaction.type, "expense"),
        gte(transaction.transactionDate, monthStart),
        lte(transaction.transactionDate, monthEnd),
      ),
    );

  const spent = Number(spentResult?.total ?? 0);
  const limit = Number(record.monthlyLimit);

  return {
    limit,
    spentThisMonth: spent,
    percentage: Math.min(100, Math.round((spent / limit) * 100)),
    exceeded: spent >= limit,
  };
}

export async function evaluateWalletLimit(
  userId: string,
  walletId: string,
): Promise<void> {
  const status = await getWalletLimitStatus(userId, walletId);
  if (!status?.limit || !status.exceeded) return;

  await createNotification(userId, {
    title: "Wallet Limit Exceeded",
    description: `Monthly spending passed your $${status.limit.toLocaleString()} limit ($${status.spentThisMonth?.toLocaleString()} used).`,
    type: "alert",
    category: "budget",
  });
}
