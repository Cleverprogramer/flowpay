import {
  pgTable,
  text,
  timestamp,
  numeric,
  integer,
  index,
  unique,
} from "drizzle-orm/pg-core";
import { user } from "./auth";

export const invoice = pgTable(
  "invoice",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    invoiceNumber: text("invoice_number").notNull(),
    status: text("status", {
      enum: ["draft", "sent", "paid", "overdue", "cancelled"],
    })
      .notNull()
      .default("draft"),
    clientName: text("client_name").notNull(),
    clientEmail: text("client_email"),
    subtotal: numeric("subtotal", { precision: 12, scale: 2 })
      .notNull()
      .default("0"),
    taxRate: numeric("tax_rate", { precision: 5, scale: 2 }).default("0"),
    taxAmount: numeric("tax_amount", { precision: 12, scale: 2 }).default("0"),
    total: numeric("total", { precision: 12, scale: 2 }).notNull().default("0"),
    currency: text("currency").notNull().default("USD"),
    issueDate: timestamp("issue_date").notNull(),
    dueDate: timestamp("due_date").notNull(),
    paidDate: timestamp("paid_date"),
    note: text("note"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("invoice_userId_idx").on(table.userId),
    index("invoice_status_idx").on(table.status),
    unique("invoice_number_user_unique").on(table.userId, table.invoiceNumber),
  ],
);

export const invoiceItem = pgTable(
  "invoice_item",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    invoiceId: text("invoice_id")
      .notNull()
      .references(() => invoice.id, { onDelete: "cascade" }),
    description: text("description").notNull(),
    quantity: integer("quantity").notNull().default(1),
    unitPrice: numeric("unit_price", { precision: 12, scale: 2 }).notNull(),
    total: numeric("total", { precision: 12, scale: 2 }).notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (table) => [index("invoiceItem_invoiceId_idx").on(table.invoiceId)],
);
