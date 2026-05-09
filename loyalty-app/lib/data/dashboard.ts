import "server-only";

import { and, desc, eq, gte, sql } from "drizzle-orm";
import { db } from "@/db/client";
import { branches, customers, rewards, transactions } from "@/db/schema";

function monthStart(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

async function pointTotals(startDate?: Date) {
  const whereClause = startDate ? gte(transactions.createdAt, startDate) : undefined;
  const [row] = await db
    .select({
      issued: sql<number>`coalesce(sum(case when ${transactions.pointsDelta} > 0 then ${transactions.pointsDelta} else 0 end), 0)`,
      redeemed: sql<number>`coalesce(sum(case when ${transactions.pointsDelta} < 0 then -${transactions.pointsDelta} else 0 end), 0)`
    })
    .from(transactions)
    .where(whereClause);

  return {
    issued: Number(row?.issued ?? 0),
    redeemed: Number(row?.redeemed ?? 0)
  };
}

export async function getManagerDashboardStats() {
  const start = monthStart();
  const [activeCustomersRow] = await db
    .select({ count: sql<number>`count(*)` })
    .from(customers)
    .where(eq(customers.active, true));

  const allTime = await pointTotals();
  const thisMonth = await pointTotals(start);

  const topRewards = await db
    .select({
      rewardId: rewards.id,
      name: rewards.name,
      redemptions: sql<number>`count(*)`
    })
    .from(transactions)
    .innerJoin(rewards, eq(transactions.rewardId, rewards.id))
    .where(eq(transactions.type, "redeem"))
    .groupBy(rewards.id)
    .orderBy(desc(sql`count(*)`))
    .limit(5);

  const perBranchThisMonth = await db
    .select({
      branchId: branches.id,
      name: branches.name,
      issued: sql<number>`coalesce(sum(case when ${transactions.pointsDelta} > 0 then ${transactions.pointsDelta} else 0 end), 0)`,
      redeemed: sql<number>`coalesce(sum(case when ${transactions.pointsDelta} < 0 then -${transactions.pointsDelta} else 0 end), 0)`
    })
    .from(branches)
    .leftJoin(
      transactions,
      and(eq(transactions.branchId, branches.id), gte(transactions.createdAt, start))
    )
    .groupBy(branches.id)
    .orderBy(branches.name);

  return {
    activeCustomers: Number(activeCustomersRow?.count ?? 0),
    pointsIssuedAllTime: allTime.issued,
    pointsRedeemedAllTime: allTime.redeemed,
    pointsIssuedThisMonth: thisMonth.issued,
    pointsRedeemedThisMonth: thisMonth.redeemed,
    topRewards: topRewards.map((reward) => ({
      ...reward,
      redemptions: Number(reward.redemptions)
    })),
    perBranchThisMonth: perBranchThisMonth.map((branch) => ({
      ...branch,
      issued: Number(branch.issued),
      redeemed: Number(branch.redeemed)
    }))
  };
}
