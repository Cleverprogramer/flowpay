export function convertAmount(
  amount: number,
  rate: number,
): number {
  const converted = amount * rate;
  return Math.round(converted * 100) / 100;
}

export function invertRate(rate: number): number {
  if (rate === 0) return 0;
  return Math.round((1 / rate) * 1e8) / 1e8;
}
