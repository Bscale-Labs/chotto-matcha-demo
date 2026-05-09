import "server-only";

import { and, asc, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { assets, customers, rewards } from "@/db/schema";
import { getAssetUrl } from "@/lib/storage";

function withImageUrl<T extends typeof rewards.$inferSelect & { imageBucketKey: string | null }>(
  reward: T
) {
  const { imageBucketKey, ...row } = reward;
  return {
    ...row,
    imageUrl: imageBucketKey ? getAssetUrl(imageBucketKey) : null
  };
}

function rewardSelect() {
  return {
    id: rewards.id,
    name: rewards.name,
    description: rewards.description,
    imageAssetId: rewards.imageAssetId,
    pointCost: rewards.pointCost,
    type: rewards.type,
    stockCount: rewards.stockCount,
    active: rewards.active,
    createdAt: rewards.createdAt,
    updatedAt: rewards.updatedAt,
    imageBucketKey: assets.bucketKey
  };
}

export async function listRewards() {
  const rows = await db
    .select(rewardSelect())
    .from(rewards)
    .leftJoin(assets, eq(rewards.imageAssetId, assets.id))
    .orderBy(asc(rewards.name));
  return rows.map(withImageUrl);
}

export async function listActiveRewards() {
  const rows = await db
    .select(rewardSelect())
    .from(rewards)
    .leftJoin(assets, eq(rewards.imageAssetId, assets.id))
    .where(eq(rewards.active, true))
    .orderBy(asc(rewards.name));
  return rows.map(withImageUrl);
}

export async function listActiveRewardsByType(type: "item" | "merch") {
  const rows = await db
    .select(rewardSelect())
    .from(rewards)
    .leftJoin(assets, eq(rewards.imageAssetId, assets.id))
    .where(and(eq(rewards.active, true), eq(rewards.type, type)))
    .orderBy(asc(rewards.name));
  return rows.map(withImageUrl);
}

export async function getRewardById(id: string) {
  const rows = await db
    .select(rewardSelect())
    .from(rewards)
    .leftJoin(assets, eq(rewards.imageAssetId, assets.id))
    .where(eq(rewards.id, id))
    .limit(1);
  return rows[0] ? withImageUrl(rows[0]) : null;
}

export async function listRewardsWithAffordability(customerId: string) {
  const customer = await db.query.customers.findFirst({ where: eq(customers.id, customerId) });
  if (!customer) return [];

  const activeRewards = await listActiveRewards();
  return activeRewards.map((reward) => {
    const hasStock = reward.stockCount === null || reward.stockCount > 0;
    const pointsNeeded = Math.max(0, reward.pointCost - customer.pointsBalance);

    return {
      ...reward,
      affordable: pointsNeeded === 0 && hasStock,
      hasStock,
      pointsNeeded
    };
  });
}
