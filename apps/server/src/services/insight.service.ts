import { db } from "@flowpay/db";
import { recurringRule } from "@flowpay/db/schema/recurring-rule";
import { transaction } from "@flowpay/db/schema/transaction";
import { and, eq, gte, lte, sql } from "drizzle-orm";
import {
  monthlyNormalizedCost,
  countNoSpendDays,
} from "@/utils/insights";

export async function getSubscriptionSummary(userId: string) {
  const rules = await db
    .select({
      description: recurringRule.description,
      amount: recurringRule.amount,
      interval: recurringRule.interval,
    })
    .from(recurringRule)
    .where(
      and(eq(recurringRule.userId, userId), eq(recurringRule.isActive, true)),
    );

  const subscriptions = rules
    .map((rule) => ({
      description: rule.description,
      amount: Number(rule.amount),
      interval: rule.interval,
      monthlyCost: monthlyNormalizedCost(Number(rule.amount), rule.interval),
    }))
    .sort((a, b) => b.monthlyCost - a.monthlyCost);

  return {
    subscriptions,
    count: subscriptions.length,
    totalMonthlyCost:
      Math.round(
        subscriptions.reduce((sum, item) => sum + item.monthlyCost, 0) * 100,
      ) / 100,
  };
}

export async function getNoSpendInsight(userId: string) {
  const now = new Date();
  const monthStart = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1),
  );

  const rows = await db
    .select({ date: transaction.transactionDate })
    .from(transaction)
    .where(
      and(
        eq(transaction.userId, userId),
        eq(transaction.type, "expense"),
        gte(transaction.transactionDate, monthStart),
        lte(transaction.transactionDate, now),
      ),
    );

  return countNoSpendDays(rows.map((row) => row.date), now);
}

export async function getSavingsRate(
  userId: string,
  params?: { startDate?: string; endDate?: string },
) {
  const now = new Date();
  const start = params?.startDate
    ? new Date(params.startDate)
    : new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const end = params?.endDate
    ? new Date(params.endDate)
    : new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0, 23, 59, 59));

  const rows = await db
    .select({
      type: transaction.type,
      total: sql<string>`COALESCE(SUM(${transaction.amount}), 0)`,
    })
    .from(transaction)
    .where(
      and(
        eq(transaction.userId, userId),
        gte(transaction.transactionDate, start),
        lte(transaction.transactionDate, end),
      ),
    )
    .groupBy(transaction.type);

  const income = Number(rows.find((row) => row.type === "income")?.total ?? 0);
  const expense = Number(rows.find((row) => row.type === "expense")?.total ?? 0);

  return {
    income,
    expense,
    saved: Math.round((income - expense) * 100) / 100,
    savingsRatePercentage:
      income > 0 ? Math.round(((income - expense) / income) * 100) : null,
  };
}

export async function getMonthOverMonthDelta(userId: string) {
  const now = new Date();
  const lastMonthStart = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1),
  );

  const rows = await db
    .select({
      month: sql<string>`EXTRACT(MONTH FROM ${transaction.transactionDate})::int`,
      expense: sql<string>`COALESCE(SUM(CASE WHEN ${transaction.type} = 'expense' THEN ${transaction.amount} ELSE 0 END), 0)`,
    })
    .from(transaction)
    .where(
      and(
        eq(transaction.userId, userId),
        gte(transaction.transactionDate, lastMonthStart),
        lte(transaction.transactionDate, now),
      ),
    )
    .groupBy(sql`EXTRACT(MONTH FROM ${transaction.transactionDate})`);

  const currentMonth = now.getUTCMonth() + 1;
  const thisMonth = Number(rows.find((row) => Number(row.month) === currentMonth)?.expense ?? 0);
  const previous =
    Number(rows.find((row) => Number(row.month) !== currentMonth)?.expense ?? 0);

  return {
    thisMonth,
    lastMonth: previous,
    delta: Math.round((thisMonth - previous) * 100) / 100,
    deltaPercentage:
      previous > 0
        ? Math.round(((thisMonth - previous) / previous) * 100)
        : null,
  };
}
