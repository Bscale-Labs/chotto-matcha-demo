import "server-only";

import { asc, desc, eq, or } from "drizzle-orm";
import { db } from "@/db/client";
import { customers, transactions } from "@/db/schema";

export async function listCustomers() {
  return db.query.customers.findMany({ orderBy: [asc(customers.name)] });
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
  return db.query.customers.findFirst({
    where: or(
      eq(customers.id, identifier),
      eq(customers.email, identifier),
      eq(customers.phone, identifier)
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
