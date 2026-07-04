CREATE TABLE "reward_tiers" (
  "id" text PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "description" text NOT NULL,
  "min_points" integer NOT NULL,
  "sort_order" integer NOT NULL,
  "active" boolean DEFAULT true NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "reward_tiers_sort_order_idx" ON "reward_tiers" USING btree ("sort_order");
--> statement-breakpoint
CREATE INDEX "reward_tiers_min_points_idx" ON "reward_tiers" USING btree ("min_points");
--> statement-breakpoint
CREATE INDEX "reward_tiers_active_idx" ON "reward_tiers" USING btree ("active");
--> statement-breakpoint
INSERT INTO "reward_tiers" ("id", "name", "description", "min_points", "sort_order", "active")
VALUES
  ('seedling', 'Seedling', 'Just starting the ritual', 0, 1, true),
  ('whisk', 'Whisk', 'Practiced, regular, deepening the habit', 150, 2, true),
  ('ceremony', 'Ceremony', 'A devoted member of the community', 500, 3, true);
