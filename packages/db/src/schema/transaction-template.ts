import {
  pgTable,
  text,
  timestamp,
  numeric,
  integer,
  index,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import { wallet } from "./wallet";
import { category } from "./category";

export const transactionTemplate = pgTable(
  "transaction_template",
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
    name: text("name").notNull(),
    type: text("type", { enum: ["income", "expense"] }).notNull(),
    amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
    description: text("description").notNull(),
    note: text("note"),
    usageCount: integer("usage_count").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("transaction_template_userId_idx").on(table.userId)],
);
