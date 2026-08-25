import { db } from "@flowpay/db";
import { transaction } from "@flowpay/db/schema/transaction";
import { wallet } from "@flowpay/db/schema/wallet";
import { transactionTag } from "@flowpay/db/schema/tag";
import { and, eq, inArray, sql } from "drizzle-orm";
import { recordBalanceChange } from "./balance-audit.service";

async function loadOwned(userId: string, ids: string[]) {
  return db
    .select()
    .from(transaction)
    .where(and(eq(transaction.userId, userId), inArray(transaction.id, ids)));
}

export async function bulkDeleteTransactions(userId: string, ids: string[]) {
  const owned = await loadOwned(userId, ids);
  if (!owned.length) return { deleted: 0 };

  const balanceEffects = new Map<
    string,
    { net: number; description: string }
  >();

  for (const item of owned) {
    const effect = item.type === "income" ? -Number(item.amount) : Number(item.amount);
    const existing = balanceEffects.get(item.walletId) ?? {
      net: 0,
      description: "",
    };
    balanceEffects.set(item.walletId, {
      net: existing.net + effect,
      description: item.description,
    });
  }

  for (const [walletId, effect] of balanceEffects) {
    if (effect.net === 0) continue;
    const [updated] = await db
      .update(wallet)
      .set({ balance: sql`${wallet.balance} + ${effect.net}` })
      .where(and(eq(wallet.id, walletId), eq(wallet.userId, userId)))
      .returning({ balance: wallet.balance });

    if (updated) {
      await recordBalanceChange({
        userId,
        walletId,
        reason: "transaction_deleted",
        changeAmount: effect.net,
        balanceAfter: Number(updated.balance),
      }).catch(() => undefined);
    }
  }

  await db
    .delete(transaction)
    .where(and(eq(transaction.userId, userId), inArray(transaction.id, ids)));

  return { deleted: owned.length };
}

export async function bulkCategorizeTransactions(
  userId: string,
  ids: string[],
  categoryId: string,
) {
  const updated = await db
    .update(transaction)
    .set({ categoryId })
    .where(and(eq(transaction.userId, userId), inArray(transaction.id, ids)))
    .returning({ id: transaction.id });

  return { updated: updated.length };
}

export async function bulkAttachTag(
  userId: string,
  transactionIds: string[],
  tagId: string,
) {
  const owned = await loadOwned(userId, transactionIds);
  if (!owned.length) return { attached: 0 };

  const values = owned.map((item) => ({
    transactionId: item.id,
    tagId,
  }));

  await db
    .insert(transactionTag)
    .values(values)
    .onConflictDoNothing();

  return { attached: owned.length };
}
