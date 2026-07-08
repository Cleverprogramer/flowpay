import { db } from "@flowpay/db";
import { wallet } from "@flowpay/db/schema/wallet";
import { eq, and } from "drizzle-orm";

export async function listWallets(userId: string) {
  return db.select().from(wallet).where(eq(wallet.userId, userId));
}

export async function getWalletById(userId: string, id: string) {
  const [result] = await db
    .select()
    .from(wallet)
    .where(and(eq(wallet.id, id), eq(wallet.userId, userId)));
  return result ?? null;
}

export async function getDefaultWallet(userId: string) {
  const [result] = await db
    .select()
    .from(wallet)
    .where(and(eq(wallet.userId, userId), eq(wallet.isDefault, true)));
  return result ?? null;
}

export async function createWallet(
  userId: string,
  data: {
    name: string;
    type: "bank" | "credit" | "cash" | "mobile";
    icon?: string;
    currency?: string;
    isDefault?: boolean;
  },
) {
  if (data.isDefault) {
    await db
      .update(wallet)
      .set({ isDefault: false })
      .where(eq(wallet.userId, userId));
  }

  const [result] = await db
    .insert(wallet)
    .values({
      userId,
      name: data.name,
      type: data.type,
      icon: data.icon,
      currency: data.currency ?? "USD",
      isDefault: data.isDefault ?? false,
    })
    .returning();

  return result;
}

export async function updateWallet(
  userId: string,
  id: string,
  data: {
    name?: string;
    type?: "bank" | "credit" | "cash" | "mobile";
    icon?: string;
    currency?: string;
    isDefault?: boolean;
  },
) {
  if (data.isDefault) {
    await db
      .update(wallet)
      .set({ isDefault: false })
      .where(eq(wallet.userId, userId));
  }

  const [result] = await db
    .update(wallet)
    .set(data)
    .where(and(eq(wallet.id, id), eq(wallet.userId, userId)))
    .returning();

  return result ?? null;
}

export async function deleteWallet(userId: string, id: string) {
  const [result] = await db
    .delete(wallet)
    .where(and(eq(wallet.id, id), eq(wallet.userId, userId)))
    .returning();
  return result ?? null;
}