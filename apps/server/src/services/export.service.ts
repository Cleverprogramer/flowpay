import { db } from "@flowpay/db";
import { wallet } from "@flowpay/db/schema/wallet";
import { category } from "@flowpay/db/schema/category";
import { transaction } from "@flowpay/db/schema/transaction";
import { budget } from "@flowpay/db/schema/budget";
import { goal } from "@flowpay/db/schema/goal";
import { recurringRule } from "@flowpay/db/schema/recurring-rule";
import { invoice, invoiceItem } from "@flowpay/db/schema/invoice";
import { notification } from "@flowpay/db/schema/notification";
import { expenseSplit } from "@flowpay/db/schema/expense-split";
import { device } from "@flowpay/db/schema/device";
import { notificationPreference } from "@flowpay/db/schema/notification-preference";
import { eq } from "drizzle-orm";

export async function exportUserData(userId: string) {
  const [
    wallets,
    categories,
    transactions,
    budgets,
    goals,
    recurringRules,
    invoices,
    invoiceItems,
    notifications,
    expenseSplits,
    devices,
    preferences,
  ] = await Promise.all([
    db.select().from(wallet).where(eq(wallet.userId, userId)),
    db.select().from(category).where(eq(category.userId, userId)),
    db.select().from(transaction).where(eq(transaction.userId, userId)),
    db.select().from(budget).where(eq(budget.userId, userId)),
    db.select().from(goal).where(eq(goal.userId, userId)),
    db
      .select()
      .from(recurringRule)
      .where(eq(recurringRule.userId, userId)),
    db.select().from(invoice).where(eq(invoice.userId, userId)),
    db
      .select({ item: invoiceItem })
      .from(invoiceItem)
      .innerJoin(invoice, eq(invoiceItem.invoiceId, invoice.id))
      .where(eq(invoice.userId, userId)),
    db
      .select()
      .from(notification)
      .where(eq(notification.userId, userId)),
    db.select().from(expenseSplit).where(eq(expenseSplit.userId, userId)),
    db.select().from(device).where(eq(device.userId, userId)),
    db
      .select()
      .from(notificationPreference)
      .where(eq(notificationPreference.userId, userId)),
  ]);

  return {
    exportedAt: new Date().toISOString(),
    version: 2,
    data: {
      wallets,
      categories,
      transactions,
      budgets,
      goals,
      recurringRules,
      invoices,
      invoiceItems: invoiceItems.map((row) => row.item),
      notifications,
      expenseSplits,
      devices,
      notificationPreferences: preferences,
    },
  };
}
