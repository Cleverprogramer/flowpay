ALTER TABLE "invoice" ADD COLUMN "share_token" text;--> statement-breakpoint
ALTER TABLE "invoice" ADD CONSTRAINT "invoice_shareToken_unique" UNIQUE("share_token");