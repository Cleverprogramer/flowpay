import {
  pgTable,
  text,
  timestamp,
  numeric,
  boolean,
  index,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import { wallet } from "./wallet";
import { category } from "./category";

export const transaction = pgTable(
  "transaction",
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
    categoryId: text("category_id").references(() => category.id, {
      onDelete: "set null",
    }),
    type: text("type", { enum: ["income", "expense"] }).notNull(),
    amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
    description: text("description").notNull(),
    note: text("note"),
    transactionDate: timestamp("transaction_date").notNull(),
    receiptUrl: text("receipt_url"),
    isRecurring: boolean("is_recurring").notNull().default(false),
    recurringInterval: text("recurring_interval", {
      enum: ["daily", "weekly", "monthly", "yearly"],
    }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("transaction_userId_idx").on(table.userId),
    index("transaction_walletId_idx").on(table.walletId),
    index("transaction_categoryId_idx").on(table.categoryId),
    index("transaction_date_idx").on(table.transactionDate),
    index("transaction_type_idx").on(table.type),
  ],
);
