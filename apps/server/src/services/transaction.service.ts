import { db } from "@flowpay/db";
import { category } from "@flowpay/db/schema/category";
import { transaction } from "@flowpay/db/schema/transaction";
import { wallet } from "@flowpay/db/schema/wallet";
import { eq, and, desc, sql, count, gte, lte } from "drizzle-orm";
import { createNotification } from "./notification.service";

export async function listTransactions(
  userId: string,
  params: {
    page: number;
    limit: number;
    type?: "income" | "expense";
    walletId?: string;
    categoryId?: string;
    startDate?: string;
    endDate?: string;
  },
) {
  const offset = (params.page - 1) * params.limit;
  const conditions: ReturnType<typeof eq>[] = [eq(transaction.userId, userId)];

  if (params.type) conditions.push(eq(transaction.type, params.type));
  if (params.walletId)
    conditions.push(eq(transaction.walletId, params.walletId));
  if (params.categoryId)
    conditions.push(eq(transaction.categoryId, params.categoryId));
  if (params.startDate)
    conditions.push(
      gte(transaction.transactionDate, new Date(params.startDate)),
    );
  if (params.endDate)
    conditions.push(lte(transaction.transactionDate, new Date(params.endDate)));

  const whereClause = and(...conditions);

  const [data, totalResult] = await Promise.all([
    db
      .select({
        id: transaction.id,
        userId: transaction.userId,
        walletId: transaction.walletId,
        categoryId: transaction.categoryId,
        type: transaction.type,
        amount: transaction.amount,
        description: transaction.description,
        note: transaction.note,
        transactionDate: transaction.transactionDate,
        receiptUrl: transaction.receiptUrl,
        isRecurring: transaction.isRecurring,
        recurringInterval: transaction.recurringInterval,
        createdAt: transaction.createdAt,
        updatedAt: transaction.updatedAt,
        categoryName: category.name,
        categoryEmoji: category.emoji,
        walletName: wallet.name,
        walletType: wallet.type,
      })
      .from(transaction)
      .leftJoin(category, eq(transaction.categoryId, category.id))
      .leftJoin(wallet, eq(transaction.walletId, wallet.id))
      .where(whereClause)
      .orderBy(desc(transaction.transactionDate))
      .limit(params.limit)
      .offset(offset),
    db.select({ count: count() }).from(transaction).where(whereClause),
  ]);

  return {
    data: data.map((row) => ({
      ...row,
      amount: Number(row.amount),
    })),
    pagination: {
      page: params.page,
      limit: params.limit,
      total: totalResult[0]?.count ?? 0,
      totalPages: Math.ceil((totalResult[0]?.count ?? 0) / params.limit),
    },
  };
}

export async function getTransactionById(userId: string, id: string) {
  const [result] = await db
    .select({
      id: transaction.id,
      userId: transaction.userId,
      walletId: transaction.walletId,
      categoryId: transaction.categoryId,
      type: transaction.type,
      amount: transaction.amount,
      description: transaction.description,
      note: transaction.note,
      transactionDate: transaction.transactionDate,
      receiptUrl: transaction.receiptUrl,
      isRecurring: transaction.isRecurring,
      recurringInterval: transaction.recurringInterval,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
      categoryName: category.name,
      categoryEmoji: category.emoji,
      walletName: wallet.name,
      walletType: wallet.type,
    })
    .from(transaction)
    .leftJoin(category, eq(transaction.categoryId, category.id))
    .leftJoin(wallet, eq(transaction.walletId, wallet.id))
    .where(and(eq(transaction.id, id), eq(transaction.userId, userId)));

  if (!result) return null;
  return { ...result, amount: Number(result.amount) };
}

export async function createTransaction(
  userId: string,
  data: {
    walletId: string;
    categoryId?: string;
    type: "income" | "expense";
    amount: number;
    description: string;
    note?: string;
    transactionDate: string;
    receiptUrl?: string;
    isRecurring?: boolean;
    recurringInterval?: "daily" | "weekly" | "monthly" | "yearly";
  },
) {
  const [result] = await db
    .insert(transaction)
    .values({
      userId,
      walletId: data.walletId,
      categoryId: data.categoryId,
      type: data.type,
      amount: String(data.amount),
      description: data.description,
      note: data.note,
      transactionDate: new Date(data.transactionDate),
      receiptUrl: data.receiptUrl,
      isRecurring: data.isRecurring ?? false,
      recurringInterval: data.recurringInterval,
    })
    .returning();

  // Update wallet balance atomically
  const balanceChange = data.type === "income" ? data.amount : -data.amount;
  await db
    .update(wallet)
    .set({
      balance: sql`${wallet.balance} + ${balanceChange}`,
    })
    .where(and(eq(wallet.id, data.walletId), eq(wallet.userId, userId)));

  // Generate an automatic notification
  const capitalizedType =
    data.type.charAt(0).toUpperCase() + data.type.slice(1);
  await createNotification(userId, {
    title: `New ${capitalizedType} Added`,
    description: `You added $${data.amount.toLocaleString()} for "${data.description}"`,
    type: data.type === "income" ? "success" : "alert",
  }).catch((err) => console.error("Failed to create notification:", err));

  return { ...result, amount: Number(result?.amount) };
}

export async function updateTransaction(
  userId: string,
  id: string,
  data: {
    categoryId?: string;
    amount?: number;
    description?: string;
    note?: string;
    transactionDate?: string;
  },
) {
  const updateData: Record<string, unknown> = {};
  if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;
  if (data.amount !== undefined) updateData.amount = String(data.amount);
  if (data.description !== undefined) updateData.description = data.description;
  if (data.note !== undefined) updateData.note = data.note;
  if (data.transactionDate !== undefined)
    updateData.transactionDate = new Date(data.transactionDate);

  const [result] = await db
    .update(transaction)
    .set(updateData)
    .where(and(eq(transaction.id, id), eq(transaction.userId, userId)))
    .returning();

  if (!result) return null;
  return { ...result, amount: Number(result.amount) };
}

export async function deleteTransaction(userId: string, id: string) {
  // Get the transaction first to reverse the balance
  const existing = await getTransactionById(userId, id);
  if (!existing) return null;

  const [result] = await db
    .delete(transaction)
    .where(and(eq(transaction.id, id), eq(transaction.userId, userId)))
    .returning();

  if (result) {
    // Reverse the balance change
    const reversal =
      existing.type === "income" ? -existing.amount : existing.amount;
    await db
      .update(wallet)
      .set({
        balance: sql`${wallet.balance} + ${reversal}`,
      })
      .where(and(eq(wallet.id, existing.walletId), eq(wallet.userId, userId)));
  }

  return result ?? null;
}

export async function getTransactionSummary(
  userId: string,
  params?: { startDate?: string; endDate?: string; walletId?: string },
) {  const conditions: ReturnType<typeof eq>[] = [eq(transaction.userId, userId)];
  if (params?.walletId)
    conditions.push(eq(transaction.walletId, params.walletId));
  if (params?.startDate)
    conditions.push(
      gte(transaction.transactionDate, new Date(params.startDate)),
    );
  if (params?.endDate)
    conditions.push(lte(transaction.transactionDate, new Date(params.endDate)));

  const result = await db
    .select({
      type: transaction.type,
      total: sql<string>`COALESCE(SUM(${transaction.amount}), 0)`,
      count: count(),
    })
    .from(transaction)
    .where(and(...conditions))
    .groupBy(transaction.type);

  const income = result.find((r) => r.type === "income");
  const expense = result.find((r) => r.type === "expense");

  return {
    income: Number(income?.total ?? 0),
    expense: Number(expense?.total ?? 0),
    balance: Number(income?.total ?? 0) - Number(expense?.total ?? 0),
    transactionCount: (income?.count ?? 0) + (expense?.count ?? 0),
  };
}

export async function exportTransactions(
  userId: string,
  params: {
    type?: "income" | "expense";
    walletId?: string;
    categoryId?: string;
    startDate?: string;
    endDate?: string;
  },
) {
  const conditions = [eq(transaction.userId, userId)];
  if (params.type) conditions.push(eq(transaction.type, params.type));
  if (params.walletId)
    conditions.push(eq(transaction.walletId, params.walletId));
  if (params.categoryId)
    conditions.push(eq(transaction.categoryId, params.categoryId));
  if (params.startDate)
    conditions.push(
      gte(transaction.transactionDate, new Date(params.startDate)),
    );
  if (params.endDate)
    conditions.push(lte(transaction.transactionDate, new Date(params.endDate)));

  return db
    .select({
      date: transaction.transactionDate,
      description: transaction.description,
      category: category.name,
      wallet: wallet.name,
      type: transaction.type,
      amount: transaction.amount,
      note: transaction.note,
    })
    .from(transaction)
    .leftJoin(category, eq(transaction.categoryId, category.id))
    .leftJoin(wallet, eq(transaction.walletId, wallet.id))
    .where(and(...conditions))
    .orderBy(desc(transaction.transactionDate));
}
