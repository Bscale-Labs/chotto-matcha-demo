import "server-only";

import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { db } from "@/db/client";
import {
  branches,
  customers,
  orgConfig,
  rewardBranchAllocations,
  rewards,
  staffProfiles,
  staffRoleDetails,
  transactions
} from "@/db/schema";

type AwardPointsInput = {
  customerId: string;
  staffProfileId: string;
  branchId: string;
  billTotalCents: number;
};

type RedeemRewardInput = {
  customerId: string;
  staffProfileId: string;
  branchId: string;
  rewardId: string;
};

type ManualAdjustPointsInput = {
  customerId: string;
  managerStaffProfileId: string;
  pointsDelta: number;
  reason: string;
};

export async function listTransactions(limit = 100) {
  return db.query.transactions.findMany({
    orderBy: [desc(transactions.createdAt)],
    limit
  });
}

export async function getTransactionById(id: string) {
  return db.query.transactions.findFirst({ where: eq(transactions.id, id) });
}

export async function listRecentTransactionsForBranch(branchId: string, limit = 10) {
  return db.query.transactions.findMany({
    where: eq(transactions.branchId, branchId),
    orderBy: [desc(transactions.createdAt)],
    limit
  });
}

export async function awardPoints(input: AwardPointsInput) {
  if (!Number.isInteger(input.billTotalCents) || input.billTotalCents <= 0) {
    throw new Error("billTotalCents must be a positive integer");
  }

  return db.transaction(async (tx) => {
    const staffRole = await tx.query.staffRoleDetails.findFirst({
      where: and(
        eq(staffRoleDetails.staffProfileId, input.staffProfileId),
        inArray(staffRoleDetails.role, ["cashier", "branch_manager"]),
        eq(staffRoleDetails.branchId, input.branchId)
      )
    });
    if (!staffRole) throw new Error("Staff member is not assigned to this branch");

    const staff = await tx.query.staffProfiles.findFirst({
      where: and(eq(staffProfiles.id, input.staffProfileId), eq(staffProfiles.active, true))
    });
    if (!staff) throw new Error("Staff profile is inactive or missing");

    const branch = await tx.query.branches.findFirst({
      where: and(eq(branches.id, input.branchId), eq(branches.active, true))
    });
    if (!branch) throw new Error("Branch is inactive or missing");

    const earnRateRow = await tx.query.orgConfig.findFirst({
      where: eq(orgConfig.key, "earn_rate")
    });
    const earnRate = Number(earnRateRow?.value ?? 1);
    const pointsDelta = Math.floor((input.billTotalCents * earnRate) / 100);
    if (!Number.isFinite(pointsDelta) || pointsDelta <= 0) {
      throw new Error("Earn rate produced no points");
    }

    const [updatedCustomer] = await tx
      .update(customers)
      .set({
        pointsBalance: sql`${customers.pointsBalance} + ${pointsDelta}`,
        updatedAt: new Date()
      })
      .where(and(eq(customers.id, input.customerId), eq(customers.active, true)))
      .returning();
    if (!updatedCustomer) throw new Error("Customer is inactive or missing");

    const [ledgerRow] = await tx
      .insert(transactions)
      .values({
        id: randomUUID(),
        customerId: input.customerId,
        staffProfileId: input.staffProfileId,
        branchId: input.branchId,
        type: "earn",
        pointsDelta,
        billTotalCents: input.billTotalCents
      })
      .returning();

    return { customer: updatedCustomer, transaction: ledgerRow };
  });
}

export async function redeemReward(input: RedeemRewardInput) {
  return db.transaction(async (tx) => {
    const staffRole = await tx.query.staffRoleDetails.findFirst({
      where: and(
        eq(staffRoleDetails.staffProfileId, input.staffProfileId),
        inArray(staffRoleDetails.role, ["cashier", "branch_manager"]),
        eq(staffRoleDetails.branchId, input.branchId)
      )
    });
    if (!staffRole) throw new Error("Staff member is not assigned to this branch");

    const staff = await tx.query.staffProfiles.findFirst({
      where: and(eq(staffProfiles.id, input.staffProfileId), eq(staffProfiles.active, true))
    });
    if (!staff) throw new Error("Staff profile is inactive or missing");

    const branch = await tx.query.branches.findFirst({
      where: and(eq(branches.id, input.branchId), eq(branches.active, true))
    });
    if (!branch) throw new Error("Branch is inactive or missing");

    const rewardRows = await tx
      .select({
        id: rewards.id,
        pointCost: rewards.pointCost,
        stockCount: rewardBranchAllocations.stockCount
      })
      .from(rewardBranchAllocations)
      .innerJoin(rewards, eq(rewardBranchAllocations.rewardId, rewards.id))
      .where(
        and(
          eq(rewardBranchAllocations.rewardId, input.rewardId),
          eq(rewardBranchAllocations.branchId, input.branchId),
          eq(rewardBranchAllocations.active, true),
          eq(rewards.active, true)
        )
      )
      .limit(1);
    const reward = rewardRows[0];
    if (!reward) throw new Error("Reward is not available at this branch");
    if (reward.stockCount !== null && reward.stockCount <= 0) throw new Error("Reward is out of stock");

    if (reward.stockCount !== null) {
      const [updatedAllocation] = await tx
        .update(rewardBranchAllocations)
        .set({
          stockCount: sql`${rewardBranchAllocations.stockCount} - 1`,
          updatedAt: new Date()
        })
        .where(
          and(
            eq(rewardBranchAllocations.rewardId, input.rewardId),
            eq(rewardBranchAllocations.branchId, input.branchId),
            eq(rewardBranchAllocations.active, true),
            sql`${rewardBranchAllocations.stockCount} > 0`
          )
        )
        .returning();
      if (!updatedAllocation) throw new Error("Reward is out of stock");
    }

    const [updatedCustomer] = await tx
      .update(customers)
      .set({
        pointsBalance: sql`${customers.pointsBalance} - ${reward.pointCost}`,
        updatedAt: new Date()
      })
      .where(
        and(
          eq(customers.id, input.customerId),
          eq(customers.active, true),
          sql`${customers.pointsBalance} >= ${reward.pointCost}`
        )
      )
      .returning();
    if (!updatedCustomer) throw new Error("Customer has insufficient points or is missing");

    const [ledgerRow] = await tx
      .insert(transactions)
      .values({
        id: randomUUID(),
        customerId: input.customerId,
        staffProfileId: input.staffProfileId,
        branchId: input.branchId,
        type: "redeem",
        pointsDelta: -reward.pointCost,
        rewardId: input.rewardId
      })
      .returning();

    return { customer: updatedCustomer, transaction: ledgerRow };
  });
}

export async function manualAdjustPoints(input: ManualAdjustPointsInput) {
  const reason = input.reason.trim();
  if (!reason) throw new Error("Manual adjustments require a reason");
  if (!Number.isInteger(input.pointsDelta) || input.pointsDelta === 0) {
    throw new Error("pointsDelta must be a non-zero integer");
  }

  return db.transaction(async (tx) => {
    const managerRole = await tx.query.staffRoleDetails.findFirst({
      where: and(
        eq(staffRoleDetails.staffProfileId, input.managerStaffProfileId),
        eq(staffRoleDetails.role, "manager")
      )
    });
    if (!managerRole) throw new Error("Manager staff profile is missing");

    const manager = await tx.query.staffProfiles.findFirst({
      where: and(eq(staffProfiles.id, input.managerStaffProfileId), eq(staffProfiles.active, true))
    });
    if (!manager) throw new Error("Manager staff profile is inactive");

    const [updatedCustomer] = await tx
      .update(customers)
      .set({
        pointsBalance: sql`${customers.pointsBalance} + ${input.pointsDelta}`,
        updatedAt: new Date()
      })
      .where(
        and(
          eq(customers.id, input.customerId),
          eq(customers.active, true),
          sql`${customers.pointsBalance} + ${input.pointsDelta} >= 0`
        )
      )
      .returning();
    if (!updatedCustomer) throw new Error("Customer is missing or adjustment would make balance negative");

    const [ledgerRow] = await tx
      .insert(transactions)
      .values({
        id: randomUUID(),
        customerId: input.customerId,
        staffProfileId: input.managerStaffProfileId,
        branchId: null,
        type: "manual",
        pointsDelta: input.pointsDelta,
        reason
      })
      .returning();

    return { customer: updatedCustomer, transaction: ledgerRow };
  });
}
