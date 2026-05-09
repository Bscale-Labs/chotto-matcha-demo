import "server-only";

import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { orgConfig } from "@/db/schema";

const DEFAULT_EARN_RATE = 1;

export async function listOrgConfig() {
  return db.query.orgConfig.findMany();
}

export async function getOrgConfigValue(key: string) {
  return db.query.orgConfig.findFirst({ where: eq(orgConfig.key, key) });
}

export async function getEarnRate() {
  const row = await getOrgConfigValue("earn_rate");
  if (!row) return DEFAULT_EARN_RATE;

  const value = Number(row.value);
  return Number.isFinite(value) && value > 0 ? value : DEFAULT_EARN_RATE;
}

export async function getOrgDisplayConfig() {
  const rows = await listOrgConfig();
  const byKey = new Map(rows.map((row) => [row.key, row.value]));

  return {
    earnRate: Number(byKey.get("earn_rate") ?? DEFAULT_EARN_RATE),
    logoAssetId: byKey.get("logo_asset_id") ?? null,
    orgName: byKey.get("org_name") ?? "Chotto Matcha"
  };
}
