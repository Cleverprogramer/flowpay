import { db } from "@flowpay/db";
import { categorizationRule } from "@flowpay/db/schema/categorization-rule";
import { and, asc, eq } from "drizzle-orm";
import {
  matchCategory,
  type CategoryRule,
} from "@/utils/categorize";
import type {
  CreateCategorizationRuleInput,
  UpdateCategorizationRuleInput,
} from "@flowpay/schema/categorization-rule.schema";

export async function listCategorizationRules(userId: string) {
  return db
    .select()
    .from(categorizationRule)
    .where(eq(categorizationRule.userId, userId))
    .orderBy(asc(categorizationRule.priority));
}

async function loadActiveRules(userId: string): Promise<CategoryRule[]> {
  const rows = await db
    .select({
      keyword: categorizationRule.keyword,
      matchType: categorizationRule.matchType,
      priority: categorizationRule.priority,
      categoryId: categorizationRule.categoryId,
    })
    .from(categorizationRule)
    .where(
      and(
        eq(categorizationRule.userId, userId),
        eq(categorizationRule.isActive, true),
      ),
    );
  return rows;
}

export async function suggestCategory(userId: string, description: string) {
  const rules = await loadActiveRules(userId);
  const categoryId = matchCategory(description, rules);
  return categoryId ? { categoryId } : null;
}

export async function createCategorizationRule(
  userId: string,
  data: CreateCategorizationRuleInput,
) {
  const [result] = await db
    .insert(categorizationRule)
    .values({
      userId,
      categoryId: data.categoryId,
      keyword: data.keyword,
      matchType: data.matchType ?? "contains",
      priority: data.priority ?? 100,
    })
    .returning();
  return result;
}

export async function updateCategorizationRule(
  userId: string,
  id: string,
  data: UpdateCategorizationRuleInput,
) {
  const updateData: Record<string, unknown> = {};
  if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;
  if (data.keyword !== undefined) updateData.keyword = data.keyword;
  if (data.matchType !== undefined) updateData.matchType = data.matchType;
  if (data.priority !== undefined) updateData.priority = data.priority;
  if (data.isActive !== undefined) updateData.isActive = data.isActive;

  const [result] = await db
    .update(categorizationRule)
    .set(updateData)
    .where(
      and(eq(categorizationRule.id, id), eq(categorizationRule.userId, userId)),
    )
    .returning();
  return result ?? null;
}

export async function deleteCategorizationRule(userId: string, id: string) {
  const [result] = await db
    .delete(categorizationRule)
    .where(
      and(eq(categorizationRule.id, id), eq(categorizationRule.userId, userId)),
    )
    .returning();
  return result ?? null;
}
