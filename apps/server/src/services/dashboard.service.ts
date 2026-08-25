import { db } from "@flowpay/db";
import { budget } from "@flowpay/db/schema/budget";
import { category } from "@flowpay/db/schema/category";
import { goal } from "@flowpay/db/schema/goal";
import { recurringRule } from "@flowpay/db/schema/recurring-rule";
import { transaction } from "@flowpay/db/schema/transaction";
import { wallet } from "@flowpay/db/schema/wallet";
import {
  and,
  asc,
  desc,
  eq,
  gte,
  lte,
  sql,
} from "drizzle-orm";

export async function getDashboard(userId: string) {
  const now = new Date();
  const monthStart = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1),
  );
  const monthEnd = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0, 23, 59, 59),
  );

  const [totalsRows, recentTransactions, wallets, upcomingRules, activeGoals, budgetRows] =
    await Promise.all([
      db
        .select({
          type: transaction.type,
          total: sql<string>`COALESCE(SUM(${transaction.amount}), 0)`,
          count: sql<number>`COUNT(*)::int`,
        })
        .from(transaction)
        .where(
          and(
            eq(transaction.userId, userId),
            gte(transaction.transactionDate, monthStart),
            lte(transaction.transactionDate, monthEnd),
          ),
        )
        .groupBy(transaction.type),
      db
        .select({
          id: transaction.id,
          type: transaction.type,
          amount: transaction.amount,
          description: transaction.description,
          transactionDate: transaction.transactionDate,
          categoryEmoji: category.emoji,
          walletName: wallet.name,
        })
        .from(transaction)
        .leftJoin(category, eq(transaction.categoryId, category.id))
        .leftJoin(wallet, eq(transaction.walletId, wallet.id))
        .where(eq(transaction.userId, userId))
        .orderBy(desc(transaction.transactionDate))
        .limit(5),
      db
        .select({
          id: wallet.id,
          name: wallet.name,
          type: wallet.type,
          balance: wallet.balance,
          currency: wallet.currency,
        })
        .from(wallet)
        .where(
          and(eq(wallet.userId, userId), eq(wallet.archived, false)),
        )
        .orderBy(desc(wallet.balance)),
      db
        .select({
          id: recurringRule.id,
          description: recurringRule.description,
          amount: recurringRule.amount,
          type: recurringRule.type,
          interval: recurringRule.interval,
          nextRunAt: recurringRule.nextRunAt,
        })
        .from(recurringRule)
        .where(
          and(
            eq(recurringRule.userId, userId),
            eq(recurringRule.isActive, true),
          ),
        )
        .orderBy(asc(recurringRule.nextRunAt))
        .limit(3),
      db
        .select()
        .from(goal)
        .where(
          and(eq(goal.userId, userId), eq(goal.isCompleted, false)),
        )
        .orderBy(desc(goal.createdAt))
        .limit(3),
      db
        .select({
          id: budget.id,
          amount: budget.amount,
          spent: budget.spent,
          categoryName: category.name,
          categoryEmoji: category.emoji,
        })
        .from(budget)
        .leftJoin(category, eq(budget.categoryId, category.id))
        .where(
          and(eq(budget.userId, userId), eq(budget.isActive, true)),
        ),
    ]);

  const income = Number(
    totalsRows.find((row) => row.type === "income")?.total ?? 0,
  );
  const expense = Number(
    totalsRows.find((row) => row.type === "expense")?.total ?? 0,
  );

  return {
    thisMonth: {
      income,
      expense,
      net: income - expense,
      transactionCount:
        totalsRows.reduce((sum, row) => sum + row.count, 0),
    },
    recentTransactions: recentTransactions.map((row) => ({
      ...row,
      amount: Number(row.amount),
    })),
    wallets: wallets.map((row) => ({ ...row, balance: Number(row.balance) })),
    upcomingRecurring: upcomingRules.map((row) => ({
      ...row,
      amount: Number(row.amount),
    })),
    goals: activeGoals.map((row) => ({
      id: row.id,
      name: row.name,
      emoji: row.emoji,
      color: row.color,
      targetAmount: Number(row.targetAmount),
      savedAmount: Number(row.savedAmount),
      percentage:
        Number(row.targetAmount) > 0
          ? Math.min(
              100,
              Math.round(
                (Number(row.savedAmount) / Number(row.targetAmount)) * 100,
              ),
            )
          : 0,
    })),
    budgets: budgetRows
      .map((row) => ({
        id: row.id,
        categoryName: row.categoryName,
        categoryEmoji: row.categoryEmoji,
        amount: Number(row.amount),
        spent: Number(row.spent),
        percentage:
          Number(row.amount) > 0
            ? Math.min(
                100,
                Math.round((Number(row.spent) / Number(row.amount)) * 100),
              )
            : 0,
      }))
      .sort((a, b) => b.percentage - a.percentage),
  };
}
