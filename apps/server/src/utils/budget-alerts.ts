export type BudgetAlertLevel = "none" | "warning" | "exceeded";

const ALERT_LEVEL_ORDER: Record<BudgetAlertLevel, number> = {
  none: 0,
  warning: 1,
  exceeded: 2,
};

export function computeBudgetAlertLevel(
  spent: number,
  amount: number,
): BudgetAlertLevel {
  if (amount <= 0) return "none";
  const ratio = spent / amount;
  if (ratio >= 1) return "exceeded";
  if (ratio >= 0.8) return "warning";
  return "none";
}

export function shouldRaiseBudgetAlert(
  current: BudgetAlertLevel,
  previous: BudgetAlertLevel,
): boolean {
  return (
    current !== "none" &&
    ALERT_LEVEL_ORDER[current] > ALERT_LEVEL_ORDER[previous]
  );
}
