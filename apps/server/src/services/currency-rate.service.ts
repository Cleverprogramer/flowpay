import { db } from "@flowpay/db";
import { currencyRate } from "@flowpay/db/schema/currency-rate";
import { and, eq } from "drizzle-orm";
import {
  convertAmount,
  invertRate,
} from "@/utils/currency";
import type {
  UpsertCurrencyRateInput,
  ConvertCurrencyQuery,
} from "@flowpay/schema/currency-rate.schema";

export async function listCurrencyRates(userId: string) {
  return db
    .select()
    .from(currencyRate)
    .where(eq(currencyRate.userId, userId));
}

export async function upsertCurrencyRate(
  userId: string,
  data: UpsertCurrencyRateInput,
) {
  const base = data.baseCurrency.toUpperCase();
  const target = data.targetCurrency.toUpperCase();

  const [result] = await db
    .insert(currencyRate)
    .values({
      userId,
      baseCurrency: base,
      targetCurrency: target,
      rate: String(data.rate),
    })
    .onConflictDoUpdate({
      target: [
        currencyRate.userId,
        currencyRate.baseCurrency,
        currencyRate.targetCurrency,
      ],
      set: { rate: String(data.rate) },
    })
    .returning();

  return result;
}

export async function deleteCurrencyRate(userId: string, id: string) {
  const [result] = await db
    .delete(currencyRate)
    .where(and(eq(currencyRate.id, id), eq(currencyRate.userId, userId)))
    .returning();
  return result ?? null;
}

export async function convertCurrency(
  userId: string,
  query: ConvertCurrencyQuery,
) {
  const from = query.from.toUpperCase();
  const to = query.to.toUpperCase();

  if (from === to) {
    return {
      from,
      to,
      amount: query.amount,
      converted: convertAmount(query.amount, 1),
      rate: 1,
      source: "identity" as const,
    };
  }

  const [direct] = await db
    .select({ rate: currencyRate.rate })
    .from(currencyRate)
    .where(
      and(
        eq(currencyRate.userId, userId),
        eq(currencyRate.baseCurrency, from),
        eq(currencyRate.targetCurrency, to),
      ),
    );

  if (direct) {
    const rate = Number(direct.rate);
    return {
      from,
      to,
      amount: query.amount,
      converted: convertAmount(query.amount, rate),
      rate,
      source: "stored" as const,
    };
  }

  const [inverse] = await db
    .select({ rate: currencyRate.rate })
    .from(currencyRate)
    .where(
      and(
        eq(currencyRate.userId, userId),
        eq(currencyRate.baseCurrency, to),
        eq(currencyRate.targetCurrency, from),
      ),
    );

  if (inverse) {
    const rate = invertRate(Number(inverse.rate));
    return {
      from,
      to,
      amount: query.amount,
      converted: convertAmount(query.amount, rate),
      rate,
      source: "inverted" as const,
    };
  }

  return null;
}
