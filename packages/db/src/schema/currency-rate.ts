import {
  pgTable,
  text,
  timestamp,
  numeric,
  index,
  unique,
} from "drizzle-orm/pg-core";
import { user } from "./auth";

export const currencyRate = pgTable(
  "currency_rate",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    baseCurrency: text("base_currency").notNull(),
    targetCurrency: text("target_currency").notNull(),
    rate: numeric("rate", { precision: 18, scale: 8 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("currency_rate_userId_idx").on(table.userId),
    unique("currency_rate_user_pair_unique").on(
      table.userId,
      table.baseCurrency,
      table.targetCurrency,
    ),
  ],
);
