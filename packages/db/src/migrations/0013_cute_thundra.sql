CREATE TABLE "currency_rate" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"base_currency" text NOT NULL,
	"target_currency" text NOT NULL,
	"rate" numeric(18, 8) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "currency_rate_user_pair_unique" UNIQUE("user_id","base_currency","target_currency")
);
--> statement-breakpoint
ALTER TABLE "currency_rate" ADD CONSTRAINT "currency_rate_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "currency_rate_userId_idx" ON "currency_rate" USING btree ("user_id");