import { db } from "@flowpay/db";
import { walletTransfer } from "@flowpay/db/schema/wallet-transfer";
import { wallet } from "@flowpay/db/schema/wallet";
import { and, count, desc, eq, or, sql } from "drizzle-orm";
import { recordBalanceChange } from "./balance-audit.service";
import type {
  CreateTransferInput,
  ListTransfersQuery,
} from "@flowpay/schema/wallet-transfer.schema";

export async function listTransfers(userId: string, params: ListTransfersQuery) {
  const offset = (params.page - 1) * params.limit;
  const conditions = [eq(walletTransfer.userId, userId)];
  if (params.walletId) {
    conditions.push(
      or(
        eq(walletTransfer.sourceWalletId, params.walletId),
        eq(walletTransfer.destinationWalletId, params.walletId),
      )!,
    );
  }
  const whereClause = and(...conditions);

  const [data, totalResult] = await Promise.all([
    db
      .select()
      .from(walletTransfer)
      .where(whereClause)
      .orderBy(desc(walletTransfer.transferDate))
      .limit(params.limit)
      .offset(offset),
    db.select({ count: count() }).from(walletTransfer).where(whereClause),
  ]);

  return {
    data: data.map((row) => ({
      ...row,
      amount: Number(row.amount),
      fee: Number(row.fee),
    })),
    pagination: {
      page: params.page,
      limit: params.limit,
      total: totalResult[0]?.count ?? 0,
      totalPages: Math.ceil((totalResult[0]?.count ?? 0) / params.limit),
    },
  };
}

export async function createTransfer(userId: string, data: CreateTransferInput) {
  if (data.sourceWalletId === data.destinationWalletId) {
    return { error: "Source and destination wallets must differ" as const };
  }

  const owned = await db
    .select({
      id: wallet.id,
      balance: wallet.balance,
      archived: wallet.archived,
    })
    .from(wallet)
    .where(
      and(
        eq(wallet.userId, userId),
        or(
          eq(wallet.id, data.sourceWalletId),
          eq(wallet.id, data.destinationWalletId),
        ),
      ),
    );

  const source = owned.find((row) => row.id === data.sourceWalletId);
  const destination = owned.find((row) => row.id === data.destinationWalletId);
  if (!source || !destination) {
    return { error: "Both wallets must belong to you" as const };
  }
  if (source.archived || destination.archived) {
    return { error: "Archived wallets cannot transfer funds" as const };
  }
  if (Number(source.balance) < data.amount + (data.fee ?? 0)) {
    return { error: "Insufficient balance in source wallet" as const };
  }

  const totalDebit = data.amount + (data.fee ?? 0);

  const [sourceWallet] = await db
    .update(wallet)
    .set({ balance: sql`${wallet.balance} - ${totalDebit}` })
    .where(eq(wallet.id, source.id))
    .returning({ balance: wallet.balance });

  const [destinationWallet] = await db
    .update(wallet)
    .set({ balance: sql`${wallet.balance} + ${data.amount}` })
    .where(eq(wallet.id, destination.id))
    .returning({ balance: wallet.balance });

  const [transfer] = await db
    .insert(walletTransfer)
    .values({
      userId,
      sourceWalletId: source.id,
      destinationWalletId: destination.id,
      amount: String(data.amount),
      fee: String(data.fee ?? 0),
      note: data.note,
      transferDate: data.transferDate ? new Date(data.transferDate) : new Date(),
    })
    .returning();

  if (sourceWallet && transfer) {
    await recordBalanceChange({
      userId,
      walletId: source.id,
      reason: "manual_adjustment",
      changeAmount: -totalDebit,
      balanceAfter: Number(sourceWallet.balance),
    }).catch(() => undefined);
  }
  if (destinationWallet && transfer) {
    await recordBalanceChange({
      userId,
      walletId: destination.id,
      reason: "manual_adjustment",
      changeAmount: data.amount,
      balanceAfter: Number(destinationWallet.balance),
    }).catch(() => undefined);
  }

  return {
    data: transfer
      ? { ...transfer, amount: Number(transfer.amount), fee: Number(transfer.fee) }
      : null,
  };
}
