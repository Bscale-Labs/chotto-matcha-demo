import "server-only";

import { asc, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { rewardTiers } from "@/db/schema";
import { normalizeTiers, tiers } from "@/lib/loyalty";

export async function listRewardTierRows() {
  return db
    .select()
    .from(rewardTiers)
    .where(eq(rewardTiers.active, true))
    .orderBy(asc(rewardTiers.sortOrder), asc(rewardTiers.minPoints));
}

export async function listConfiguredRewardTiers() {
  const rows = await listRewardTierRows();
  return rows.length > 0 ? normalizeTiers(rows) : tiers;
}
