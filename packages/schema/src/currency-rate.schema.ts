import { z } from "zod";

export const upsertCurrencyRateSchema = z.object({
  baseCurrency: z.string().min(1).max(10),
  targetCurrency: z.string().min(1).max(10),
  rate: z.number().positive(),
});

export const convertCurrencySchema = z.object({
  from: z.string().min(1).max(10),
  to: z.string().min(1).max(10),
  amount: z.coerce.number().nonnegative(),
});

export type UpsertCurrencyRateInput = z.infer<
  typeof upsertCurrencyRateSchema
>;
export type ConvertCurrencyQuery = z.infer<typeof convertCurrencySchema>;
