CREATE TABLE "invoice_payment" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"invoice_id" text NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"method" text DEFAULT 'bank_transfer' NOT NULL,
	"paid_at" timestamp NOT NULL,
	"note" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "invoice_payment" ADD CONSTRAINT "invoice_payment_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoice_payment" ADD CONSTRAINT "invoice_payment_invoice_id_invoice_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoice"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "invoice_payment_userId_idx" ON "invoice_payment" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "invoice_payment_invoiceId_idx" ON "invoice_payment" USING btree ("invoice_id");