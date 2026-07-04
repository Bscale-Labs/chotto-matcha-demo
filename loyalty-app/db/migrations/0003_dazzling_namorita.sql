ALTER TABLE "branches" ADD COLUMN "code" text;--> statement-breakpoint
ALTER TABLE "branches" ADD COLUMN "phone" text;--> statement-breakpoint
ALTER TABLE "branches" ADD COLUMN "operating_hours" text;--> statement-breakpoint
CREATE INDEX "branches_code_idx" ON "branches" USING btree ("code");