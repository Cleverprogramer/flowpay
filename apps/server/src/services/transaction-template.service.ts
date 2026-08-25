import { db } from "@flowpay/db";
import { transactionTemplate } from "@flowpay/db/schema/transaction-template";
import { desc, eq, and, sql } from "drizzle-orm";
import { createTransaction } from "./transaction.service";
import type {
  CreateTemplateInput,
  UpdateTemplateInput,
  ApplyTemplateInput,
} from "@flowpay/schema/transaction-template.schema";

export async function listTemplates(userId: string) {
  const rows = await db
    .select()
    .from(transactionTemplate)
    .where(eq(transactionTemplate.userId, userId))
    .orderBy(desc(transactionTemplate.usageCount), desc(transactionTemplate.createdAt));

  return rows.map((row) => ({ ...row, amount: Number(row.amount) }));
}

export async function createTemplate(userId: string, data: CreateTemplateInput) {
  const [result] = await db
    .insert(transactionTemplate)
    .values({
      userId,
      walletId: data.walletId,
      categoryId: data.categoryId,
      name: data.name,
      type: data.type,
      amount: String(data.amount),
      description: data.description,
      note: data.note,
    })
    .returning();

  return result ? { ...result, amount: Number(result.amount) } : null;
}

export async function updateTemplate(
  userId: string,
  id: string,
  data: UpdateTemplateInput,
) {
  const updateData: Record<string, unknown> = {};
  if (data.walletId !== undefined) updateData.walletId = data.walletId;
  if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;
  if (data.name !== undefined) updateData.name = data.name;
  if (data.type !== undefined) updateData.type = data.type;
  if (data.amount !== undefined) updateData.amount = String(data.amount);
  if (data.description !== undefined) updateData.description = data.description;
  if (data.note !== undefined) updateData.note = data.note;

  const [result] = await db
    .update(transactionTemplate)
    .set(updateData)
    .where(and(eq(transactionTemplate.id, id), eq(transactionTemplate.userId, userId)))
    .returning();

  return result ? { ...result, amount: Number(result.amount) } : null;
}

export async function deleteTemplate(userId: string, id: string) {
  const [result] = await db
    .delete(transactionTemplate)
    .where(and(eq(transactionTemplate.id, id), eq(transactionTemplate.userId, userId)))
    .returning();
  return result ?? null;
}

export async function applyTemplate(
  userId: string,
  id: string,
  options: ApplyTemplateInput,
) {
  const [template] = await db
    .select()
    .from(transactionTemplate)
    .where(and(eq(transactionTemplate.id, id), eq(transactionTemplate.userId, userId)));
  if (!template) return null;

  const created = await createTransaction(userId, {
    walletId: template.walletId,
    categoryId: template.categoryId ?? undefined,
    type: template.type,
    amount: options.amountOverride ?? Number(template.amount),
    description: template.description,
    note: template.note ?? undefined,
    transactionDate: options.transactionDate ?? new Date().toISOString(),
  });

  await db
    .update(transactionTemplate)
    .set({ usageCount: sql`${transactionTemplate.usageCount} + 1` })
    .where(eq(transactionTemplate.id, id));

  return created;
}
