"use server";

import { randomBytes, randomUUID } from "node:crypto";
import { and, eq, or, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db/client";
import {
  assets,
  branches,
  customers,
  orgConfig,
  rewardBranchAllocations,
  rewardTiers,
  rewards,
  staffProfiles,
  staffRoleDetails,
  user,
  userRoles
} from "@/db/schema";
import { auth } from "@/lib/auth/server";
import { sendSignInLink } from "@/lib/auth/magic-link";
import { hashDemoPin, isValidPin } from "@/lib/auth/pin";
import { requireManagerSession } from "@/lib/auth/session";
import { manualAdjustPoints } from "@/lib/data/transactions";
import { deleteAssetObject, putAssetObject } from "@/lib/storage";

export type CreateAccountState = {
  error?: string;
  temporaryPassword?: string;
  invitationSent?: boolean;
  invitationFailed?: boolean;
  email?: string;
  name?: string;
};

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function positiveInteger(formData: FormData, key: string) {
  const value = Number(text(formData, key));
  if (!Number.isInteger(value) || value <= 0) throw new Error(`${key} must be a positive integer`);
  return value;
}

function optionalStock(formData: FormData) {
  const raw = text(formData, "stockCount");
  if (!raw) return null;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < 0) throw new Error("stockCount must be a non-negative integer");
  return value;
}

function nonEmpty(formData: FormData, key: string) {
  const value = text(formData, key);
  if (!value) throw new Error(`${key} is required`);
  return value;
}

function optionalText(formData: FormData, key: string) {
  return text(formData, key) || null;
}

const imageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const maxImageSize = 5 * 1024 * 1024;

function sanitizeFilename(filename: string) {
  return filename
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "reward-image";
}

function optionalImage(formData: FormData) {
  const value = formData.get("image");
  if (!(value instanceof File) || value.size === 0) return null;
  if (!imageTypes.has(value.type)) throw new Error("Reward image must be a JPG, PNG, WebP, or GIF");
  if (value.size > maxImageSize) throw new Error("Reward image must be 5MB or smaller");
  return value;
}

async function uploadRewardImage({
  file,
  rewardId,
  staffProfileId
}: {
  file: File;
  rewardId: string;
  staffProfileId: string;
}) {
  const assetId = randomUUID();
  const filename = sanitizeFilename(file.name);
  const bucketKey = `rewards/${rewardId}/${assetId}-${filename}`;

  await putAssetObject({ key: bucketKey, file, contentType: file.type });

  return {
    id: assetId,
    bucketKey,
    filename,
    contentType: file.type,
    size: file.size,
    uploadedByStaffProfileId: staffProfileId
  };
}

function temporaryPassword() {
  return `Chotto-${randomBytes(5).toString("base64url")}-1`;
}

async function getAuthUserByEmail(email: string) {
  return db.query.user.findFirst({ where: eq(user.email, email) });
}

export async function createReward(formData: FormData) {
  const { profile } = await requireManagerSession();
  const name = nonEmpty(formData, "name");
  const description = nonEmpty(formData, "description");
  const pointCost = positiveInteger(formData, "pointCost");
  const type = text(formData, "type");
  if (type !== "item" && type !== "merch") throw new Error("Invalid reward type");
  const initialStockCount = optionalStock(formData);
  const image = optionalImage(formData);
  const existingImageAssetId = text(formData, "imageAssetId") || null;
  const rewardId = randomUUID();
  const imageAsset = image
    ? await uploadRewardImage({ file: image, rewardId, staffProfileId: profile.id })
    : null;

  try {
    await db.transaction(async (tx) => {
      if (imageAsset) await tx.insert(assets).values(imageAsset);
      await tx.insert(rewards).values({
        id: rewardId,
        name,
        description,
        imageAssetId: imageAsset?.id ?? existingImageAssetId,
        pointCost,
        type,
        stockCount: initialStockCount,
        active: true
      });
      const branchRows = await tx.select({ id: branches.id }).from(branches);
      if (branchRows.length > 0) {
        await tx.insert(rewardBranchAllocations).values(
          branchRows.map((branch) => ({
            rewardId,
            branchId: branch.id,
            stockCount: initialStockCount,
            active: true
          }))
        );
      }
    });
  } catch (error) {
    if (imageAsset) await deleteAssetObject(imageAsset.bucketKey).catch(() => undefined);
    throw error;
  }

  revalidatePath("/manager/rewards");
  redirect(`/manager/rewards?changed=${rewardId}`);
}

export async function updateReward(formData: FormData) {
  const { profile } = await requireManagerSession();
  const id = nonEmpty(formData, "id");
  const name = nonEmpty(formData, "name");
  const description = nonEmpty(formData, "description");
  const pointCost = positiveInteger(formData, "pointCost");
  const type = text(formData, "type");
  if (type !== "item" && type !== "merch") throw new Error("Invalid reward type");
  const active = text(formData, "active");
  const image = optionalImage(formData);
  const existingImageAssetId = text(formData, "imageAssetId") || null;
  const imageAsset = image
    ? await uploadRewardImage({ file: image, rewardId: id, staffProfileId: profile.id })
    : null;

  try {
    await db.transaction(async (tx) => {
      if (imageAsset) {
        await tx.insert(assets).values(imageAsset);
      }

      await tx
        .update(rewards)
        .set({
          name,
          description,
          imageAssetId: imageAsset?.id ?? existingImageAssetId,
          pointCost,
          type,
          ...(active ? { active: active === "true" } : {}),
          updatedAt: new Date()
        })
        .where(eq(rewards.id, id));
    });
  } catch (error) {
    if (imageAsset) await deleteAssetObject(imageAsset.bucketKey).catch(() => undefined);
    throw error;
  }

  revalidatePath("/manager/rewards");
  redirect(`/manager/rewards?changed=${id}`);
}

export async function setRewardActive(formData: FormData) {
  await requireManagerSession();
  const id = nonEmpty(formData, "id");
  const active = text(formData, "active") === "true";
  await db.update(rewards).set({ active, updatedAt: new Date() }).where(eq(rewards.id, id));
  revalidatePath("/manager/rewards");
  revalidatePath(`/manager/rewards/${id}/edit`);
  redirect(`/manager/rewards?changed=${id}`);
}

export async function adjustRewardStock(formData: FormData) {
  await requireManagerSession();
  const id = nonEmpty(formData, "id");
  const delta = Number(text(formData, "delta"));
  if (!Number.isInteger(delta) || delta === 0) throw new Error("Stock adjustment must be non-zero");
  await db
    .update(rewards)
    .set({
      stockCount: sql`greatest(coalesce(${rewards.stockCount}, 0) + ${delta}, 0)`,
      updatedAt: new Date()
    })
    .where(eq(rewards.id, id));
  revalidatePath("/manager/rewards");
  revalidatePath(`/manager/rewards/${id}/edit`);
}

export async function updateRewardAllocation(formData: FormData) {
  await requireManagerSession();
  const rewardId = nonEmpty(formData, "rewardId");
  const branchId = nonEmpty(formData, "branchId");
  const stockCount = optionalStock(formData);
  const active = text(formData, "active") === "true";
  await db
    .insert(rewardBranchAllocations)
    .values({
      rewardId,
      branchId,
      stockCount,
      active
    })
    .onConflictDoUpdate({
      target: [rewardBranchAllocations.rewardId, rewardBranchAllocations.branchId],
      set: {
        stockCount,
        active,
        updatedAt: new Date()
      }
    });
  revalidatePath("/manager/rewards");
  revalidatePath(`/manager/rewards/${rewardId}/edit`);
  revalidatePath(`/manager/rewards/${rewardId}/edit?branchId=${branchId}`);
}

export async function updateRewardTiers(formData: FormData) {
  await requireManagerSession();
  const tierIds = formData.getAll("tierId").map((value) => String(value));
  if (tierIds.length === 0) throw new Error("At least one reward tier is required");

  const nextTiers = tierIds.map((id) => {
    const name = nonEmpty(formData, `name-${id}`);
    const description = nonEmpty(formData, `description-${id}`);
    const minPoints = Number(nonEmpty(formData, `minPoints-${id}`));
    const sortOrder = Number(nonEmpty(formData, `sortOrder-${id}`));

    if (!Number.isInteger(minPoints) || minPoints < 0) {
      throw new Error(`${name} minimum points must be a non-negative integer`);
    }
    if (!Number.isInteger(sortOrder) || sortOrder <= 0) {
      throw new Error(`${name} sort order must be a positive integer`);
    }

    return { id, name, description, minPoints, sortOrder };
  }).sort((left, right) => left.sortOrder - right.sortOrder);

  if (nextTiers[0]?.minPoints !== 0) {
    throw new Error("The first reward tier must start at 0 points");
  }
  for (let index = 1; index < nextTiers.length; index += 1) {
    if (nextTiers[index].minPoints <= nextTiers[index - 1].minPoints) {
      throw new Error("Reward tier minimum points must increase from one tier to the next");
    }
  }

  await db.transaction(async (tx) => {
    for (const tier of nextTiers) {
      await tx
        .insert(rewardTiers)
        .values({
          id: tier.id,
          name: tier.name,
          description: tier.description,
          minPoints: tier.minPoints,
          sortOrder: tier.sortOrder,
          active: true
        })
        .onConflictDoUpdate({
          target: rewardTiers.id,
          set: {
            name: tier.name,
            description: tier.description,
            minPoints: tier.minPoints,
            sortOrder: tier.sortOrder,
            active: true,
            updatedAt: new Date()
          }
        });
    }
  });

  revalidatePath("/manager/reward-tiers");
  revalidatePath("/manager/customers");
  revalidatePath("/customer");
  revalidatePath("/customer/profile");
  revalidatePath("/customer/qr");
  revalidatePath("/cashier/customer/[id]", "page");
}

export async function deleteImageAsset(assetId: string) {
  await requireManagerSession();
  if (!assetId) throw new Error("assetId is required");

  const asset = await db.query.assets.findFirst({ where: eq(assets.id, assetId) });
  if (!asset) return;
  if (!asset.contentType.startsWith("image/")) throw new Error("Only image assets can be deleted here");

  await db.transaction(async (tx) => {
    await tx.delete(assets).where(eq(assets.id, assetId));

    const logoConfig = await tx.query.orgConfig.findFirst({ where: eq(orgConfig.key, "logo_asset_id") });
    if (logoConfig?.value === assetId) {
      await tx
        .update(orgConfig)
        .set({ value: "", updatedAt: new Date() })
        .where(eq(orgConfig.key, "logo_asset_id"));
    }
  });

  await deleteAssetObject(asset.bucketKey).catch(() => undefined);
  revalidatePath("/manager/rewards");
  revalidatePath("/manager/settings");
}

export async function createBranch(formData: FormData) {
  await requireManagerSession();
  const branchId = randomUUID();
  await db.insert(branches).values({
    id: branchId,
    code: optionalText(formData, "code"),
    name: nonEmpty(formData, "name"),
    address: nonEmpty(formData, "address"),
    googleMapsUrl: optionalText(formData, "googleMapsUrl"),
    active: text(formData, "active") !== "false"
  });
  revalidatePath("/manager/branches");
  redirect(`/manager/branches?changed=${branchId}`);
}

export async function updateBranch(formData: FormData) {
  await requireManagerSession();
  const id = nonEmpty(formData, "id");
  await db
    .update(branches)
    .set({
      code: optionalText(formData, "code"),
      name: nonEmpty(formData, "name"),
      address: nonEmpty(formData, "address"),
      googleMapsUrl: optionalText(formData, "googleMapsUrl"),
      active: text(formData, "active") !== "false",
      updatedAt: new Date()
    })
    .where(eq(branches.id, id));
  revalidatePath("/manager/branches");
  redirect(`/manager/branches?changed=${id}`);
}

export async function setBranchActive(formData: FormData) {
  await requireManagerSession();
  const id = nonEmpty(formData, "id");
  await db
    .update(branches)
    .set({ active: text(formData, "active") === "true", updatedAt: new Date() })
    .where(eq(branches.id, id));
  revalidatePath("/manager/branches");
  revalidatePath(`/manager/branches/${id}/edit`);
  redirect(`/manager/branches?changed=${id}`);
}

export async function createStaffAccount(_: CreateAccountState, formData: FormData): Promise<CreateAccountState> {
  await requireManagerSession();
  try {
    const name = nonEmpty(formData, "name");
    const email = nonEmpty(formData, "email").toLowerCase();
    const role = text(formData, "role");
    const branchId = text(formData, "branchId") || null;
    const pin = text(formData, "pin");
    if (role !== "manager" && role !== "cashier") throw new Error("Invalid staff role");
    if (role === "cashier" && !branchId) throw new Error("Cashiers require a branch");
    if (role === "cashier" && !isValidPin(pin)) throw new Error("Cashier PIN must be 4 to 8 digits");

    const password = temporaryPassword();
    await auth.api.signUpEmail({ body: { email, password, name } });
    const authUser = await getAuthUserByEmail(email);
    if (!authUser) throw new Error("Auth user was not created");

    await db.transaction(async (tx) => {
      const staffProfileId = randomUUID();
      await tx.insert(staffProfiles).values({
        id: staffProfileId,
        authUserId: authUser.id,
        email,
        name,
        active: true
      });
      await tx.insert(userRoles).values({ authUserId: authUser.id, role });
      await tx.insert(staffRoleDetails).values({
        staffProfileId,
        role,
        branchId: role === "cashier" ? branchId : null,
        pinHash: role === "cashier" ? hashDemoPin(pin) : null
      });
    });

    let invitationFailed = false;
    try {
      await sendSignInLink({
        email,
        callbackURL: role === "cashier" ? "/cashier" : "/manager",
        intent: "invite",
        role
      });
    } catch {
      invitationFailed = true;
    }
    revalidatePath("/manager/staff");
    return { temporaryPassword: password, invitationSent: !invitationFailed, invitationFailed, email, name };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Could not create staff account" };
  }
}

export async function updateStaff(formData: FormData) {
  await requireManagerSession();
  const id = nonEmpty(formData, "id");
  const name = nonEmpty(formData, "name");
  const email = nonEmpty(formData, "email").toLowerCase();
  const role = text(formData, "role");
  const branchId = text(formData, "branchId") || null;
  const pin = text(formData, "pin");
  if (role !== "manager" && role !== "cashier") throw new Error("Invalid staff role");
  if (role === "cashier" && !branchId) throw new Error("Cashiers require a branch");
  if (pin && !isValidPin(pin)) throw new Error("Cashier PIN must be 4 to 8 digits");

  await db.transaction(async (tx) => {
    const profile = await tx.query.staffProfiles.findFirst({ where: eq(staffProfiles.id, id) });
    if (!profile) throw new Error("Staff profile not found");
    const existingDetail = await tx.query.staffRoleDetails.findFirst({
      where: eq(staffRoleDetails.staffProfileId, id)
    });
    if (role === "cashier" && !pin && !existingDetail?.pinHash) {
      throw new Error("New cashier role requires a PIN");
    }

    await tx.update(user).set({ name, email, updatedAt: new Date() }).where(eq(user.id, profile.authUserId));
    await tx.update(staffProfiles).set({ name, email, updatedAt: new Date() }).where(eq(staffProfiles.id, id));
    await tx.delete(staffRoleDetails).where(eq(staffRoleDetails.staffProfileId, id));
    await tx
      .delete(userRoles)
      .where(
        and(
          eq(userRoles.authUserId, profile.authUserId),
          or(eq(userRoles.role, "manager"), eq(userRoles.role, "cashier"))
        )
      );
    await tx.insert(userRoles).values({ authUserId: profile.authUserId, role });
    await tx.insert(staffRoleDetails).values({
      staffProfileId: id,
      role,
      branchId: role === "cashier" ? branchId : null,
      pinHash: role === "cashier" ? (pin ? hashDemoPin(pin) : existingDetail?.pinHash ?? null) : null
    });
  });

  revalidatePath("/manager/staff");
  redirect(`/manager/staff?changed=${id}`);
}

export async function resetStaffPin(formData: FormData) {
  await requireManagerSession();
  const id = nonEmpty(formData, "id");
  const pin = nonEmpty(formData, "pin");
  if (!isValidPin(pin)) throw new Error("Cashier PIN must be 4 to 8 digits");
  await db
    .update(staffRoleDetails)
    .set({ pinHash: hashDemoPin(pin), updatedAt: new Date() })
    .where(and(eq(staffRoleDetails.staffProfileId, id), eq(staffRoleDetails.role, "cashier")));
  revalidatePath("/manager/staff");
}

export async function setStaffActive(formData: FormData) {
  await requireManagerSession();
  const id = nonEmpty(formData, "id");
  await db
    .update(staffProfiles)
    .set({ active: text(formData, "active") === "true", updatedAt: new Date() })
    .where(eq(staffProfiles.id, id));
  revalidatePath("/manager/staff");
  revalidatePath(`/manager/staff/${id}/edit`);
  redirect(`/manager/staff?changed=${id}`);
}

export async function createCustomerAccount(_: CreateAccountState, formData: FormData): Promise<CreateAccountState> {
  await requireManagerSession();
  try {
    const name = nonEmpty(formData, "name");
    const email = nonEmpty(formData, "email").toLowerCase();
    const phone = nonEmpty(formData, "phone");
    const password = temporaryPassword();

    await auth.api.signUpEmail({ body: { email, password, name } });
    const authUser = await getAuthUserByEmail(email);
    if (!authUser) throw new Error("Auth user was not created");

    await db.transaction(async (tx) => {
      await tx.insert(customers).values({
        id: randomUUID(),
        authUserId: authUser.id,
        email,
        name,
        phone,
        active: true
      });
      await tx.insert(userRoles).values({ authUserId: authUser.id, role: "customer" }).onConflictDoNothing();
    });

    let invitationFailed = false;
    try {
      await sendSignInLink({ email, callbackURL: "/customer", intent: "invite", role: "customer" });
    } catch {
      invitationFailed = true;
    }
    revalidatePath("/manager/customers");
    return { temporaryPassword: password, invitationSent: !invitationFailed, invitationFailed, email, name };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Could not create customer account" };
  }
}

export async function updateCustomer(formData: FormData) {
  await requireManagerSession();
  const id = nonEmpty(formData, "id");
  const name = nonEmpty(formData, "name");
  const email = nonEmpty(formData, "email").toLowerCase();
  const phone = nonEmpty(formData, "phone");

  await db.transaction(async (tx) => {
    const customer = await tx.query.customers.findFirst({ where: eq(customers.id, id) });
    if (!customer) throw new Error("Customer not found");
    await tx.update(user).set({ name, email, updatedAt: new Date() }).where(eq(user.id, customer.authUserId));
    await tx
      .update(customers)
      .set({ name, email, phone, updatedAt: new Date() })
      .where(eq(customers.id, id));
  });

  revalidatePath("/manager/customers");
  redirect(`/manager/customers?changed=${id}`);
}

export async function setCustomerActive(formData: FormData) {
  await requireManagerSession();
  const id = nonEmpty(formData, "id");
  await db
    .update(customers)
    .set({ active: text(formData, "active") === "true", updatedAt: new Date() })
    .where(eq(customers.id, id));
  revalidatePath("/manager/customers");
  revalidatePath(`/manager/customers/${id}/edit`);
  redirect(`/manager/customers?changed=${id}`);
}

export async function adjustCustomerPoints(formData: FormData) {
  const customerId = nonEmpty(formData, "id");
  const { profile } = await requireManagerSession();
  await manualAdjustPoints({
    customerId,
    managerStaffProfileId: profile.id,
    pointsDelta: Number(nonEmpty(formData, "pointsDelta")),
    reason: nonEmpty(formData, "reason")
  });
  revalidatePath("/manager/customers");
  revalidatePath(`/manager/customers/${customerId}/edit`);
  revalidatePath("/manager/transactions");
}

export async function updateSettings(formData: FormData) {
  await requireManagerSession();
  const earnRate = Number(nonEmpty(formData, "earnRate"));
  if (!Number.isFinite(earnRate) || earnRate <= 0) throw new Error("Earn rate must be positive");
  const orgName = nonEmpty(formData, "orgName");

  await db
    .insert(orgConfig)
    .values({ key: "earn_rate", value: String(earnRate), valueType: "number" })
    .onConflictDoUpdate({
      target: orgConfig.key,
      set: { value: String(earnRate), valueType: "number", updatedAt: new Date() }
    });
  await db
    .insert(orgConfig)
    .values({ key: "org_name", value: orgName, valueType: "string" })
    .onConflictDoUpdate({
      target: orgConfig.key,
      set: { value: orgName, valueType: "string", updatedAt: new Date() }
    });

  revalidatePath("/manager/settings");
}
