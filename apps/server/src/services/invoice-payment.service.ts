import { db } from "@flowpay/db";
import { invoicePayment } from "@flowpay/db/schema/invoice-payment";
import { invoice } from "@flowpay/db/schema/invoice";
import { and, desc, eq, sql } from "drizzle-orm";
import type {
  CreateInvoicePaymentInput,
} from "@flowpay/schema/invoice-payment.schema";

async function loadInvoice(userId: string, invoiceId: string) {
  const [record] = await db
    .select()
    .from(invoice)
    .where(and(eq(invoice.id, invoiceId), eq(invoice.userId, userId)));
  return record ?? null;
}

export async function listInvoicePayments(userId: string, invoiceId: string) {
  const owned = await loadInvoice(userId, invoiceId);
  if (!owned) return null;

  const rows = await db
    .select()
    .from(invoicePayment)
    .where(
      and(
        eq(invoicePayment.userId, userId),
        eq(invoicePayment.invoiceId, invoiceId),
      ),
    )
    .orderBy(desc(invoicePayment.paidAt));

  const paidTotal = rows.reduce((sum, row) => sum + Number(row.amount), 0);

  return {
    data: rows.map((row) => ({ ...row, amount: Number(row.amount) })),
    summary: {
      total: Number(owned.total),
      paid: paidTotal,
      outstanding: Math.max(0, Number(owned.total) - paidTotal),
      currency: owned.currency,
    },
  };
}

export async function createInvoicePayment(
  userId: string,
  invoiceId: string,
  data: CreateInvoicePaymentInput,
) {
  const owned = await loadInvoice(userId, invoiceId);
  if (!owned) return null;

  const [payment] = await db
    .insert(invoicePayment)
    .values({
      userId,
      invoiceId,
      amount: String(data.amount),
      method: data.method ?? "bank_transfer",
      paidAt: data.paidAt ? new Date(data.paidAt) : new Date(),
      note: data.note,
    })
    .returning();

  const [totals] = await db
    .select({
      paid: sql<string>`COALESCE(SUM(${invoicePayment.amount}), 0)`,
    })
    .from(invoicePayment)
    .where(eq(invoicePayment.invoiceId, invoiceId));

  const paidTotal = Number(totals?.paid ?? 0);
  const total = Number(owned.total);

  if (paidTotal >= total && owned.status !== "paid") {
    await db
      .update(invoice)
      .set({ status: "paid", paidDate: new Date() })
      .where(eq(invoice.id, invoiceId));
  } else if (paidTotal < total && owned.status === "draft") {
    await db
      .update(invoice)
      .set({ status: "sent" })
      .where(eq(invoice.id, invoiceId));
  }

  return payment ? { ...payment, amount: Number(payment.amount) } : null;
}
