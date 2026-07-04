import "server-only";

import { desc, sql } from "drizzle-orm";
import { db } from "@/db/client";
import { assets } from "@/db/schema";
import { getAssetUrl } from "@/lib/storage";

export async function listImageAssetsForManager() {
  const rows = await db
    .select({
      id: assets.id,
      filename: assets.filename,
      bucketKey: assets.bucketKey,
      createdAt: assets.createdAt
    })
    .from(assets)
    .where(sql`${assets.contentType} like 'image/%'`)
    .orderBy(desc(assets.createdAt));

  return rows.map((asset) => ({
    id: asset.id,
    filename: asset.filename,
    imageUrl: getAssetUrl(asset.bucketKey),
    createdAt: asset.createdAt
  }));
}
