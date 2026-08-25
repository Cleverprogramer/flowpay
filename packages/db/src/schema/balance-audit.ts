import {
  pgTable,
  text,
  timestamp,
  numeric,
  index,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import { wallet } from "./wallet";
import { transaction } from "./transaction";

export const balanceAudit = pgTable(
  "balance_audit",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    walletId: text("wallet_id")
      .notNull()
      .references(() => wallet.id, { onDelete: "cascade" }),
    transactionId: text("transaction_id").references(() => transaction.id, {
      onDelete: "set null",
    }),
    reason: text("reason", {
      enum: [
        "transaction_created",
        "transaction_deleted",
        "recurring_generated",
        "manual_adjustment",
      ],
    }).notNull(),
    changeAmount: numeric("change_amount", {
      precision: 12,
      scale: 2,
    }).notNull(),
    balanceAfter: numeric("balance_after", {
      precision: 12,
      scale: 2,
    }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("balance_audit_userId_idx").on(table.userId),
    index("balance_audit_walletId_idx").on(table.walletId),
    index("balance_audit_createdAt_idx").on(table.createdAt),
  ],
);
