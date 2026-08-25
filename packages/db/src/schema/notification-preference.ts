import {
  pgTable,
  text,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";
import { user } from "./auth";

export const notificationPreference = pgTable("notification_preference", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: "cascade" }),
  budgetAlerts: boolean("budget_alerts").notNull().default(true),
  transactionUpdates: boolean("transaction_updates").notNull().default(true),
  invoiceReminders: boolean("invoice_reminders").notNull().default(true),
  weeklyDigest: boolean("weekly_digest").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
