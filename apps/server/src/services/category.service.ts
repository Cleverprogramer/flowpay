import { db } from "@flowpay/db";
import { category } from "@flowpay/db/schema/category";
import { and, asc, eq, isNull, or } from "drizzle-orm";

export async function listCategories(
  userId: string,
  type?: "income" | "expense",
) {
  const conditions = [or(eq(category.userId, userId), isNull(category.userId))];
  if (type) {
    conditions.push(eq(category.type, type));
  }

  return db
    .select()
    .from(category)
    .where(and(...conditions))
    .orderBy(asc(category.sortOrder));
}

export async function createCategory(
  userId: string,
  data: {
    name: string;
    emoji?: string;
    type: "income" | "expense";
    color?: string;
    sortOrder?: number;
  },
) {
  const [result] = await db
    .insert(category)
    .values({
      userId,
      name: data.name,
      emoji: data.emoji,
      type: data.type,
      color: data.color,
      sortOrder: data.sortOrder ?? 0,
      isSystem: false,
    })
    .returning();

  return result;
}

export async function updateCategory(
  userId: string,
  id: string,
  data: { name?: string; emoji?: string; color?: string; sortOrder?: number },
) {
  const [result] = await db
    .update(category)
    .set(data)
    .where(
      and(
        eq(category.id, id),
        eq(category.userId, userId),
        eq(category.isSystem, false),
      ),
    )
    .returning();

  return result ?? null;
}

export async function deleteCategory(userId: string, id: string) {
  const [result] = await db
    .delete(category)
    .where(
      and(
        eq(category.id, id),
        eq(category.userId, userId),
        eq(category.isSystem, false),
      ),
    )
    .returning();
  return result ?? null;
}

export async function getCategoryById(userId: string, id: string) {
  const [result] = await db
    .select()
    .from(category)
    .where(
      and(eq(category.id, id), or(eq(category.userId, userId), isNull(category.userId))),
    );
  return result ?? null;
}
