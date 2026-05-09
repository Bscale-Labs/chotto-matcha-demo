import "server-only";

import { asc, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { branches } from "@/db/schema";

export async function listBranches() {
  return db.query.branches.findMany({ orderBy: [asc(branches.name)] });
}

export async function listActiveBranches() {
  return db.query.branches.findMany({
    where: eq(branches.active, true),
    orderBy: [asc(branches.name)]
  });
}

export async function getBranchById(id: string) {
  return db.query.branches.findFirst({ where: eq(branches.id, id) });
}
