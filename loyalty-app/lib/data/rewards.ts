import "server-only";

import { and, asc, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { customers, rewards } from "@/db/schema";

export async function listRewards() {
  return db.query.rewards.findMany({ orderBy: [asc(rewards.name)] });
}

export async function listActiveRewards() {
  return db.query.rewards.findMany({
    where: eq(rewards.active, true),
    orderBy: [asc(rewards.name)]
  });
}

export async function listActiveRewardsByType(type: "item" | "merch") {
  return db.query.rewards.findMany({
    where: and(eq(rewards.active, true), eq(rewards.type, type)),
    orderBy: [asc(rewards.name)]
  });
}

export async function getRewardById(id: string) {
  return db.query.rewards.findFirst({ where: eq(rewards.id, id) });
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
