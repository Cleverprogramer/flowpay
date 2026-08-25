import { db } from "@flowpay/db";
import { invoice } from "@flowpay/db/schema/invoice";
import { and, eq, inArray, lt, lte, or, sql, isNull } from "drizzle-orm";
import { createNotification } from "./notification.service";

const REMINDER_COOLDOWN_DAYS = 7;

export async function processInvoiceReminders(userId: string) {
  const now = new Date();
  const cooldownCutoff = new Date(
    now.getTime() - REMINDER_COOLDOWN_DAYS * 24 * 60 * 60 * 1000,
  );

  const dueInvoices = await db
    .select({
      id: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      clientName: invoice.clientName,
      total: invoice.total,
      currency: invoice.currency,
      dueDate: invoice.dueDate,
      lastReminderAt: invoice.lastReminderAt,
    })
    .from(invoice)
    .where(
      and(
        eq(invoice.userId, userId),
        inArray(invoice.status, ["sent", "overdue"]),
        lte(invoice.dueDate, now),
        or(isNull(invoice.lastReminderAt), lt(invoice.lastReminderAt, cooldownCutoff)),
      ),
    );

  let remindersSent = 0;

  for (const item of dueInvoices) {
    await db
      .update(invoice)
      .set({
        status: "overdue",
        lastReminderAt: now,
        reminderCount: sql`${invoice.reminderCount} + 1`,
      })
      .where(eq(invoice.id, item.id));

    await createNotification(userId, {
      title: "Invoice Overdue",
      description: `${item.clientName} was reminded about invoice ${item.invoiceNumber} (${
        item.currency
      } ${Number(item.total).toLocaleString()})`,
      type: "alert",
      category: "invoice",
    }).catch((err) => console.error("Failed to notify invoice reminder:", err));

    remindersSent++;
  }

  return {
    checkedInvoices: dueInvoices.length,
    remindersSent,
  };
}
