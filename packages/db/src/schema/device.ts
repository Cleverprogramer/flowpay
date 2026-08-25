import {
  pgTable,
  text,
  timestamp,
  boolean,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { user } from "./auth";

export const device = pgTable(
  "device",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    expoPushToken: text("expo_push_token").notNull(),
    deviceName: text("device_name"),
    platform: text("platform"),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("device_userId_idx").on(table.userId),
    uniqueIndex("device_expoPushToken_idx").on(table.expoPushToken),
  ],
);
