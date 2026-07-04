CREATE TABLE "reward_branch_allocations" (
	"reward_id" text NOT NULL,
	"branch_id" text NOT NULL,
	"stock_count" integer,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "reward_branch_allocations_reward_id_branch_id_pk" PRIMARY KEY("reward_id","branch_id")
);
--> statement-breakpoint
ALTER TABLE "reward_branch_allocations" ADD CONSTRAINT "reward_branch_allocations_reward_id_rewards_id_fk" FOREIGN KEY ("reward_id") REFERENCES "public"."rewards"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reward_branch_allocations" ADD CONSTRAINT "reward_branch_allocations_branch_id_branches_id_fk" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
INSERT INTO "reward_branch_allocations" ("reward_id", "branch_id", "stock_count", "active")
SELECT "rewards"."id", "branches"."id", "rewards"."stock_count", "rewards"."active"
FROM "rewards"
CROSS JOIN "branches"
ON CONFLICT DO NOTHING;
--> statement-breakpoint
CREATE INDEX "reward_branch_allocations_branch_active_idx" ON "reward_branch_allocations" USING btree ("branch_id","active");--> statement-breakpoint
CREATE INDEX "reward_branch_allocations_reward_idx" ON "reward_branch_allocations" USING btree ("reward_id");
