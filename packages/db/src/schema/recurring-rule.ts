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

export const recurringRule = pgTable(
  "recurring_rule",
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
    interval: text("interval", {
      enum: ["daily", "weekly", "monthly", "yearly"],
    }).notNull(),
    startDate: timestamp("start_date").notNull().defaultNow(),
    nextRunAt: timestamp("next_run_at").notNull(),
    lastRunAt: timestamp("last_run_at"),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("recurring_rule_userId_idx").on(table.userId),
    index("recurring_rule_walletId_idx").on(table.walletId),
    index("recurring_rule_nextRunAt_idx").on(table.nextRunAt),
  ],
);
