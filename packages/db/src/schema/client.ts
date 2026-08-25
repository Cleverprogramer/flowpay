import {
  pgTable,
  text,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { user } from "./auth";

export const client = pgTable(
  "client",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    email: text("email"),
    phone: text("phone"),
    address: text("address"),
    taxId: text("tax_id"),
    note: text("note"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("client_userId_idx").on(table.userId)],
);
