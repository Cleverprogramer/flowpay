import { db } from "@flowpay/db";
import { budget } from "@flowpay/db/schema/budget";
import { category } from "@flowpay/db/schema/category";
import { transaction } from "@flowpay/db/schema/transaction";
import { and, eq, gte, lte, sql } from "drizzle-orm";
import {
  computeBudgetAlertLevel,
  shouldRaiseBudgetAlert,
  type BudgetAlertLevel,
} from "@/utils/budget-alerts";
import { createNotification } from "./notification.service";

export async function checkBudgetAlerts(userId: string) {
  const now = new Date();

  const activeBudgets = await db
    .select({
      id: budget.id,
      categoryId: budget.categoryId,
      amount: budget.amount,
      alertLevel: budget.alertLevel,
      startDate: budget.startDate,
      endDate: budget.endDate,
      categoryName: category.name,
      categoryEmoji: category.emoji,
    })
    .from(budget)
    .leftJoin(category, eq(budget.categoryId, category.id))
    .where(
      and(
        eq(budget.userId, userId),
        eq(budget.isActive, true),
        lte(budget.startDate, now),
        gte(budget.endDate, now),
      ),
    );

  let alertsRaised = 0;

  for (const item of activeBudgets) {
    const [spentResult] = await db
      .select({ total: sql<string>`COALESCE(SUM(${transaction.amount}), 0)` })
      .from(transaction)
      .where(
        and(
          eq(transaction.userId, userId),
          eq(transaction.categoryId, item.categoryId),
          eq(transaction.type, "expense"),
          gte(transaction.transactionDate, item.startDate),
          lte(transaction.transactionDate, item.endDate),
        ),
      );

    const spent = Number(spentResult?.total ?? 0);
    const limit = Number(item.amount);

    await db
      .update(budget)
      .set({ spent: String(spent) })
      .where(eq(budget.id, item.id));

    const level = computeBudgetAlertLevel(spent, limit);
    if (!shouldRaiseBudgetAlert(level, item.alertLevel as BudgetAlertLevel)) {
      continue;
    }

    const label =
      level === "exceeded" ? "exceeded your budget" : "close to your budget";
    await createNotification(userId, {
      title:
        level === "exceeded"
          ? "Budget Exceeded"
          : "Budget Warning",
      description: `${item.categoryEmoji ?? "💸"} You have ${label} for ${
        item.categoryName ?? "a category"
      }: $${spent.toLocaleString()} of $${limit.toLocaleString()}`,
      type: level === "exceeded" ? "alert" : "info",
    });

    await db
      .update(budget)
      .set({ alertLevel: level })
      .where(eq(budget.id, item.id));

    alertsRaised++;
  }

  return { checkedBudgets: activeBudgets.length, alertsRaised };
}
