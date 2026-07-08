import {
  pgTable,
  text,
  timestamp,
  numeric,
  boolean,
  index,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import { category } from "./category";

export const budget = pgTable(
  "budget",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    categoryId: text("category_id")
      .notNull()
      .references(() => category.id, { onDelete: "cascade" }),
    amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
    period: text("period", { enum: ["weekly", "monthly", "yearly"] }).notNull(),
    spent: numeric("spent", { precision: 12, scale: 2 }).notNull().default("0"),
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date").notNull(),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("budget_userId_idx").on(table.userId),
    index("budget_categoryId_idx").on(table.categoryId),
    index("budget_active_idx").on(table.isActive),
  ],
);
