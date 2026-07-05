import "server-only";

import { and, asc, desc, eq, inArray, isNotNull, sql } from "drizzle-orm";
import { db } from "@/db/client";
import { branches, customers, staffProfiles, staffRoleDetails, transactions, userRoles } from "@/db/schema";

export async function listStaffProfiles() {
  return db.query.staffProfiles.findMany({ orderBy: [asc(staffProfiles.name)] });
}

export async function getStaffProfileById(id: string) {
  return db.query.staffProfiles.findFirst({ where: eq(staffProfiles.id, id) });
}

export async function getStaffProfileByAuthUserId(authUserId: string) {
  return db.query.staffProfiles.findFirst({ where: eq(staffProfiles.authUserId, authUserId) });
}

export async function listStaffRoleDetails() {
  return db.select().from(staffRoleDetails);
}

export async function listCashiersForBranch(branchId: string) {
  return db
    .select({ profile: staffProfiles, detail: staffRoleDetails })
    .from(staffProfiles)
    .innerJoin(staffRoleDetails, eq(staffProfiles.id, staffRoleDetails.staffProfileId))
    .where(
      and(
        eq(staffProfiles.active, true),
        inArray(staffRoleDetails.role, ["cashier", "branch_manager"]),
        eq(staffRoleDetails.branchId, branchId)
      )
    )
    .orderBy(asc(staffProfiles.name));
}

export async function listActiveCashiersWithBranches() {
  return db
    .select({
      profile: staffProfiles,
      detail: staffRoleDetails,
      branch: branches
    })
    .from(staffProfiles)
    .innerJoin(staffRoleDetails, eq(staffProfiles.id, staffRoleDetails.staffProfileId))
    .innerJoin(userRoles, eq(staffProfiles.authUserId, userRoles.authUserId))
    .innerJoin(branches, eq(staffRoleDetails.branchId, branches.id))
    .where(
      and(
        eq(staffProfiles.active, true),
        inArray(userRoles.role, ["cashier", "branch_manager"]),
        inArray(staffRoleDetails.role, ["cashier", "branch_manager"]),
        eq(branches.active, true),
        isNotNull(staffRoleDetails.pinHash)
      )
    )
    .orderBy(asc(branches.name), asc(staffProfiles.name));
}

export async function listBranchCustomerAccounts(branchId: string, limit = 80) {
  const lastActivity = sql<Date>`max(${transactions.createdAt})`;

  return db
    .select({
      id: customers.id,
      name: customers.name,
      email: customers.email,
      phone: customers.phone,
      pointsBalance: customers.pointsBalance,
      lastActivityAt: lastActivity,
      branchTransactions: sql<number>`count(${transactions.id})::int`
    })
    .from(customers)
    .innerJoin(transactions, eq(customers.id, transactions.customerId))
    .where(and(eq(customers.active, true), eq(transactions.branchId, branchId)))
    .groupBy(customers.id, customers.name, customers.email, customers.phone, customers.pointsBalance)
    .orderBy(desc(lastActivity))
    .limit(limit);
}
