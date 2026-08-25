export type RecurringInterval = "daily" | "weekly" | "monthly" | "yearly";

export function computeNextRunAt(
  from: Date,
  interval: RecurringInterval,
): Date {
  const next = new Date(from);
  switch (interval) {
    case "daily":
      next.setUTCDate(next.getUTCDate() + 1);
      break;
    case "weekly":
      next.setUTCDate(next.getUTCDate() + 7);
      break;
    case "monthly":
      next.setUTCMonth(next.getUTCMonth() + 1);
      break;
    case "yearly":
      next.setUTCFullYear(next.getUTCFullYear() + 1);
      break;
  }
  return next;
}
