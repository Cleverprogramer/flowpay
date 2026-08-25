import {
  pgTable,
  text,
  timestamp,
  index,
  unique,
  primaryKey,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import { transaction } from "./transaction";

export const tag = pgTable(
  "tag",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    color: text("color").notNull().default("#6b7280"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("tag_userId_idx").on(table.userId),
    unique("tag_user_name_unique").on(table.userId, table.name),
  ],
);

export const transactionTag = pgTable(
  "transaction_tag",
  {
    transactionId: text("transaction_id")
      .notNull()
      .references(() => transaction.id, { onDelete: "cascade" }),
    tagId: text("tag_id")
      .notNull()
      .references(() => tag.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({ columns: [table.transactionId, table.tagId] }),
    index("transaction_tag_tagId_idx").on(table.tagId),
  ],
);
