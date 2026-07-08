import { pgTable, text, timestamp, boolean, integer, index } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const category = pgTable(
  "category",
  {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    emoji: text("emoji"),
    type: text("type", { enum: ["income", "expense"] }).notNull(),
    color: text("color"),
    sortOrder: integer("sort_order").notNull().default(0),
    isSystem: boolean("is_system").notNull().default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("category_userId_idx").on(table.userId),
    index("category_type_idx").on(table.type),
  ],
);
