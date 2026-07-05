ALTER TABLE "customers" ADD COLUMN "code" text;--> statement-breakpoint
WITH numbered_customers AS (
  SELECT
    "id",
    row_number() OVER (ORDER BY "created_at", "id") AS number
  FROM "customers"
)
UPDATE "customers"
SET "code" = 'CM-' || lpad(numbered_customers.number::text, 6, '0')
FROM numbered_customers
WHERE "customers"."id" = numbered_customers."id";--> statement-breakpoint
ALTER TABLE "customers" ALTER COLUMN "code" SET NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "customers_code_idx" ON "customers" USING btree ("code");
