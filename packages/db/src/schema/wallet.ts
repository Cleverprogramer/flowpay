import {
  pgTable,
  text,
  timestamp,
  numeric,
  boolean,
  index,
} from "drizzle-orm/pg-core";
import { user } from "./auth";

export const wallet = pgTable(
  "wallet",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    type: text("type", {
      enum: ["bank", "credit", "cash", "mobile"],
    }).notNull(),
    icon: text("icon"),
    balance: numeric("balance", { precision: 12, scale: 2 })
      .notNull()
      .default("0"),
    currency: text("currency").notNull().default("USD"),
    isDefault: boolean("is_default").notNull().default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("wallet_userId_idx").on(table.userId)],
);
