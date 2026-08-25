import { db } from "@flowpay/db";
import { tag } from "@flowpay/db/schema/tag";
import { transactionTag } from "@flowpay/db/schema/tag";
import { transaction } from "@flowpay/db/schema/transaction";
import { and, count, desc, eq, inArray, sql } from "drizzle-orm";
import type {
  CreateTagInput,
  AttachTagsInput,
} from "@flowpay/schema/tag.schema";

export async function listTags(userId: string) {
  return db
    .select({
      id: tag.id,
      name: tag.name,
      color: tag.color,
      usageCount: sql<number>`(
        SELECT COUNT(*)::int FROM ${transactionTag}
        WHERE ${transactionTag.tagId} = ${tag.id}
      )`,
    })
    .from(tag)
    .where(eq(tag.userId, userId))
    .orderBy(desc(tag.createdAt));
}

export async function createTag(userId: string, data: CreateTagInput) {
  const [result] = await db
    .insert(tag)
    .values({ userId, name: data.name, color: data.color ?? "#6b7280" })
    .onConflictDoNothing()
    .returning();

  if (result) return result;

  const [existing] = await db
    .select()
    .from(tag)
    .where(and(eq(tag.userId, userId), eq(tag.name, data.name)));
  return existing ?? null;
}

export async function deleteTag(userId: string, id: string) {
  const [result] = await db
    .delete(tag)
    .where(and(eq(tag.id, id), eq(tag.userId, userId)))
    .returning();
  return result ?? null;
}

export async function attachTagsToTransaction(
  userId: string,
  data: AttachTagsInput,
) {
  const [record] = await db
    .select({ id: transaction.id })
    .from(transaction)
    .where(
      and(eq(transaction.id, data.transactionId), eq(transaction.userId, userId)),
    );
  if (!record) return null;

  const ownedTags = await db
    .select({ id: tag.id })
    .from(tag)
    .where(and(eq(tag.userId, userId), inArray(tag.id, data.tagIds)));

  if (!ownedTags.length) return { attached: 0 };

  await db
    .insert(transactionTag)
    .values(
      ownedTags.map((row) => ({
        transactionId: record.id,
        tagId: row.id,
      })),
    )
    .onConflictDoNothing();

  return { attached: ownedTags.length };
}

export async function detachTagFromTransaction(
  userId: string,
  transactionId: string,
  tagId: string,
) {
  const [owned] = await db
    .select({ id: tag.id })
    .from(tag)
    .where(and(eq(tag.id, tagId), eq(tag.userId, userId)));
  if (!owned) return null;

  await db
    .delete(transactionTag)
    .where(
      and(
        eq(transactionTag.transactionId, transactionId),
        eq(transactionTag.tagId, tagId),
      ),
    );
  return { success: true as const };
}

export async function listTransactionsByTag(
  userId: string,
  tagId: string,
  params: { page: number; limit: number },
) {
  const offset = (params.page - 1) * params.limit;
  const [owned] = await db
    .select({ id: tag.id })
    .from(tag)
    .where(and(eq(tag.id, tagId), eq(tag.userId, userId)));
  if (!owned) return null;

  const whereClause = sql`EXISTS (
    SELECT 1 FROM ${transactionTag}
    WHERE ${transactionTag.transactionId} = ${transaction.id}
      AND ${transactionTag.tagId} = ${tagId}
  )`;

  const [data, totalResult] = await Promise.all([
    db
      .select()
      .from(transaction)
      .where(and(eq(transaction.userId, userId), whereClause))
      .orderBy(desc(transaction.transactionDate))
      .limit(params.limit)
      .offset(offset),
    db
      .select({ count: count() })
      .from(transaction)
      .where(and(eq(transaction.userId, userId), whereClause)),
  ]);

  return {
    data: data.map((row) => ({ ...row, amount: Number(row.amount) })),
    pagination: {
      page: params.page,
      limit: params.limit,
      total: totalResult[0]?.count ?? 0,
      totalPages: Math.ceil((totalResult[0]?.count ?? 0) / params.limit),
    },
  };
}
