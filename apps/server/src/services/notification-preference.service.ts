import { db } from "@flowpay/db";
import { notificationPreference } from "@flowpay/db/schema/notification-preference";
import { eq } from "drizzle-orm";

export type NotificationCategory =
  | "budget"
  | "transaction"
  | "invoice"
  | "digest";

export async function getOrCreatePreferences(userId: string) {
  const [existing] = await db
    .select()
    .from(notificationPreference)
    .where(eq(notificationPreference.userId, userId));
  if (existing) return existing;

  const [created] = await db
    .insert(notificationPreference)
    .values({ userId })
    .onConflictDoNothing()
    .returning();

  if (created) return created;

  const [raced] = await db
    .select()
    .from(notificationPreference)
    .where(eq(notificationPreference.userId, userId));
  return raced ?? null;
}

export async function updatePreferences(
  userId: string,
  data: {
    budgetAlerts?: boolean;
    transactionUpdates?: boolean;
    invoiceReminders?: boolean;
    weeklyDigest?: boolean;
  },
) {
  await getOrCreatePreferences(userId);

  const updateData: Record<string, unknown> = {};
  if (data.budgetAlerts !== undefined)
    updateData.budgetAlerts = data.budgetAlerts;
  if (data.transactionUpdates !== undefined)
    updateData.transactionUpdates = data.transactionUpdates;
  if (data.invoiceReminders !== undefined)
    updateData.invoiceReminders = data.invoiceReminders;
  if (data.weeklyDigest !== undefined)
    updateData.weeklyDigest = data.weeklyDigest;

  const [result] = await db
    .update(notificationPreference)
    .set(updateData)
    .where(eq(notificationPreference.userId, userId))
    .returning();
  return result ?? null;
}

export async function isCategoryEnabled(
  userId: string,
  category: NotificationCategory,
): Promise<boolean> {
  const prefs = await getOrCreatePreferences(userId);
  if (!prefs) return true;
  switch (category) {
    case "budget":
      return prefs.budgetAlerts;
    case "transaction":
      return prefs.transactionUpdates;
    case "invoice":
      return prefs.invoiceReminders;
    case "digest":
      return prefs.weeklyDigest;
  }
}
