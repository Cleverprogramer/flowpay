import { db } from "@flowpay/db";
import { device } from "@flowpay/db/schema/device";
import { and, eq } from "drizzle-orm";
import type { RegisterDeviceInput } from "@flowpay/schema/device.schema";

export async function registerDevice(userId: string, data: RegisterDeviceInput) {
  const [existing] = await db
    .select()
    .from(device)
    .where(eq(device.expoPushToken, data.expoPushToken));

  if (existing && existing.userId === userId) {
    const [updated] = await db
      .update(device)
      .set({
        deviceName: data.deviceName,
        platform: data.platform,
        isActive: true,
      })
      .where(eq(device.id, existing.id))
      .returning();
    return updated;
  }

  if (existing) {
    // Token already claimed by another account: rebind it to this user
    const [rebound] = await db
      .update(device)
      .set({
        userId,
        deviceName: data.deviceName,
        platform: data.platform,
        isActive: true,
      })
      .where(eq(device.id, existing.id))
      .returning();
    return rebound;
  }

  const [created] = await db
    .insert(device)
    .values({
      userId,
      expoPushToken: data.expoPushToken,
      deviceName: data.deviceName,
      platform: data.platform,
    })
    .returning();
  return created;
}

export async function unregisterDevice(userId: string, token: string) {
  const [result] = await db
    .update(device)
    .set({ isActive: false })
    .where(
      and(eq(device.userId, userId), eq(device.expoPushToken, token)),
    )
    .returning();
  return result ?? null;
}

export async function listDevices(userId: string) {
  return db
    .select()
    .from(device)
    .where(and(eq(device.userId, userId), eq(device.isActive, true)));
}

export async function deactivateAllDevices(userId: string) {
  const rows = await db
    .update(device)
    .set({ isActive: false })
    .where(and(eq(device.userId, userId), eq(device.isActive, true)))
    .returning({ id: device.id });
  return { deactivated: rows.length };
}

export async function getActivePushTokens(userId: string) {
  const rows = await db
    .select({ expoPushToken: device.expoPushToken })
    .from(device)
    .where(and(eq(device.userId, userId), eq(device.isActive, true)));
  return rows.map((row) => row.expoPushToken);
}
