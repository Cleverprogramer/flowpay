CREATE TABLE "categorization_rule" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"category_id" text NOT NULL,
	"keyword" text NOT NULL,
	"match_type" text DEFAULT 'contains' NOT NULL,
	"priority" integer DEFAULT 100 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "categorization_rule" ADD CONSTRAINT "categorization_rule_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "categorization_rule" ADD CONSTRAINT "categorization_rule_category_id_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."category"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "categorization_rule_userId_idx" ON "categorization_rule" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "categorization_rule_categoryId_idx" ON "categorization_rule" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "categorization_rule_priority_idx" ON "categorization_rule" USING btree ("priority");