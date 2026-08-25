export function splitEvenly(amountInCents: number, count: number): number[] {
  if (count <= 0) return [];
  const base = Math.floor(amountInCents / count);
  const remainder = amountInCents % count;
  return Array.from(
    { length: count },
    (_, index) => base + (index < remainder ? 1 : 0),
  );
}
