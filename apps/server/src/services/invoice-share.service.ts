import { db } from "@flowpay/db";
import { invoice } from "@flowpay/db/schema/invoice";
import { and, eq } from "drizzle-orm";
import {
  getInvoiceById,
  renderInvoiceHtml,
} from "./invoice.service";

export async function generateShareToken(userId: string, invoiceId: string) {
  const [owned] = await db
    .select({ id: invoice.id })
    .from(invoice)
    .where(and(eq(invoice.id, invoiceId), eq(invoice.userId, userId)));
  if (!owned) return null;

  const token = crypto.randomUUID().replace(/-/g, "");
  const [updated] = await db
    .update(invoice)
    .set({ shareToken: token })
    .where(eq(invoice.id, invoiceId))
    .returning({ shareToken: invoice.shareToken });

  return updated ?? null;
}

export async function revokeShareToken(userId: string, invoiceId: string) {
  const [updated] = await db
    .update(invoice)
    .set({ shareToken: null })
    .where(and(eq(invoice.id, invoiceId), eq(invoice.userId, userId)))
    .returning({ id: invoice.id });
  return updated ?? null;
}

export async function getPublicInvoiceHtml(token: string) {
  if (!token) return null;

  const [record] = await db
    .select({ id: invoice.id, userId: invoice.userId })
    .from(invoice)
    .where(eq(invoice.shareToken, token));
  if (!record) return null;

  const data = await getInvoiceById(record.userId, record.id);
  if (!data || data.shareToken !== token) return null;

  return renderInvoiceHtml(data);
}
