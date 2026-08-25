import {
  pgTable,
  text,
  timestamp,
  integer,
  boolean,
  index,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import { category } from "./category";

export const categorizationRule = pgTable(
  "categorization_rule",
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
    keyword: text("keyword").notNull(),
    matchType: text("match_type", {
      enum: ["contains", "starts_with", "exact"],
    }).notNull().default("contains"),
    priority: integer("priority").notNull().default(100),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("categorization_rule_userId_idx").on(table.userId),
    index("categorization_rule_categoryId_idx").on(table.categoryId),
    index("categorization_rule_priority_idx").on(table.priority),
  ],
);
