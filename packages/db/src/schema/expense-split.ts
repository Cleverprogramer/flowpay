import {
  pgTable,
  text,
  timestamp,
  numeric,
  boolean,
  index,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import { transaction } from "./transaction";

export const expenseSplit = pgTable(
  "expense_split",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    transactionId: text("transaction_id")
      .notNull()
      .references(() => transaction.id, { onDelete: "cascade" }),
    participantName: text("participant_name").notNull(),
    participantContact: text("participant_contact"),
    shareAmount: numeric("share_amount", { precision: 12, scale: 2 }).notNull(),
    isSettled: boolean("is_settled").notNull().default(false),
    settledAt: timestamp("settled_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("expense_split_userId_idx").on(table.userId),
    index("expense_split_transactionId_idx").on(table.transactionId),
    index("expense_split_isSettled_idx").on(table.isSettled),
  ],
);
