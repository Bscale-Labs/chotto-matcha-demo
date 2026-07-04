WITH ranked_staff_roles AS (
  SELECT
    "staff_profile_id",
    "role",
    row_number() OVER (
      PARTITION BY "staff_profile_id"
      ORDER BY CASE "role"
        WHEN 'manager' THEN 1
        WHEN 'cashier' THEN 2
        ELSE 3
      END
    ) AS rank
  FROM "staff_role_details"
)
DELETE FROM "staff_role_details"
USING ranked_staff_roles
WHERE "staff_role_details"."staff_profile_id" = ranked_staff_roles."staff_profile_id"
  AND "staff_role_details"."role" = ranked_staff_roles."role"
  AND ranked_staff_roles.rank > 1;
--> statement-breakpoint
DELETE FROM "user_roles"
USING "staff_profiles"
WHERE "user_roles"."auth_user_id" = "staff_profiles"."auth_user_id"
  AND "user_roles"."role" IN ('manager', 'cashier')
  AND NOT EXISTS (
    SELECT 1
    FROM "staff_role_details"
    WHERE "staff_role_details"."staff_profile_id" = "staff_profiles"."id"
      AND "staff_role_details"."role" = "user_roles"."role"
  );
--> statement-breakpoint
CREATE UNIQUE INDEX "staff_role_details_staff_profile_unique_idx" ON "staff_role_details" USING btree ("staff_profile_id");
