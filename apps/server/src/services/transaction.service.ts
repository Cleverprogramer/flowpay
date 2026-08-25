import { db } from "@flowpay/db";
import { category } from "@flowpay/db/schema/category";
import { transaction } from "@flowpay/db/schema/transaction";
import { wallet } from "@flowpay/db/schema/wallet";
import { eq, and, asc, desc, sql, count, gte, lte, ilike, or } from "drizzle-orm";
import { createNotification } from "./notification.service";
import { checkBudgetAlerts } from "./budget-alert.service";
import { recordBalanceChange } from "./balance-audit.service";
import { suggestCategory } from "./categorization-rule.service";
import { evaluateWalletLimit } from "./wallet-limit.service";

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
    minAmount?: number;
    maxAmount?: number;
    sortBy: "date" | "amount";
    sortOrder: "asc" | "desc";
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
  if (params.minAmount !== undefined)
    conditions.push(gte(transaction.amount, String(params.minAmount)));
  if (params.maxAmount !== undefined)
    conditions.push(lte(transaction.amount, String(params.maxAmount)));

  const whereClause = and(...conditions);
  const sortColumn =
    params.sortBy === "amount" ? transaction.amount : transaction.transactionDate;

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
      .orderBy(
        params.sortOrder === "asc" ? asc(sortColumn) : desc(sortColumn),
      )
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
  // Fall back to the user's categorization rules when none supplied
  let categoryId = data.categoryId;
  if (!categoryId) {
    const suggestion = await suggestCategory(
      userId,
      data.description,
    ).catch(() => null);
    categoryId = suggestion?.categoryId;
  }

  const [result] = await db
    .insert(transaction)
    .values({
      userId,
      walletId: data.walletId,
      categoryId,
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

  // Update wallet balance atomically and journal the change
  const balanceChange = data.type === "income" ? data.amount : -data.amount;
  const [updatedWallet] = await db
    .update(wallet)
    .set({
      balance: sql`${wallet.balance} + ${balanceChange}`,
    })
    .where(and(eq(wallet.id, data.walletId), eq(wallet.userId, userId)))
    .returning({ balance: wallet.balance });

  if (updatedWallet && result) {
    await recordBalanceChange({
      userId,
      walletId: data.walletId,
      transactionId: result.id,
      reason: "transaction_created",
      changeAmount: balanceChange,
      balanceAfter: Number(updatedWallet.balance),
    }).catch((err) => console.error("Failed to record audit entry:", err));
  }

  // Generate an automatic notification
  const capitalizedType =
    data.type.charAt(0).toUpperCase() + data.type.slice(1);
  await createNotification(userId, {
    title: `New ${capitalizedType} Added`,
    description: `You added $${data.amount.toLocaleString()} for "${data.description}"`,
    type: data.type === "income" ? "success" : "alert",
    category: "transaction",
  }).catch((err) => console.error("Failed to create notification:", err));

  // Evaluate budget alerts after every expense so warnings stay current
  if (data.type === "expense") {
    await checkBudgetAlerts(userId).catch((err) =>
      console.error("Failed to check budget alerts:", err),
    );
    await evaluateWalletLimit(userId, data.walletId).catch((err) =>
      console.error("Failed to evaluate wallet limit:", err),
    );
  }

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
    const [revertedWallet] = await db
      .update(wallet)
      .set({
        balance: sql`${wallet.balance} + ${reversal}`,
      })
      .where(and(eq(wallet.id, existing.walletId), eq(wallet.userId, userId)))
      .returning({ balance: wallet.balance });

    if (revertedWallet) {
      await recordBalanceChange({
        userId,
        walletId: existing.walletId,
        reason: "transaction_deleted",
        changeAmount: reversal,
        balanceAfter: Number(revertedWallet.balance),
      }).catch((err) => console.error("Failed to record audit entry:", err));
    }
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

export async function searchTransactions(
  userId: string,
  params: { q: string; page: number; limit: number },
) {
  const term = `%${params.q}%`;
  const whereClause = and(
    eq(transaction.userId, userId),
    or(
      ilike(transaction.description, term),
      ilike(transaction.note, term),
    ),
  );
  const offset = (params.page - 1) * params.limit;

  const [data, totalResult] = await Promise.all([
    db
      .select({
        id: transaction.id,
        type: transaction.type,
        amount: transaction.amount,
        description: transaction.description,
        note: transaction.note,
        transactionDate: transaction.transactionDate,
        categoryEmoji: category.emoji,
        walletName: wallet.name,
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
    data: data.map((row) => ({ ...row, amount: Number(row.amount) })),
    pagination: {
      page: params.page,
      limit: params.limit,
      total: totalResult[0]?.count ?? 0,
      totalPages: Math.ceil((totalResult[0]?.count ?? 0) / params.limit),
    },
  };
}
