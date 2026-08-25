import { db } from "@flowpay/db";
import { client } from "@flowpay/db/schema/client";
import { invoice } from "@flowpay/db/schema/invoice";
import { and, count, desc, eq, ilike, or } from "drizzle-orm";

export async function listClients(
  userId: string,
  params: {
    page: number;
    limit: number;
    search?: string;
  },
) {
  const offset = (params.page - 1) * params.limit;
  const conditions = [eq(client.userId, userId)];
  if (params.search) {
    const term = `%${params.search}%`;
    conditions.push(
      or(ilike(client.name, term), ilike(client.email, term))!,
    );
  }
  const whereClause = and(...conditions);

  const [data, totalResult] = await Promise.all([
    db
      .select()
      .from(client)
      .where(whereClause)
      .orderBy(desc(client.createdAt))
      .limit(params.limit)
      .offset(offset),
    db.select({ count: count() }).from(client).where(whereClause),
  ]);

  return {
    data,
    pagination: {
      page: params.page,
      limit: params.limit,
      total: totalResult[0]?.count ?? 0,
      totalPages: Math.ceil((totalResult[0]?.count ?? 0) / params.limit),
    },
  };
}

export async function getClientById(userId: string, id: string) {
  const [result] = await db
    .select()
    .from(client)
    .where(and(eq(client.id, id), eq(client.userId, userId)));
  return result ?? null;
}

export async function getClientInvoicesSummary(userId: string, clientId: string) {
  const rows = await db
    .select({
      status: invoice.status,
      total: invoice.total,
    })
    .from(invoice)
    .where(and(eq(invoice.clientId, clientId), eq(invoice.userId, userId)));

  const billed = rows.reduce((sum, row) => sum + Number(row.total), 0);
  const paid = rows
    .filter((row) => row.status === "paid")
    .reduce((sum, row) => sum + Number(row.total), 0);

  return {
    invoiceCount: rows.length,
    billed,
    paid,
    outstanding: billed - paid,
  };
}

export async function createClient(
  userId: string,
  data: {
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    taxId?: string;
    note?: string;
  },
) {
  const [result] = await db
    .insert(client)
    .values({ userId, ...data })
    .returning();
  return result;
}

export async function updateClient(
  userId: string,
  id: string,
  data: Record<string, unknown>,
) {
  const [result] = await db
    .update(client)
    .set(data)
    .where(and(eq(client.id, id), eq(client.userId, userId)))
    .returning();
  return result ?? null;
}

export async function deleteClient(userId: string, id: string) {
  const [result] = await db
    .delete(client)
    .where(and(eq(client.id, id), eq(client.userId, userId)))
    .returning();
  return result ?? null;
}
