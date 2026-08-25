import { db } from "@flowpay/db";
import { transaction } from "@flowpay/db/schema/transaction";
import { wallet } from "@flowpay/db/schema/wallet";
import { and, eq, sql } from "drizzle-orm";
import type { CommitImportInput } from "@flowpay/schema/import.schema";

export async function commitImportedTransactions(
  userId: string,
  data: CommitImportInput,
) {
  const [walletRecord] = await db
    .select({ id: wallet.id })
    .from(wallet)
    .where(and(eq(wallet.id, data.walletId), eq(wallet.userId, userId)));
  if (!walletRecord) return null;

  let imported = 0;
  const balanceDelta = new Map<"income" | "expense", number>();

  await db.transaction(async (tx) => {
    for (const row of data.rows) {
      const type = row.typeHint === "income" ? "income" : "expense";
      await tx.insert(transaction).values({
        userId,
        walletId: data.walletId,
        type,
        amount: String(row.amount),
        description: row.description,
        note: row.note ?? undefined,
        transactionDate: new Date(row.date),
      });
      imported++;
      balanceDelta.set(
        type,
        (balanceDelta.get(type) ?? 0) +
          (type === "income" ? row.amount : -row.amount),
      );
    }

    if (balanceDelta.size > 0) {
      const net =
        (balanceDelta.get("income") ?? 0) - (balanceDelta.get("expense") ?? 0);
      await tx
        .update(wallet)
        .set({ balance: sql`${wallet.balance} + ${net}` })
        .where(and(eq(wallet.id, data.walletId), eq(wallet.userId, userId)));
    }
  });

  const [updatedWallet] = await db
    .select({ balance: wallet.balance })
    .from(wallet)
    .where(eq(wallet.id, data.walletId));

  return {
    imported,
    newBalance: updatedWallet ? Number(updatedWallet.balance) : null,
  };
}
