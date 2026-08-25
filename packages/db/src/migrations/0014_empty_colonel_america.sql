CREATE TABLE "wallet_transfer" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"source_wallet_id" text NOT NULL,
	"destination_wallet_id" text NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"fee" numeric(12, 2) DEFAULT '0' NOT NULL,
	"note" text,
	"transfer_date" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "wallet_transfer" ADD CONSTRAINT "wallet_transfer_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wallet_transfer" ADD CONSTRAINT "wallet_transfer_source_wallet_id_wallet_id_fk" FOREIGN KEY ("source_wallet_id") REFERENCES "public"."wallet"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wallet_transfer" ADD CONSTRAINT "wallet_transfer_destination_wallet_id_wallet_id_fk" FOREIGN KEY ("destination_wallet_id") REFERENCES "public"."wallet"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "wallet_transfer_userId_idx" ON "wallet_transfer" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "wallet_transfer_source_idx" ON "wallet_transfer" USING btree ("source_wallet_id");--> statement-breakpoint
CREATE INDEX "wallet_transfer_destination_idx" ON "wallet_transfer" USING btree ("destination_wallet_id");