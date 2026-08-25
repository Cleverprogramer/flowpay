const DAYS_IN_MONTH_FACTORS = {
  daily: 30,
  weekly: 30 / 7,
  monthly: 1,
  yearly: 1 / 12,
} as const;

export type BillingInterval = keyof typeof DAYS_IN_MONTH_FACTORS;

export function monthlyNormalizedCost(
  amount: number,
  interval: BillingInterval,
): number {
  return Math.round(amount * DAYS_IN_MONTH_FACTORS[interval] * 100) / 100;
}

export function countNoSpendDays(
  expenseDates: Array<Date | string>,
  now: Date,
): { noSpendDays: number; daysElapsed: number } {
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();
  const daysElapsed = now.getUTCDate();

  if (daysElapsed === 1) return { noSpendDays: 0, daysElapsed };

  const spendDays = new Set(
    expenseDates
      .map((value) => new Date(value))
      .filter(
        (date) =>
          date.getUTCFullYear() === year && date.getUTCMonth() === month,
      )
      .map((date) => date.getUTCDate()),
  );

  let noSpendDays = 0;
  for (let day = 1; day <= daysElapsed; day++) {
    if (!spendDays.has(day)) noSpendDays++;
  }

  return { noSpendDays, daysElapsed };
}
