import { db } from "@flowpay/db";
import { balanceAudit } from "@flowpay/db/schema/balance-audit";
import { count, desc, eq, and } from "drizzle-orm";

export type BalanceAuditReason =
  | "transaction_created"
  | "transaction_deleted"
  | "recurring_generated"
  | "manual_adjustment";

export async function recordBalanceChange(input: {
  userId: string;
  walletId: string;
  transactionId?: string;
  reason: BalanceAuditReason;
  changeAmount: number;
  balanceAfter: number;
}) {
  await db.insert(balanceAudit).values({
    userId: input.userId,
    walletId: input.walletId,
    transactionId: input.transactionId,
    reason: input.reason,
    changeAmount: input.changeAmount.toFixed(2),
    balanceAfter: input.balanceAfter.toFixed(2),
  });
}

export async function listBalanceAudit(
  userId: string,
  params: {
    page: number;
    limit: number;
    walletId?: string;
  },
) {
  const offset = (params.page - 1) * params.limit;
  const conditions = [eq(balanceAudit.userId, userId)];
  if (params.walletId)
    conditions.push(eq(balanceAudit.walletId, params.walletId));
  const whereClause = and(...conditions);

  const [data, totalResult] = await Promise.all([
    db
      .select()
      .from(balanceAudit)
      .where(whereClause)
      .orderBy(desc(balanceAudit.createdAt))
      .limit(params.limit)
      .offset(offset),
    db.select({ count: count() }).from(balanceAudit).where(whereClause),
  ]);

  return {
    data: data.map((row) => ({
      ...row,
      changeAmount: Number(row.changeAmount),
      balanceAfter: Number(row.balanceAfter),
    })),
    pagination: {
      page: params.page,
      limit: params.limit,
      total: totalResult[0]?.count ?? 0,
      totalPages: Math.ceil((totalResult[0]?.count ?? 0) / params.limit),
    },
  };
}
