import { db } from "@flowpay/db";
import { recurringRule } from "@flowpay/db/schema/recurring-rule";
import { wallet } from "@flowpay/db/schema/wallet";
import { currencyRate } from "@flowpay/db/schema/currency-rate";
import { and, eq, lte, sql } from "drizzle-orm";
import { computeNextRunAt } from "@/utils/recurrence";
import {
  convertAmount,
  invertRate,
} from "@/utils/currency";

export async function getNetWorth(userId: string) {
  const rows = await db
    .select({
      currency: wallet.currency,
      total: sql<string>`COALESCE(SUM(${wallet.balance}), 0)`,
    })
    .from(wallet)
    .where(and(eq(wallet.userId, userId), eq(wallet.archived, false)))
    .groupBy(wallet.currency);

  const byCurrency = rows.map((row) => ({
    currency: row.currency,
    total: Number(row.total),
  }));

  const primaryCurrency = byCurrency[0]?.currency ?? "USD";

  const rates = await db
    .select()
    .from(currencyRate)
    .where(eq(currencyRate.userId, userId));

  const rateFor = (from: string, to: string): number | null => {
    if (from === to) return 1;
    const direct = rates.find(
      (rate) =>
        rate.baseCurrency === from && rate.targetCurrency === to,
    );
    if (direct) return Number(direct.rate);
    const inverse = rates.find(
      (rate) =>
        rate.baseCurrency === to && rate.targetCurrency === from,
    );
    return inverse ? invertRate(Number(inverse.rate)) : null;
  };

  let convertedTotal = 0;
  let fullyConverted = true;

  for (const entry of byCurrency) {
    const rate = rateFor(entry.currency, primaryCurrency);
    if (rate === null) {
      fullyConverted = false;
      continue;
    }
    convertedTotal += convertAmount(entry.total, rate);
  }

  return {
    byCurrency,
    primaryCurrency,
    netWorth: convertedTotal,
    convertedToFx: fullyConverted && byCurrency.length > 1,
    walletCount: rows.length,
  };
}

const PROJECTION_DAYS = 30;

export async function getCashFlowProjection(userId: string) {
  const now = new Date();
  const horizon = new Date(now.getTime() + PROJECTION_DAYS * 24 * 60 * 60 * 1000);

  const rules = await db
    .select({
      type: recurringRule.type,
      amount: recurringRule.amount,
      interval: recurringRule.interval,
      nextRunAt: recurringRule.nextRunAt,
    })
    .from(recurringRule)
    .where(
      and(
        eq(recurringRule.userId, userId),
        eq(recurringRule.isActive, true),
        lte(recurringRule.nextRunAt, horizon),
      ),
    );

  let projectedIncome = 0;
  let projectedExpense = 0;

  for (const rule of rules) {
    let occurrences = 0;
    let cursor = new Date(rule.nextRunAt);
    while (cursor <= horizon && occurrences < 62) {
      if (rule.type === "income") projectedIncome += Number(rule.amount);
      else projectedExpense += Number(rule.amount);
      cursor = computeNextRunAt(cursor, rule.interval);
      occurrences++;
    }
  }

  return {
    horizonDays: PROJECTION_DAYS,
    upcomingIncome: Math.round(projectedIncome * 100) / 100,
    upcomingExpense: Math.round(projectedExpense * 100) / 100,
    projectedNet: Math.round((projectedIncome - projectedExpense) * 100) / 100,
    basedOnRules: rules.length,
  };
}
