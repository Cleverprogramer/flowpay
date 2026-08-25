import {
  pgTable,
  text,
  timestamp,
  numeric,
  index,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import { wallet } from "./wallet";

export const walletTransfer = pgTable(
  "wallet_transfer",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    sourceWalletId: text("source_wallet_id")
      .notNull()
      .references(() => wallet.id, { onDelete: "cascade" }),
    destinationWalletId: text("destination_wallet_id")
      .notNull()
      .references(() => wallet.id, { onDelete: "cascade" }),
    amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
    fee: numeric("fee", { precision: 12, scale: 2 }).notNull().default("0"),
    note: text("note"),
    transferDate: timestamp("transfer_date").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("wallet_transfer_userId_idx").on(table.userId),
    index("wallet_transfer_source_idx").on(table.sourceWalletId),
    index("wallet_transfer_destination_idx").on(table.destinationWalletId),
  ],
);
