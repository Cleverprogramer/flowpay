import { db } from "@flowpay/db";
import { recurringRule } from "@flowpay/db/schema/recurring-rule";
import { transaction } from "@flowpay/db/schema/transaction";
import { and, eq, gte, lte } from "drizzle-orm";
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
