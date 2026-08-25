CREATE TABLE "device" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expo_push_token" text NOT NULL,
	"device_name" text,
	"platform" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "device" ADD CONSTRAINT "device_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "device_userId_idx" ON "device" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "device_expoPushToken_idx" ON "device" USING btree ("expo_push_token");