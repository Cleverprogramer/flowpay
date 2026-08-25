import { db } from "@flowpay/db";
import { budget } from "@flowpay/db/schema/budget";
import { category } from "@flowpay/db/schema/category";
import { transaction } from "@flowpay/db/schema/transaction";
import { eq, and, sql, gte, lte } from "drizzle-orm";

export async function listBudgets(userId: string) {
  const data = await db
    .select({
      id: budget.id,
      userId: budget.userId,
      categoryId: budget.categoryId,
      amount: budget.amount,
      period: budget.period,
      spent: budget.spent,
      startDate: budget.startDate,
      endDate: budget.endDate,
      isActive: budget.isActive,
      createdAt: budget.createdAt,
      updatedAt: budget.updatedAt,
      categoryName: category.name,
      categoryEmoji: category.emoji,
      categoryColor: category.color,
    })
    .from(budget)
    .leftJoin(category, eq(budget.categoryId, category.id))
    .where(eq(budget.userId, userId));

  return data.map((row) => ({
    ...row,
    amount: Number(row.amount),
    spent: Number(row.spent),
    remaining: Number(row.amount) - Number(row.spent),
    percentage:
      Number(row.amount) > 0
        ? Math.min(
            100,
            Math.round((Number(row.spent) / Number(row.amount)) * 100),
          )
        : 0,
  }));
}

export async function getBudgetById(userId: string, id: string) {
  const [result] = await db
    .select({
      id: budget.id,
      userId: budget.userId,
      categoryId: budget.categoryId,
      amount: budget.amount,
      period: budget.period,
      spent: budget.spent,
      startDate: budget.startDate,
      endDate: budget.endDate,
      isActive: budget.isActive,
      createdAt: budget.createdAt,
      updatedAt: budget.updatedAt,
      categoryName: category.name,
      categoryEmoji: category.emoji,
    })
    .from(budget)
    .leftJoin(category, eq(budget.categoryId, category.id))
    .where(and(eq(budget.id, id), eq(budget.userId, userId)));

  if (!result) return null;

  return {
    ...result,
    amount: Number(result.amount),
    spent: Number(result.spent),
    remaining: Number(result.amount) - Number(result.spent),
  };
}

export function computePeriodEnd(
  startDate: Date,
  period: "weekly" | "monthly" | "yearly",
): Date {
  const end = new Date(startDate);
  if (period === "weekly") end.setUTCDate(end.getUTCDate() + 7);
  else if (period === "monthly") end.setUTCMonth(end.getUTCMonth() + 1);
  else end.setUTCFullYear(end.getUTCFullYear() + 1);
  end.setUTCMilliseconds(-1);
  return end;
}

export async function createBudget(
  userId: string,
  data: {
    categoryId: string;
    amount: number;
    period: "weekly" | "monthly" | "yearly";
    startDate: string;
    endDate?: string;
  },
) {
  const startDate = new Date(data.startDate);
  const endDate = data.endDate
    ? new Date(data.endDate)
    : computePeriodEnd(startDate, data.period);
  // Calculate current spent for this category in the date range
  const [spentResult] = await db
    .select({
      total: sql<string>`COALESCE(SUM(${transaction.amount}), 0)`,
    })
    .from(transaction)
    .where(
      and(
        eq(transaction.userId, userId),
        eq(transaction.categoryId, data.categoryId),
        eq(transaction.type, "expense"),
        gte(transaction.transactionDate, startDate),
        lte(transaction.transactionDate, endDate),
      ),
    );

  const [result] = await db
    .insert(budget)
    .values({
      userId,
      categoryId: data.categoryId,
      amount: String(data.amount),
      period: data.period,
      spent: spentResult?.total ?? "0",
      startDate,
      endDate,
    })
    .returning();

  return {
    ...result,
    amount: Number(result?.amount),
    spent: Number(result?.spent),
  };
}

export async function updateBudget(
  userId: string,
  id: string,
  data: {
    amount?: number;
    period?: "weekly" | "monthly" | "yearly";
    startDate?: string;
    endDate?: string;
    isActive?: boolean;
  },
) {
  const updateData: Record<string, unknown> = {};
  if (data.amount !== undefined) updateData.amount = String(data.amount);
  if (data.period !== undefined) updateData.period = data.period;
  if (data.startDate !== undefined)
    updateData.startDate = new Date(data.startDate);
  if (data.endDate !== undefined) updateData.endDate = new Date(data.endDate);
  if (data.isActive !== undefined) updateData.isActive = data.isActive;

  const [result] = await db
    .update(budget)
    .set(updateData)
    .where(and(eq(budget.id, id), eq(budget.userId, userId)))
    .returning();

  if (!result) return null;

  return {
    ...result,
    amount: Number(result.amount),
    spent: Number(result.spent),
    remaining: Number(result.amount) - Number(result.spent),
    percentage:
      Number(result.amount) > 0
        ? Math.min(
            100,
            Math.round((Number(result.spent) / Number(result.amount)) * 100),
          )
        : 0,
  };
}

export async function deleteBudget(userId: string, id: string) {
  const [result] = await db
    .delete(budget)
    .where(and(eq(budget.id, id), eq(budget.userId, userId)))
    .returning();
  return result ?? null;
}
