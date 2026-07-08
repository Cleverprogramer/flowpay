/**
 * Currency formatting utilities for the Flowpay app.
 * Replaces inline formatting logic duplicated across 7+ components.
 */

/** Format a value as currency: $1,234.56 */
export function formatCurrency(
  value: string | number,
  options?: { decimals?: boolean },
): string {
  if (typeof value === "string") return value;

  const { decimals = true } = options ?? {};

  return `$${value.toLocaleString(undefined, {
    minimumFractionDigits: decimals ? 2 : 0,
    maximumFractionDigits: 2,
  })}`;
}

/** Format a value as signed currency: +$500.00 or -$350.00 */
export function formatSignedCurrency(
  value: number,
  type: "income" | "expense",
): string {
  const sign = type === "income" ? "+" : "-";
  return `${sign}$${Math.abs(value).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/** Format a Date to the app's display format: "14 Aug, 4:30 pm" */
export function formatDateTime(date: Date): string {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "pm" : "am";
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes.toString().padStart(2, "0");
  return `${day} ${month}, ${formattedHours}:${formattedMinutes} ${ampm}`;
}
