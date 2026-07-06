import "server-only";

import { and, asc, eq, gt, inArray, or, sql } from "drizzle-orm";
import { db } from "@/db/client";
import { assets, branches, customers, rewardBranchAllocations, rewards } from "@/db/schema";
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

export async function listRewardsForManager(branchId?: string) {
  if (branchId) {
    const rows = await db
      .select({
        ...rewardSelect(),
        branchId: rewardBranchAllocations.branchId,
        branchName: branches.name,
        branchStockCount: rewardBranchAllocations.stockCount,
        branchActive: rewardBranchAllocations.active
      })
      .from(rewards)
      .leftJoin(assets, eq(rewards.imageAssetId, assets.id))
      .leftJoin(
        rewardBranchAllocations,
        and(eq(rewardBranchAllocations.rewardId, rewards.id), eq(rewardBranchAllocations.branchId, branchId))
      )
      .leftJoin(branches, eq(branches.id, rewardBranchAllocations.branchId))
      .orderBy(asc(rewards.name));

    return rows.map((row) => ({
      ...withImageUrl(row),
      branchId: row.branchId,
      branchName: row.branchName,
      branchStockCount: row.branchStockCount,
      branchActive: row.branchActive,
      allocatedBranchCount: null,
      availableBranchCount: null,
      availableBranchNames: []
    }));
  }

  const rows = await db
    .select({
      ...rewardSelect(),
      allocatedBranchCount: sql<number>`count(${rewardBranchAllocations.branchId})`
    })
    .from(rewards)
    .leftJoin(assets, eq(rewards.imageAssetId, assets.id))
    .leftJoin(rewardBranchAllocations, eq(rewardBranchAllocations.rewardId, rewards.id))
    .groupBy(
      rewards.id,
      rewards.name,
      rewards.description,
      rewards.imageAssetId,
      rewards.pointCost,
      rewards.type,
      rewards.stockCount,
      rewards.active,
      rewards.createdAt,
      rewards.updatedAt,
      assets.bucketKey
    )
    .orderBy(asc(rewards.name));

  const rewardIds = rows.map((row) => row.id);
  const allocationRows = rewardIds.length
    ? await db
        .select({
          rewardId: rewardBranchAllocations.rewardId,
          branchName: branches.name
        })
        .from(rewardBranchAllocations)
        .innerJoin(branches, eq(rewardBranchAllocations.branchId, branches.id))
        .where(
          and(
            inArray(rewardBranchAllocations.rewardId, rewardIds),
            eq(rewardBranchAllocations.active, true),
            eq(branches.active, true),
            or(
              sql`${rewardBranchAllocations.stockCount} is null`,
              gt(rewardBranchAllocations.stockCount, 0)
            )
          )
        )
        .orderBy(asc(branches.name))
    : [];
  const availableBranchesByReward = new Map<string, string[]>();
  for (const allocation of allocationRows) {
    const existing = availableBranchesByReward.get(allocation.rewardId) ?? [];
    existing.push(allocation.branchName);
    availableBranchesByReward.set(allocation.rewardId, existing);
  }

  return rows.map((row) => ({
    ...withImageUrl(row),
    branchId: null,
    branchName: null,
    branchStockCount: null,
    branchActive: null,
    allocatedBranchCount: Number(row.allocatedBranchCount),
    availableBranchCount: availableBranchesByReward.get(row.id)?.length ?? 0,
    availableBranchNames: availableBranchesByReward.get(row.id) ?? []
  }));
}

export async function listBranchRewardStock(branchId: string) {
  const rows = await db
    .select({
      ...rewardSelect(),
      branchId: rewardBranchAllocations.branchId,
      branchStockCount: rewardBranchAllocations.stockCount,
      branchActive: rewardBranchAllocations.active
    })
    .from(rewards)
    .leftJoin(assets, eq(rewards.imageAssetId, assets.id))
    .leftJoin(
      rewardBranchAllocations,
      and(eq(rewardBranchAllocations.rewardId, rewards.id), eq(rewardBranchAllocations.branchId, branchId))
    )
    .where(eq(rewards.active, true))
    .orderBy(asc(rewards.name));

  return rows.map((row) => ({
    ...withImageUrl(row),
    branchId: row.branchId,
    branchStockCount: row.branchStockCount,
    branchActive: row.branchActive ?? false
  }));
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

export async function listActiveRewardsForBranch(branchId: string) {
  const rows = await db
    .select({
      ...rewardSelect(),
      stockCount: rewardBranchAllocations.stockCount,
      branchId: rewardBranchAllocations.branchId,
      branchName: branches.name
    })
    .from(rewardBranchAllocations)
    .innerJoin(rewards, eq(rewardBranchAllocations.rewardId, rewards.id))
    .innerJoin(branches, eq(rewardBranchAllocations.branchId, branches.id))
    .leftJoin(assets, eq(rewards.imageAssetId, assets.id))
    .where(
      and(
        eq(rewardBranchAllocations.branchId, branchId),
        eq(rewardBranchAllocations.active, true),
        eq(rewards.active, true),
        eq(branches.active, true)
      )
    )
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

export async function listRewardAllocations(rewardId: string) {
  return db
    .select({
      rewardId: rewardBranchAllocations.rewardId,
      branchId: rewardBranchAllocations.branchId,
      branchName: branches.name,
      stockCount: rewardBranchAllocations.stockCount,
      active: rewardBranchAllocations.active,
      updatedAt: rewardBranchAllocations.updatedAt
    })
    .from(rewardBranchAllocations)
    .innerJoin(branches, eq(rewardBranchAllocations.branchId, branches.id))
    .where(eq(rewardBranchAllocations.rewardId, rewardId))
    .orderBy(asc(branches.name));
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
