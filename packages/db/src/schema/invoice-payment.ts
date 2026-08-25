import {
  pgTable,
  text,
  timestamp,
  numeric,
  index,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import { invoice } from "./invoice";

export const invoicePayment = pgTable(
  "invoice_payment",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    invoiceId: text("invoice_id")
      .notNull()
      .references(() => invoice.id, { onDelete: "cascade" }),
    amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
    method: text("method", {
      enum: ["cash", "bank_transfer", "card", "other"],
    }).notNull().default("bank_transfer"),
    paidAt: timestamp("paid_at").notNull(),
    note: text("note"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("invoice_payment_userId_idx").on(table.userId),
    index("invoice_payment_invoiceId_idx").on(table.invoiceId),
  ],
);
