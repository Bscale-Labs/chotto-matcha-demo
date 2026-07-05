import "server-only";

import { and, asc, desc, eq, gte, ilike, lte, or, sql } from "drizzle-orm";
import { db } from "@/db/client";
import {
  branches,
  customers,
  rewards,
  staffProfiles,
  staffRoleDetails,
  transactions,
  userRoles
} from "@/db/schema";
import { normalizeCustomerCode } from "@/lib/customers/code";

export async function listManagerStaff() {
  return db
    .select({
      profile: staffProfiles,
      detail: staffRoleDetails,
      branchName: branches.name
    })
    .from(staffProfiles)
    .innerJoin(staffRoleDetails, eq(staffProfiles.id, staffRoleDetails.staffProfileId))
    .leftJoin(branches, eq(staffRoleDetails.branchId, branches.id))
    .where(
      or(
        eq(staffRoleDetails.role, "manager"),
        eq(staffRoleDetails.role, "cashier"),
        eq(staffRoleDetails.role, "branch_manager")
      )
    )
    .orderBy(asc(staffProfiles.name), asc(staffRoleDetails.role));
}

export async function getManagerStaffProfile(id: string) {
  const rows = await db
    .select({
      profile: staffProfiles,
      detail: staffRoleDetails,
      branchName: branches.name
    })
    .from(staffProfiles)
    .innerJoin(staffRoleDetails, eq(staffProfiles.id, staffRoleDetails.staffProfileId))
    .leftJoin(branches, eq(staffRoleDetails.branchId, branches.id))
    .where(eq(staffProfiles.id, id));

  const first = rows[0];
  if (!first) return null;
  return {
    profile: first.profile,
    roles: rows.map(({ detail, branchName }) => ({ detail, branchName }))
  };
}

export async function listCustomersForManager(search?: string) {
  const value = search?.trim();
  return db.query.customers.findMany({
    where: value
      ? or(
          ilike(customers.code, `%${value}%`),
          ilike(customers.name, `%${value}%`),
          ilike(customers.email, `%${value}%`),
          ilike(customers.phone, `%${value}%`)
        )
      : undefined,
    orderBy: [asc(customers.name)]
  });
}

export type TransactionFilters = {
  type?: "earn" | "redeem" | "manual";
  branchId?: string;
  customerQuery?: string;
  from?: Date;
  to?: Date;
};

export async function listTransactionsWithLabels(filters: TransactionFilters = {}, limit = 100) {
  const customerQuery = filters.customerQuery?.trim();
  const normalizedCustomerCode = customerQuery ? normalizeCustomerCode(customerQuery) : "";
  const normalizedCustomerCodeNoDash = normalizedCustomerCode.replace(/-/g, "");
  const clauses = [
    filters.type ? eq(transactions.type, filters.type) : undefined,
    filters.branchId ? eq(transactions.branchId, filters.branchId) : undefined,
    customerQuery
      ? or(
          eq(transactions.customerId, customerQuery),
          eq(customers.code, normalizedCustomerCode),
          sql`replace(upper(${customers.code}), '-', '') = ${normalizedCustomerCodeNoDash}`,
          ilike(customers.name, `%${customerQuery}%`),
          ilike(customers.email, `%${customerQuery}%`),
          ilike(customers.phone, `%${customerQuery}%`)
        )
      : undefined,
    filters.from ? gte(transactions.createdAt, filters.from) : undefined,
    filters.to ? lte(transactions.createdAt, filters.to) : undefined
  ].filter(Boolean);

  return db
    .select({
      transaction: transactions,
      customerName: customers.name,
      staffName: staffProfiles.name,
      branchName: branches.name,
      rewardName: rewards.name
    })
    .from(transactions)
    .innerJoin(customers, eq(transactions.customerId, customers.id))
    .innerJoin(staffProfiles, eq(transactions.staffProfileId, staffProfiles.id))
    .leftJoin(branches, eq(transactions.branchId, branches.id))
    .leftJoin(rewards, eq(transactions.rewardId, rewards.id))
    .where(clauses.length ? and(...clauses) : undefined)
    .orderBy(desc(transactions.createdAt))
    .limit(limit);
}

export async function getUserRoleIdsForRole(role: "cashier" | "branch_manager" | "manager" | "customer") {
  return db.select({ authUserId: userRoles.authUserId }).from(userRoles).where(eq(userRoles.role, role));
}
