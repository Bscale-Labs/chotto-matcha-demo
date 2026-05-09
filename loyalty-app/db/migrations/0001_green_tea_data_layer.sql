CREATE TYPE "public"."app_role" AS ENUM('customer', 'cashier', 'manager');--> statement-breakpoint
CREATE TYPE "public"."org_config_value_type" AS ENUM('string', 'number', 'boolean', 'asset_id');--> statement-breakpoint
CREATE TYPE "public"."reward_type" AS ENUM('item', 'merch');--> statement-breakpoint
CREATE TYPE "public"."transaction_type" AS ENUM('earn', 'redeem', 'manual');--> statement-breakpoint
CREATE TABLE "assets" (
	"id" text PRIMARY KEY NOT NULL,
	"bucket_key" text NOT NULL,
	"filename" text NOT NULL,
	"content_type" text NOT NULL,
	"size" integer NOT NULL,
	"uploaded_by_staff_profile_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "assets_bucket_key_unique" UNIQUE("bucket_key")
);
--> statement-breakpoint
CREATE TABLE "branches" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"address" text NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "customers" (
	"id" text PRIMARY KEY NOT NULL,
	"auth_user_id" text NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"phone" text NOT NULL,
	"points_balance" integer DEFAULT 0 NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "customers_auth_user_id_unique" UNIQUE("auth_user_id")
);
--> statement-breakpoint
CREATE TABLE "org_config" (
	"key" text PRIMARY KEY NOT NULL,
	"value" text NOT NULL,
	"value_type" "org_config_value_type" NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rewards" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"image_asset_id" text,
	"point_cost" integer NOT NULL,
	"type" "reward_type" NOT NULL,
	"stock_count" integer,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "staff_role_details" (
	"staff_profile_id" text NOT NULL,
	"role" "app_role" NOT NULL,
	"branch_id" text,
	"pin_hash" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "staff_role_details_staff_profile_id_role_pk" PRIMARY KEY("staff_profile_id","role")
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" text PRIMARY KEY NOT NULL,
	"customer_id" text NOT NULL,
	"staff_profile_id" text NOT NULL,
	"branch_id" text,
	"type" "transaction_type" NOT NULL,
	"points_delta" integer NOT NULL,
	"bill_total_cents" integer,
	"reward_id" text,
	"reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_roles" (
	"auth_user_id" text NOT NULL,
	"role" "app_role" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_roles_auth_user_id_role_pk" PRIMARY KEY("auth_user_id","role")
);
--> statement-breakpoint
ALTER TABLE "staff_profiles" RENAME COLUMN "userId" TO "auth_user_id";--> statement-breakpoint
ALTER TABLE "staff_profiles" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "staff_profiles" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "staff_profiles" DROP CONSTRAINT "staff_profiles_userId_unique";--> statement-breakpoint
ALTER TABLE "staff_profiles" DROP CONSTRAINT "staff_profiles_userId_user_id_fk";
--> statement-breakpoint
DROP INDEX "staff_profiles_role_active_idx";--> statement-breakpoint
ALTER TABLE "staff_profiles" ADD COLUMN "email" text;--> statement-breakpoint
ALTER TABLE "staff_profiles" ADD COLUMN "name" text;--> statement-breakpoint
UPDATE "staff_profiles"
SET
	"email" = "user"."email",
	"name" = "user"."name"
FROM "user"
WHERE "staff_profiles"."auth_user_id" = "user"."id";--> statement-breakpoint
ALTER TABLE "staff_profiles" ALTER COLUMN "email" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "staff_profiles" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "assets" ADD CONSTRAINT "assets_uploaded_by_staff_profile_id_staff_profiles_id_fk" FOREIGN KEY ("uploaded_by_staff_profile_id") REFERENCES "public"."staff_profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customers" ADD CONSTRAINT "customers_auth_user_id_user_id_fk" FOREIGN KEY ("auth_user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rewards" ADD CONSTRAINT "rewards_image_asset_id_assets_id_fk" FOREIGN KEY ("image_asset_id") REFERENCES "public"."assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staff_role_details" ADD CONSTRAINT "staff_role_details_staff_profile_id_staff_profiles_id_fk" FOREIGN KEY ("staff_profile_id") REFERENCES "public"."staff_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staff_role_details" ADD CONSTRAINT "staff_role_details_branch_id_branches_id_fk" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_staff_profile_id_staff_profiles_id_fk" FOREIGN KEY ("staff_profile_id") REFERENCES "public"."staff_profiles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_branch_id_branches_id_fk" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_reward_id_rewards_id_fk" FOREIGN KEY ("reward_id") REFERENCES "public"."rewards"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_auth_user_id_user_id_fk" FOREIGN KEY ("auth_user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
INSERT INTO "user_roles" ("auth_user_id", "role")
SELECT "auth_user_id", "role"::"app_role"
FROM "staff_profiles"
WHERE "role" IN ('manager', 'cashier')
ON CONFLICT DO NOTHING;--> statement-breakpoint
INSERT INTO "staff_role_details" ("staff_profile_id", "role", "branch_id", "pin_hash")
SELECT
	"id",
	"role"::"app_role",
	CASE
		WHEN EXISTS (SELECT 1 FROM "branches" WHERE "branches"."id" = "staff_profiles"."branchId")
			THEN "branchId"
		ELSE NULL
	END,
	"pinHash"
FROM "staff_profiles"
WHERE "role" IN ('manager', 'cashier')
ON CONFLICT DO NOTHING;--> statement-breakpoint
CREATE INDEX "assets_uploaded_by_idx" ON "assets" USING btree ("uploaded_by_staff_profile_id");--> statement-breakpoint
CREATE INDEX "branches_active_idx" ON "branches" USING btree ("active");--> statement-breakpoint
CREATE UNIQUE INDEX "customers_email_idx" ON "customers" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "customers_phone_idx" ON "customers" USING btree ("phone");--> statement-breakpoint
CREATE INDEX "customers_active_idx" ON "customers" USING btree ("active");--> statement-breakpoint
CREATE INDEX "rewards_active_type_idx" ON "rewards" USING btree ("active","type");--> statement-breakpoint
CREATE INDEX "staff_role_details_role_branch_idx" ON "staff_role_details" USING btree ("role","branch_id");--> statement-breakpoint
CREATE INDEX "transactions_customer_date_idx" ON "transactions" USING btree ("customer_id","created_at");--> statement-breakpoint
CREATE INDEX "transactions_branch_date_idx" ON "transactions" USING btree ("branch_id","created_at");--> statement-breakpoint
CREATE INDEX "transactions_staff_date_idx" ON "transactions" USING btree ("staff_profile_id","created_at");--> statement-breakpoint
CREATE INDEX "transactions_type_date_idx" ON "transactions" USING btree ("type","created_at");--> statement-breakpoint
CREATE INDEX "transactions_reward_idx" ON "transactions" USING btree ("reward_id");--> statement-breakpoint
CREATE INDEX "user_roles_role_idx" ON "user_roles" USING btree ("role");--> statement-breakpoint
ALTER TABLE "staff_profiles" ADD CONSTRAINT "staff_profiles_auth_user_id_user_id_fk" FOREIGN KEY ("auth_user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "staff_profiles_email_idx" ON "staff_profiles" USING btree ("email");--> statement-breakpoint
CREATE INDEX "staff_profiles_active_idx" ON "staff_profiles" USING btree ("active");--> statement-breakpoint
ALTER TABLE "staff_profiles" DROP COLUMN "role";--> statement-breakpoint
ALTER TABLE "staff_profiles" DROP COLUMN "branchId";--> statement-breakpoint
ALTER TABLE "staff_profiles" DROP COLUMN "pinHash";--> statement-breakpoint
ALTER TABLE "staff_profiles" ADD CONSTRAINT "staff_profiles_auth_user_id_unique" UNIQUE("auth_user_id");
