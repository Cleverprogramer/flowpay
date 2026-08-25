CREATE TABLE "balance_audit" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"wallet_id" text NOT NULL,
	"transaction_id" text,
	"reason" text NOT NULL,
	"change_amount" numeric(12, 2) NOT NULL,
	"balance_after" numeric(12, 2) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "balance_audit" ADD CONSTRAINT "balance_audit_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "balance_audit" ADD CONSTRAINT "balance_audit_wallet_id_wallet_id_fk" FOREIGN KEY ("wallet_id") REFERENCES "public"."wallet"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "balance_audit" ADD CONSTRAINT "balance_audit_transaction_id_transaction_id_fk" FOREIGN KEY ("transaction_id") REFERENCES "public"."transaction"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "balance_audit_userId_idx" ON "balance_audit" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "balance_audit_walletId_idx" ON "balance_audit" USING btree ("wallet_id");--> statement-breakpoint
CREATE INDEX "balance_audit_createdAt_idx" ON "balance_audit" USING btree ("created_at");