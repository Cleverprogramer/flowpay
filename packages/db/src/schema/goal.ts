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

export const goal = pgTable(
  "goal",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    walletId: text("wallet_id").references(() => wallet.id, {
      onDelete: "set null",
    }),
    name: text("name").notNull(),
    description: text("description"),
    emoji: text("emoji").notNull().default("🎯"),
    color: text("color").notNull().default("#6366f1"),
    targetAmount: numeric("target_amount", {
      precision: 12,
      scale: 2,
    }).notNull(),
    savedAmount: numeric("saved_amount", { precision: 12, scale: 2 })
      .notNull()
      .default("0"),
    targetDate: timestamp("target_date"),
    isCompleted: boolean("is_completed").notNull().default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("goal_userId_idx").on(table.userId),
    index("goal_walletId_idx").on(table.walletId),
  ],
);
