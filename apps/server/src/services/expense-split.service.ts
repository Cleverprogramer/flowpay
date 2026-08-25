import { db } from "@flowpay/db";
import { expenseSplit } from "@flowpay/db/schema/expense-split";
import { transaction } from "@flowpay/db/schema/transaction";
import { and, desc, eq, sql } from "drizzle-orm";
import { splitEvenly } from "@/utils/split";

async function assertTransactionOwnership(
  userId: string,
  transactionId: string,
) {
  const [record] = await db
    .select({ id: transaction.id })
    .from(transaction)
    .where(and(eq(transaction.id, transactionId), eq(transaction.userId, userId)));
  return record ?? null;
}

export async function listSplits(
  userId: string,
  filters: { transactionId?: string; isSettled?: "true" | "false" },
) {
  const conditions = [eq(expenseSplit.userId, userId)];
  if (filters.transactionId)
    conditions.push(eq(expenseSplit.transactionId, filters.transactionId));
  if (filters.isSettled)
    conditions.push(eq(expenseSplit.isSettled, filters.isSettled === "true"));

  return db
    .select()
    .from(expenseSplit)
    .where(and(...conditions))
    .orderBy(desc(expenseSplit.createdAt));
}

export async function createSplit(
  userId: string,
  data: {
    transactionId: string;
    participantName: string;
    participantContact?: string;
    shareAmount: number;
  },
) {
  if (!(await assertTransactionOwnership(userId, data.transactionId))) {
    return null;
  }

  const [result] = await db
    .insert(expenseSplit)
    .values({
      userId,
      transactionId: data.transactionId,
      participantName: data.participantName,
      participantContact: data.participantContact,
      shareAmount: String(data.shareAmount),
    })
    .returning();
  return result;
}

export async function splitTransactionEvenly(
  userId: string,
  data: { transactionId: string; participants: string[] },
) {
  const [record] = await db
    .select({ amount: transaction.amount })
    .from(transaction)
    .where(
      and(eq(transaction.id, data.transactionId), eq(transaction.userId, userId)),
    );
  if (!record) return null;

  const totalCents = Math.round(Number(record.amount) * 100);
  const shares = splitEvenly(totalCents, data.participants.length);

  const values = data.participants.map((participantName, index) => ({
    userId,
    transactionId: data.transactionId,
    participantName,
    shareAmount: ((shares[index] ?? 0) / 100).toFixed(2),
  }));

  await db
    .delete(expenseSplit)
    .where(
      and(
        eq(expenseSplit.userId, userId),
        eq(expenseSplit.transactionId, data.transactionId),
      ),
    );

  return db.insert(expenseSplit).values(values).returning();
}

export async function settleSplit(
  userId: string,
  id: string,
  isSettled: boolean,
) {
  const [result] = await db
    .update(expenseSplit)
    .set({ isSettled, settledAt: isSettled ? new Date() : null })
    .where(and(eq(expenseSplit.id, id), eq(expenseSplit.userId, userId)))
    .returning();
  return result ?? null;
}

export async function getSplitsSummary(userId: string) {
  const rows = await db
    .select({
      outstanding: sql<string>`COALESCE(SUM(CASE WHEN ${expenseSplit.isSettled} = false THEN ${expenseSplit.shareAmount} ELSE 0 END), 0)`,
      settled: sql<string>`COALESCE(SUM(CASE WHEN ${expenseSplit.isSettled} = true THEN ${expenseSplit.shareAmount} ELSE 0 END), 0)`,
    })
    .from(expenseSplit)
    .where(eq(expenseSplit.userId, userId));

  return {
    outstanding: Number(rows[0]?.outstanding ?? 0),
    settled: Number(rows[0]?.settled ?? 0),
  };
}

export async function deleteSplit(userId: string, id: string) {
  const [result] = await db
    .delete(expenseSplit)
    .where(and(eq(expenseSplit.id, id), eq(expenseSplit.userId, userId)))
    .returning();
  return result ?? null;
}
