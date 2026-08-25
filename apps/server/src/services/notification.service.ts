import { db } from "@flowpay/db";
import { notification } from "@flowpay/db/schema/notification";
import { eq, and, desc, count } from "drizzle-orm";
import {
  isCategoryEnabled,
  type NotificationCategory,
} from "./notification-preference.service";

export async function listNotifications(
  userId: string,
  params: {
    page: number;
    limit: number;
  },
) {
  const offset = (params.page - 1) * params.limit;
  const whereClause = eq(notification.userId, userId);

  const [data, totalResult] = await Promise.all([
    db
      .select()
      .from(notification)
      .where(whereClause)
      .orderBy(desc(notification.createdAt))
      .limit(params.limit)
      .offset(offset),
    db.select({ count: count() }).from(notification).where(whereClause),
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

export async function createNotification(
  userId: string,
  data: {
    title: string;
    description: string;
    type?: "success" | "alert" | "info";
    category?: NotificationCategory;
  },
) {
  if (data.category) {
    const enabled = await isCategoryEnabled(userId, data.category).catch(
      () => true,
    );
    if (!enabled) return null;
  }

  const [result] = await db
    .insert(notification)
    .values({
      userId,
      title: data.title,
      description: data.description,
      type: data.type ?? "info",
    })
    .returning();

  return result;
}

export async function markNotificationRead(
  userId: string,
  id: string,
  isRead: boolean,
) {
  const [result] = await db
    .update(notification)
    .set({ isRead })
    .where(and(eq(notification.id, id), eq(notification.userId, userId)))
    .returning();

  return result ?? null;
}

export async function markAllNotificationsRead(userId: string) {
  await db
    .update(notification)
    .set({ isRead: true })
    .where(and(eq(notification.userId, userId), eq(notification.isRead, false)));
}
