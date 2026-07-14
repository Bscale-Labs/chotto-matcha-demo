import "server-only";

import { and, asc, desc, eq, ilike, or, sql } from "drizzle-orm";
import { db } from "@/db/client";
import { customers, transactions } from "@/db/schema";
import { normalizeCustomerCode } from "@/lib/customers/code";

export async function listCustomers() {
  return db.query.customers.findMany({ orderBy: [asc(customers.name)] });
}

export async function searchActiveCustomers(query: string, limit = 8) {
  const value = query.trim();
  if (!value) return [];

  return db.query.customers.findMany({
    where: and(
      eq(customers.active, true),
      or(
        ilike(customers.name, `%${value}%`),
        ilike(customers.code, `%${value}%`),
        ilike(customers.email, `%${value}%`),
        ilike(customers.phone, `%${value}%`)
      )
    ),
    orderBy: [asc(customers.name)],
    limit
  });
}

export async function getCustomerById(id: string) {
  return db.query.customers.findFirst({ where: eq(customers.id, id) });
}

export async function getCustomerByEmail(email: string) {
  return db.query.customers.findFirst({ where: eq(customers.email, email) });
}

export async function getCustomerByPhone(phone: string) {
  return db.query.customers.findFirst({ where: eq(customers.phone, phone) });
}

export async function findCustomer(identifier: string) {
  const value = identifier.trim();
  const normalizedCode = normalizeCustomerCode(value);
  const normalizedCodeNoDash = normalizedCode.replace(/-/g, "");

  return db.query.customers.findFirst({
    where: or(
      eq(customers.id, value),
      eq(customers.code, normalizedCode),
      sql`replace(upper(${customers.code}), '-', '') = ${normalizedCodeNoDash}`,
      eq(customers.email, value),
      eq(customers.phone, value)
    )
  });
}

export async function getCustomerBalance(customerId: string) {
  const customer = await getCustomerById(customerId);
  return customer?.pointsBalance ?? null;
}

export async function getCustomerRecentTransactions(customerId: string, limit = 10) {
  return db.query.transactions.findMany({
    where: eq(transactions.customerId, customerId),
    orderBy: [desc(transactions.createdAt)],
    limit
  });
}

export async function getCustomerRecentTransactionsForBranch(customerId: string, branchId: string, limit = 10) {
  return db.query.transactions.findMany({
    where: and(eq(transactions.customerId, customerId), eq(transactions.branchId, branchId)),
    orderBy: [desc(transactions.createdAt)],
    limit
  });
}
