import { db } from "@flowpay/db";
import { goal } from "@flowpay/db/schema/goal";
import { desc, eq, and, sql } from "drizzle-orm";

function withProgress(row: typeof goal.$inferSelect) {
  const target = Number(row.targetAmount);
  const saved = Number(row.savedAmount);
  return {
    ...row,
    targetAmount: target,
    savedAmount: saved,
    remaining: Math.max(0, target - saved),
    percentage:
      target > 0 ? Math.min(100, Math.round((saved / target) * 100)) : 0,
  };
}

export async function listGoals(userId: string) {
  const data = await db
    .select()
    .from(goal)
    .where(eq(goal.userId, userId))
    .orderBy(desc(goal.createdAt));
  return data.map(withProgress);
}

export async function getGoalById(userId: string, id: string) {
  const [result] = await db
    .select()
    .from(goal)
    .where(and(eq(goal.id, id), eq(goal.userId, userId)));
  return result ? withProgress(result) : null;
}

export async function createGoal(
  userId: string,
  data: {
    walletId?: string;
    name: string;
    description?: string;
    emoji?: string;
    color?: string;
    targetAmount: number;
    targetDate?: string;
  },
) {
  const [result] = await db
    .insert(goal)
    .values({
      userId,
      walletId: data.walletId,
      name: data.name,
      description: data.description,
      emoji: data.emoji ?? "🎯",
      color: data.color ?? "#6366f1",
      targetAmount: String(data.targetAmount),
      targetDate: data.targetDate ? new Date(data.targetDate) : null,
    })
    .returning();

  return result ? withProgress(result) : null;
}

export async function updateGoal(
  userId: string,
  id: string,
  data: {
    walletId?: string | null;
    name?: string;
    description?: string;
    emoji?: string;
    color?: string;
    targetAmount?: number;
    savedAmount?: number;
    targetDate?: string | null;
  },
) {
  const updateData: Record<string, unknown> = {};
  if (data.walletId !== undefined) updateData.walletId = data.walletId;
  if (data.name !== undefined) updateData.name = data.name;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.emoji !== undefined) updateData.emoji = data.emoji;
  if (data.color !== undefined) updateData.color = data.color;
  if (data.targetAmount !== undefined)
    updateData.targetAmount = String(data.targetAmount);
  if (data.savedAmount !== undefined)
    updateData.savedAmount = String(data.savedAmount);
  if (data.targetDate !== undefined)
    updateData.targetDate =
      data.targetDate === null ? null : new Date(data.targetDate);

  const [result] = await db
    .update(goal)
    .set(updateData)
    .where(and(eq(goal.id, id), eq(goal.userId, userId)))
    .returning();

  if (!result) return null;

  const completed = Number(result.savedAmount) >= Number(result.targetAmount);
  if (completed !== result.isCompleted) {
    const [updated] = await db
      .update(goal)
      .set({ isCompleted: completed })
      .where(eq(goal.id, result.id))
      .returning();
    return updated ? withProgress(updated) : null;
  }

  return withProgress(result);
}

export async function contributeToGoal(
  userId: string,
  id: string,
  amount: number,
) {
  const [result] = await db
    .update(goal)
    .set({ savedAmount: sql`${goal.savedAmount} + ${amount}` })
    .where(and(eq(goal.id, id), eq(goal.userId, userId)))
    .returning();

  if (!result) return null;

  const completed = Number(result.savedAmount) >= Number(result.targetAmount);
  if (completed && !result.isCompleted) {
    const [updated] = await db
      .update(goal)
      .set({ isCompleted: true })
      .where(eq(goal.id, result.id))
      .returning();
    return updated ? withProgress(updated) : null;
  }

  return withProgress(result);
}

export async function deleteGoal(userId: string, id: string) {
  const [result] = await db
    .delete(goal)
    .where(and(eq(goal.id, id), eq(goal.userId, userId)))
    .returning();
  return result ?? null;
}
