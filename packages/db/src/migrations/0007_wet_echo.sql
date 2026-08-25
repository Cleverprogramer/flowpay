CREATE TABLE "client" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"email" text,
	"phone" text,
	"address" text,
	"tax_id" text,
	"note" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "invoice" ADD COLUMN "client_id" text;--> statement-breakpoint
ALTER TABLE "client" ADD CONSTRAINT "client_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "client_userId_idx" ON "client" USING btree ("user_id");--> statement-breakpoint
ALTER TABLE "invoice" ADD CONSTRAINT "invoice_client_id_client_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."client"("id") ON DELETE set null ON UPDATE no action;