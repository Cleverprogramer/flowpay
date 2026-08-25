import { db } from "@flowpay/db";
import { invoice, invoiceItem } from "@flowpay/db/schema/invoice";
import { eq, and, desc, count } from "drizzle-orm";
import { createNotification } from "./notification.service";

export async function listInvoices(
  userId: string,
  params: {
    page: number;
    limit: number;
    status?: "draft" | "sent" | "paid" | "overdue" | "cancelled";
  },
) {
  const offset = (params.page - 1) * params.limit;
  const conditions: ReturnType<typeof eq>[] = [eq(invoice.userId, userId)];
  if (params.status) conditions.push(eq(invoice.status, params.status));

  const whereClause = and(...conditions);

  const [data, totalResult] = await Promise.all([
    db
      .select()
      .from(invoice)
      .where(whereClause)
      .orderBy(desc(invoice.createdAt))
      .limit(params.limit)
      .offset(offset),
    db.select({ count: count() }).from(invoice).where(whereClause),
  ]);

  return {
    data: data.map((row) => ({
      ...row,
      subtotal: Number(row.subtotal),
      taxRate: Number(row.taxRate),
      taxAmount: Number(row.taxAmount),
      total: Number(row.total),
    })),
    pagination: {
      page: params.page,
      limit: params.limit,
      total: totalResult[0]?.count ?? 0,
      totalPages: Math.ceil((totalResult[0]?.count ?? 0) / params.limit),
    },
  };
}

export async function getInvoiceById(userId: string, id: string) {
  const [result] = await db
    .select()
    .from(invoice)
    .where(and(eq(invoice.id, id), eq(invoice.userId, userId)));

  if (!result) return null;

  const items = await db
    .select()
    .from(invoiceItem)
    .where(eq(invoiceItem.invoiceId, id));

  return {
    ...result,
    subtotal: Number(result.subtotal),
    taxRate: Number(result.taxRate),
    taxAmount: Number(result.taxAmount),
    total: Number(result.total),
    items: items.map((item) => ({
      ...item,
      unitPrice: Number(item.unitPrice),
      total: Number(item.total),
    })),
  };
}

export async function createInvoice(
  userId: string,
  data: {
    invoiceNumber: string;
    clientId?: string;
    clientName: string;
    clientEmail?: string;
    currency?: string;
    issueDate: string;
    dueDate: string;
    note?: string;
    taxRate?: number;
    items: Array<{
      description: string;
      quantity: number;
      unitPrice: number;
    }>;
  },
) {
  const items = data.items.map((item, index) => ({
    ...item,
    total: item.quantity * item.unitPrice,
    sortOrder: index,
  }));

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const taxRate = data.taxRate ?? 0;
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount;

  const [result] = await db
    .insert(invoice)
    .values({
      userId,
      invoiceNumber: data.invoiceNumber,
      clientId: data.clientId,
      clientName: data.clientName,
      clientEmail: data.clientEmail,
      currency: data.currency ?? "USD",
      issueDate: new Date(data.issueDate),
      dueDate: new Date(data.dueDate),
      note: data.note,
      subtotal: String(subtotal),
      taxRate: String(taxRate),
      taxAmount: String(taxAmount),
      total: String(total),
    })
    .returning();

  if (!result) throw new Error("Failed to create invoice");

  if (items.length > 0) {
    await db.insert(invoiceItem).values(
      items.map((item) => ({
        invoiceId: result.id,
        description: item.description,
        quantity: item.quantity,
        unitPrice: String(item.unitPrice),
        total: String(item.total),
        sortOrder: item.sortOrder,
      })),
    );
  }

  // Generate notification for new invoice
  await createNotification(userId, {
    title: "Invoice Created",
    description: `Invoice ${data.invoiceNumber} for $${total.toLocaleString()} created.`,
    type: "info",
  }).catch(err => console.error("Failed to create notification:", err));

  return {
    ...result,
    subtotal: Number(result.subtotal),
    taxRate: Number(result.taxRate),
    taxAmount: Number(result.taxAmount),
    total: Number(result.total),
    items,
  };
}

export async function updateInvoiceStatus(
  userId: string,
  id: string,
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled",
) {
  const updateData: Record<string, unknown> = { status };
  if (status === "paid") updateData.paidDate = new Date();

  const [result] = await db
    .update(invoice)
    .set(updateData)
    .where(and(eq(invoice.id, id), eq(invoice.userId, userId)))
    .returning();

  if (!result) return null;

  // Generate notification for invoice status update
  const capitalizedStatus = status.charAt(0).toUpperCase() + status.slice(1);
  let notifType: "success" | "alert" | "info" = "info";
  if (status === "paid" || status === "sent") notifType = "success";
  else if (status === "cancelled" || status === "overdue") notifType = "alert";

  await createNotification(userId, {
    title: `Invoice ${capitalizedStatus}`,
    description: `Invoice ${result.invoiceNumber} is now ${status}.`,
    type: notifType,
  }).catch(err => console.error("Failed to create notification:", err));

  return {
    ...result,
    subtotal: Number(result.subtotal),
    taxRate: Number(result.taxRate),
    taxAmount: Number(result.taxAmount),
    total: Number(result.total),
  };
}

export async function deleteInvoice(userId: string, id: string) {
  const [result] = await db
    .delete(invoice)
    .where(and(eq(invoice.id, id), eq(invoice.userId, userId)))
    .returning();
  return result ?? null;
}

/**
 * Generate a professional HTML string for an invoice, suitable for PDF rendering.
 */
export async function generateInvoiceHtml(userId: string, id: string) {
  const data = await getInvoiceById(userId, id);
  if (!data) return null;

  const statusColors: Record<string, string> = {
    draft: "#6B7280",
    sent: "#3B82F6",
    paid: "#10B981",
    overdue: "#EF4444",
    cancelled: "#9CA3AF",
  };

  const statusColor = statusColors[data.status] ?? "#6B7280";

  const formatDate = (d: Date | string | null) => {
    if (!d) return "—";
    const date = new Date(d);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (val: number) =>
    `${data.currency} ${val.toFixed(2)}`;

  const itemsRows = data.items
    .map(
      (item, i) => `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #E5E7EB;">${i + 1}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #E5E7EB;">${item.description}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #E5E7EB;text-align:center;">${item.quantity}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #E5E7EB;text-align:right;">${formatCurrency(item.unitPrice)}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #E5E7EB;text-align:right;">${formatCurrency(item.total)}</td>
      </tr>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Invoice ${data.invoiceNumber}</title>
</head>
<body style="margin:0;padding:40px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#1F2937;background:#fff;">
  <div style="max-width:720px;margin:0 auto;">
    <!-- Header -->
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:40px;">
      <div>
        <h1 style="margin:0;font-size:28px;font-weight:800;color:#1C3E38;">INVOICE</h1>
        <p style="margin:4px 0 0;font-size:14px;color:#6B7280;">${data.invoiceNumber}</p>
      </div>
      <div style="display:inline-block;padding:6px 16px;border-radius:20px;background:${statusColor};color:#fff;font-size:12px;font-weight:700;text-transform:uppercase;">
        ${data.status}
      </div>
    </div>

    <!-- Dates & Client -->
    <div style="display:flex;justify-content:space-between;margin-bottom:32px;">
      <div>
        <p style="margin:0 0 4px;font-size:11px;color:#9CA3AF;text-transform:uppercase;letter-spacing:0.5px;">Issue Date</p>
        <p style="margin:0;font-size:14px;font-weight:600;">${formatDate(data.issueDate)}</p>
        <p style="margin:12px 0 4px;font-size:11px;color:#9CA3AF;text-transform:uppercase;letter-spacing:0.5px;">Due Date</p>
        <p style="margin:0;font-size:14px;font-weight:600;">${formatDate(data.dueDate)}</p>
      </div>
      <div style="text-align:right;">
        <p style="margin:0 0 4px;font-size:11px;color:#9CA3AF;text-transform:uppercase;letter-spacing:0.5px;">Bill To</p>
        <p style="margin:0;font-size:14px;font-weight:600;">${data.clientName}</p>
        ${data.clientEmail ? `<p style="margin:4px 0 0;font-size:13px;color:#6B7280;">${data.clientEmail}</p>` : ""}
      </div>
    </div>

    <!-- Items Table -->
    <table style="width:100%;border-collapse:collapse;margin-bottom:24px;font-size:13px;">
      <thead>
        <tr style="background:#F9FAFB;">
          <th style="padding:10px 12px;text-align:left;border-bottom:2px solid #E5E7EB;color:#6B7280;font-weight:600;">#</th>
          <th style="padding:10px 12px;text-align:left;border-bottom:2px solid #E5E7EB;color:#6B7280;font-weight:600;">Description</th>
          <th style="padding:10px 12px;text-align:center;border-bottom:2px solid #E5E7EB;color:#6B7280;font-weight:600;">Qty</th>
          <th style="padding:10px 12px;text-align:right;border-bottom:2px solid #E5E7EB;color:#6B7280;font-weight:600;">Unit Price</th>
          <th style="padding:10px 12px;text-align:right;border-bottom:2px solid #E5E7EB;color:#6B7280;font-weight:600;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${itemsRows}
      </tbody>
    </table>

    <!-- Totals -->
    <div style="display:flex;justify-content:flex-end;margin-bottom:32px;">
      <div style="width:240px;">
        <div style="display:flex;justify-content:space-between;padding:6px 0;font-size:13px;color:#6B7280;">
          <span>Subtotal</span>
          <span>${formatCurrency(data.subtotal)}</span>
        </div>
        <div style="display:flex;justify-content:space-between;padding:6px 0;font-size:13px;color:#6B7280;">
          <span>Tax (${data.taxRate}%)</span>
          <span>${formatCurrency(data.taxAmount)}</span>
        </div>
        <div style="display:flex;justify-content:space-between;padding:10px 0;font-size:18px;font-weight:800;border-top:2px solid #1C3E38;margin-top:8px;">
          <span>Total</span>
          <span>${formatCurrency(data.total)}</span>
        </div>
      </div>
    </div>

    ${data.note ? `<div style="padding:16px;background:#F9FAFB;border-radius:12px;margin-bottom:24px;"><p style="margin:0 0 4px;font-size:11px;color:#9CA3AF;text-transform:uppercase;letter-spacing:0.5px;">Note</p><p style="margin:0;font-size:13px;color:#4B5563;">${data.note}</p></div>` : ""}

    ${data.paidDate ? `<p style="font-size:12px;color:#10B981;text-align:center;">Paid on ${formatDate(data.paidDate)}</p>` : ""}
  </div>
</body>
</html>`;
}
