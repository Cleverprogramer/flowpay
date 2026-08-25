CREATE TABLE "expense_split" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"transaction_id" text NOT NULL,
	"participant_name" text NOT NULL,
	"participant_contact" text,
	"share_amount" numeric(12, 2) NOT NULL,
	"is_settled" boolean DEFAULT false NOT NULL,
	"settled_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "expense_split" ADD CONSTRAINT "expense_split_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expense_split" ADD CONSTRAINT "expense_split_transaction_id_transaction_id_fk" FOREIGN KEY ("transaction_id") REFERENCES "public"."transaction"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "expense_split_userId_idx" ON "expense_split" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "expense_split_transactionId_idx" ON "expense_split" USING btree ("transaction_id");--> statement-breakpoint
CREATE INDEX "expense_split_isSettled_idx" ON "expense_split" USING btree ("is_settled");