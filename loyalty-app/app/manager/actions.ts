"use server";

import { randomBytes, randomUUID } from "node:crypto";
import { and, eq, inArray, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db/client";
import {
  assets,
  branches,
  customers,
  orgConfig,
  rewardBranchAllocations,
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
import { generateCustomerCode } from "@/lib/customers/code";
import { manualAdjustPoints } from "@/lib/data/transactions";
import { listCustomersForManager } from "@/lib/data/manager";
import { isBranchShiftRole, type BranchShiftRole, type StaffRole } from "@/lib/roles/staff";
import { deleteAssetObject, getAssetUrl, putAssetObject } from "@/lib/storage";

export type CreateAccountState = {
  error?: string;
  temporaryPassword?: string;
  invitationSent?: boolean;
  invitationFailed?: boolean;
  email?: string;
  name?: string;
  customerCode?: string;
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

function staffAssignmentFromForm(formData: FormData): StaffAssignmentInput {
  const branchId = text(formData, "branchId") || null;
  const rawBranchRole = text(formData, "branchRole");
  const adminAccess = text(formData, "adminAccess") === "true";
  let branchRole: BranchShiftRole | null = null;
  if (branchId) {
    if (!isBranchShiftRole(rawBranchRole)) throw new Error("Branch login requires cashier or branch manager role");
    branchRole = rawBranchRole;
  }
  if (!adminAccess && !branchId) throw new Error("Select admin dashboard access or a branch login");

  const roles: StaffRole[] = [];
  if (adminAccess) roles.push("manager");
  if (branchRole) roles.push(branchRole);
  return { adminAccess, branchId, branchRole, roles };
}

const imageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const maxImageSize = 5 * 1024 * 1024;
const staffAccessRoles = ["manager", "cashier", "branch_manager"] as const;

type StaffAssignmentInput = {
  adminAccess: boolean;
  branchId: string | null;
  branchRole: BranchShiftRole | null;
  roles: StaffRole[];
};

function sanitizeFilename(filename: string) {
  return filename
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "reward-image";
}

function assertImageFile(value: FormDataEntryValue | null): File {
  if (!(value instanceof File) || value.size === 0) throw new Error("Choose an image to upload");
  if (!imageTypes.has(value.type)) throw new Error("Image must be a JPG, PNG, WebP, or GIF");
  if (value.size > maxImageSize) throw new Error("Image must be 5MB or smaller");
  return value;
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
  redirect(`/manager/rewards?changed=${rewardId}&toast=reward-created`);
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
  redirect(`/manager/rewards?changed=${id}&toast=reward-updated`);
}

export async function setRewardActive(formData: FormData) {
  await requireManagerSession();
  const id = nonEmpty(formData, "id");
  const active = text(formData, "active") === "true";
  await db.update(rewards).set({ active, updatedAt: new Date() }).where(eq(rewards.id, id));
  revalidatePath("/manager/rewards");
  revalidatePath(`/manager/rewards/${id}/edit`);
  redirect(`/manager/rewards?changed=${id}&toast=${active ? "reward-activated" : "reward-deactivated"}`);
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

/**
 * Upload an image straight into the org asset pool, independent of any reward's
 * save state. Returns the new asset so the client can drop it into the pool
 * (without selecting it) — choosing it is a separate, explicit step.
 */
export async function uploadOrgAsset(formData: FormData) {
  const { profile } = await requireManagerSession();
  const file = assertImageFile(formData.get("image"));

  const assetId = randomUUID();
  const filename = sanitizeFilename(file.name);
  const bucketKey = `assets/${assetId}-${filename}`;

  await putAssetObject({ key: bucketKey, file, contentType: file.type });

  try {
    await db.insert(assets).values({
      id: assetId,
      bucketKey,
      filename,
      contentType: file.type,
      size: file.size,
      uploadedByStaffProfileId: profile.id
    });
  } catch (error) {
    await deleteAssetObject(bucketKey).catch(() => undefined);
    throw error;
  }

  revalidatePath("/manager/rewards");
  return { id: assetId, filename, imageUrl: getAssetUrl(bucketKey) };
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
  redirect(`/manager/branches?changed=${branchId}&toast=branch-created`);
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
  redirect(`/manager/branches?changed=${id}&toast=branch-updated`);
}

export async function setBranchActive(formData: FormData) {
  await requireManagerSession();
  const id = nonEmpty(formData, "id");
  const active = text(formData, "active") === "true";
  await db
    .update(branches)
    .set({ active, updatedAt: new Date() })
    .where(eq(branches.id, id));
  revalidatePath("/manager/branches");
  revalidatePath(`/manager/branches/${id}/edit`);
  redirect(`/manager/branches?changed=${id}&toast=${active ? "branch-opened" : "branch-closed"}`);
}

export async function createStaffAccount(_: CreateAccountState, formData: FormData): Promise<CreateAccountState> {
  await requireManagerSession();
  try {
    const name = nonEmpty(formData, "name");
    const email = nonEmpty(formData, "email").toLowerCase();
    const assignment = staffAssignmentFromForm(formData);
    const pin = text(formData, "pin");
    if (assignment.branchRole && !isValidPin(pin)) throw new Error("PIN must be exactly 4 digits");

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
      await tx.insert(userRoles).values(assignment.roles.map((role) => ({ authUserId: authUser.id, role })));
      await tx.insert(staffRoleDetails).values(
        assignment.roles.map((role) => ({
          staffProfileId,
          role,
          branchId: role === assignment.branchRole ? assignment.branchId : null,
          pinHash: role === assignment.branchRole ? hashDemoPin(pin) : null
        }))
      );
    });

    let invitationFailed = false;
    try {
      await sendSignInLink({
        email,
        callbackURL: assignment.adminAccess ? "/manager" : "/cashier",
        intent: "invite",
        role: assignment.adminAccess ? "manager" : assignment.branchRole ?? "cashier"
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
  const assignment = staffAssignmentFromForm(formData);
  const pin = text(formData, "pin");
  if (pin && !isValidPin(pin)) throw new Error("PIN must be exactly 4 digits");

  await db.transaction(async (tx) => {
    const [profile] = await tx
      .update(staffProfiles)
      .set({ name, updatedAt: new Date() })
      .where(eq(staffProfiles.id, id))
      .returning({ authUserId: staffProfiles.authUserId });
    if (!profile) throw new Error("Staff profile not found");
    const existingBranchDetail = await tx.query.staffRoleDetails.findFirst({
      where: and(
        eq(staffRoleDetails.staffProfileId, id),
        inArray(staffRoleDetails.role, ["cashier", "branch_manager"])
      )
    });
    if (assignment.branchRole && !pin && !existingBranchDetail?.pinHash) {
      throw new Error("New cashier or branch manager role requires a PIN");
    }
    const removedRoles = staffAccessRoles.filter((role) => !assignment.roles.includes(role));

    await tx.update(user).set({ name, updatedAt: new Date() }).where(eq(user.id, profile.authUserId));
    await tx
      .delete(staffRoleDetails)
      .where(and(eq(staffRoleDetails.staffProfileId, id), inArray(staffRoleDetails.role, removedRoles)));
    await tx
      .delete(userRoles)
      .where(and(eq(userRoles.authUserId, profile.authUserId), inArray(userRoles.role, removedRoles)));
    if (assignment.branchRole) {
      const oppositeBranchRole = assignment.branchRole === "cashier" ? "branch_manager" : "cashier";
      await tx
        .delete(staffRoleDetails)
        .where(and(eq(staffRoleDetails.staffProfileId, id), eq(staffRoleDetails.role, oppositeBranchRole)));
      await tx
        .delete(userRoles)
        .where(and(eq(userRoles.authUserId, profile.authUserId), eq(userRoles.role, oppositeBranchRole)));
    }
    for (const role of assignment.roles) {
      await tx.insert(userRoles).values({ authUserId: profile.authUserId, role }).onConflictDoNothing();
      await tx
        .insert(staffRoleDetails)
        .values({
          staffProfileId: id,
          role,
          branchId: role === assignment.branchRole ? assignment.branchId : null,
          pinHash:
            role === assignment.branchRole ? (pin ? hashDemoPin(pin) : existingBranchDetail?.pinHash ?? null) : null
        })
        .onConflictDoUpdate({
          target: [staffRoleDetails.staffProfileId, staffRoleDetails.role],
          set: {
            branchId: role === assignment.branchRole ? assignment.branchId : null,
            pinHash:
              role === assignment.branchRole ? (pin ? hashDemoPin(pin) : existingBranchDetail?.pinHash ?? null) : null,
            updatedAt: new Date()
          }
        });
    }
  });

  revalidatePath("/manager/staff");
  redirect(`/manager/staff?changed=${id}&toast=staff-updated`);
}

export async function resetStaffPin(formData: FormData) {
  await requireManagerSession();
  const id = nonEmpty(formData, "id");
  const pin = nonEmpty(formData, "pin");
  if (!isValidPin(pin)) throw new Error("Cashier PIN must be exactly 4 digits");
  await db
    .update(staffRoleDetails)
    .set({ pinHash: hashDemoPin(pin), updatedAt: new Date() })
    .where(
      and(
        eq(staffRoleDetails.staffProfileId, id),
        inArray(staffRoleDetails.role, ["cashier", "branch_manager"])
      )
    );
  revalidatePath("/manager/staff");
}

export async function setStaffActive(formData: FormData) {
  await requireManagerSession();
  const id = nonEmpty(formData, "id");
  const active = text(formData, "active") === "true";
  await db
    .update(staffProfiles)
    .set({ active, updatedAt: new Date() })
    .where(eq(staffProfiles.id, id));
  revalidatePath("/manager/staff");
  revalidatePath(`/manager/staff/${id}/edit`);
}

export async function createCustomerAccount(_: CreateAccountState, formData: FormData): Promise<CreateAccountState> {
  await requireManagerSession();
  try {
    const name = nonEmpty(formData, "name");
    const email = nonEmpty(formData, "email").toLowerCase();
    const phone = nonEmpty(formData, "phone");
    const password = temporaryPassword();
    const customerCode = generateCustomerCode();

    await auth.api.signUpEmail({ body: { email, password, name } });
    const authUser = await getAuthUserByEmail(email);
    if (!authUser) throw new Error("Auth user was not created");

    await db.transaction(async (tx) => {
      await tx.insert(customers).values({
        id: randomUUID(),
        authUserId: authUser.id,
        code: customerCode,
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
    return {
      temporaryPassword: password,
      invitationSent: !invitationFailed,
      invitationFailed,
      email,
      name,
      customerCode
    };
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
    const [customer] = await tx
      .update(customers)
      .set({ name, email, phone, updatedAt: new Date() })
      .where(eq(customers.id, id))
      .returning({ authUserId: customers.authUserId });
    if (!customer) throw new Error("Customer not found");
    await tx.update(user).set({ name, email, updatedAt: new Date() }).where(eq(user.id, customer.authUserId));
  });

  revalidatePath("/manager/customers");
  redirect(`/manager/customers?changed=${id}&toast=customer-updated`);
}

export async function setCustomerActive(formData: FormData) {
  await requireManagerSession();
  const id = nonEmpty(formData, "id");
  const active = text(formData, "active") === "true";
  await db
    .update(customers)
    .set({ active, updatedAt: new Date() })
    .where(eq(customers.id, id));
  revalidatePath("/manager/customers");
  revalidatePath(`/manager/customers/${id}/edit`);
}

export async function searchManagerCustomers(query: string) {
  await requireManagerSession();
  const customerRows = await listCustomersForManager(query);

  return {
    customers: customerRows.map((customer) => ({
      id: customer.id,
      code: customer.code,
      email: customer.email,
      name: customer.name,
      phone: customer.phone,
      pointsBalance: customer.pointsBalance,
      active: customer.active
    }))
  };
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
    .values([
      { key: "earn_rate", value: String(earnRate), valueType: "number" },
      { key: "org_name", value: orgName, valueType: "string" }
    ])
    .onConflictDoUpdate({
      target: orgConfig.key,
      set: {
        value: sql`excluded.value`,
        valueType: sql`excluded.value_type`,
        updatedAt: new Date()
      }
    });

  revalidatePath("/manager/settings");
}
