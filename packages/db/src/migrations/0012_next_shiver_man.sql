ALTER TABLE "invoice" ADD COLUMN "last_reminder_at" timestamp;--> statement-breakpoint
ALTER TABLE "invoice" ADD COLUMN "reminder_count" integer DEFAULT 0 NOT NULL;