"use server";

import { randomBytes, randomUUID } from "node:crypto";
import { verifyPassword } from "better-auth/crypto";
import { and, eq, inArray, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db/client";
import {
  account,
  customers,
  rewardBranchAllocations,
  staffProfiles,
  staffRoleDetails,
  transactions,
  user,
  userRoles
} from "@/db/schema";
import { auth } from "@/lib/auth/server";
import { sendSignInLink } from "@/lib/auth/magic-link";
import { hashDemoPin, isValidPin } from "@/lib/auth/pin";
import { clearCashierShiftCookie, setCashierShiftCookie } from "@/lib/auth/shift";
import {
  requireCashierManagerPageSession,
  requireCashierShiftSession,
  requireCashierTerminalSession
} from "@/lib/auth/session";
import { generateCustomerCode } from "@/lib/customers/code";
import { awardPoints, redeemReward } from "@/lib/data/transactions";
import { isBranchShiftRole, type BranchShiftRole } from "@/lib/roles/staff";

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

function nonEmpty(formData: FormData, key: string) {
  const value = text(formData, key);
  if (!value) throw new Error(`${key} is required`);
  return value;
}

function optionalStock(formData: FormData) {
  const raw = text(formData, "stockCount");
  if (!raw) return null;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < 0) throw new Error("Stock must be a non-negative integer");
  return value;
}

function temporaryPassword() {
  return `Chotto-${randomBytes(5).toString("base64url")}-1`;
}

async function getAuthUserByEmail(email: string) {
  return db.query.user.findFirst({ where: eq(user.email, email) });
}

function branchRoleFromForm(formData: FormData): BranchShiftRole {
  const role = text(formData, "branchRole");
  if (!isBranchShiftRole(role)) throw new Error("Choose cashier or branch manager");
  return role;
}

function cleanPointDelta(formData: FormData) {
  const value = Number(nonEmpty(formData, "pointsDelta"));
  if (!Number.isInteger(value) || value === 0) throw new Error("Points must be a non-zero integer");
  return value;
}

function safeCashierNext(value: string) {
  if (
    (value !== "/cashier" && !value.startsWith("/cashier/")) ||
    value.startsWith("/cashier/login") ||
    value.startsWith("/cashier/logout") ||
    value.startsWith("/cashier/unlock")
  ) {
    return "/cashier/accounts";
  }
  return value;
}

export async function startCashierShift(formData: FormData) {
  const terminal = await requireCashierTerminalSession();
  const staffProfileId = nonEmpty(formData, "staffProfileId");
  const pin = nonEmpty(formData, "pin");

  const [profile, detail] = await Promise.all([
    db.query.staffProfiles.findFirst({
      where: and(eq(staffProfiles.id, staffProfileId), eq(staffProfiles.active, true))
    }),
    db.query.staffRoleDetails.findFirst({
      where: and(
        eq(staffRoleDetails.staffProfileId, staffProfileId),
        inArray(staffRoleDetails.role, ["cashier", "branch_manager"]),
        eq(staffRoleDetails.branchId, terminal.branch.id)
      )
    })
  ]);
  if (!profile || !detail?.branchId) redirect("/cashier/start?pin=invalid");

  if (!detail.pinHash || detail.pinHash !== hashDemoPin(pin)) {
    redirect("/cashier/start?pin=invalid");
  }

  await setCashierShiftCookie({
    staffProfileId: profile.id,
    branchId: terminal.branch.id,
    issuedAt: Date.now()
  });
  revalidatePath("/cashier");
  redirect("/cashier/identify");
}

export async function endCashierShift() {
  await clearCashierShiftCookie();
  redirect("/cashier/start");
}

export async function unlockCashierManagerMode(formData: FormData) {
  const terminal = await requireCashierTerminalSession();
  const password = nonEmpty(formData, "password");
  const next = safeCashierNext(text(formData, "next") || "/cashier/accounts");
  const credential = await db.query.account.findFirst({
    where: and(eq(account.userId, terminal.user.id), eq(account.providerId, "credential"))
  });

  const valid = credential?.password
    ? await verifyPassword({ hash: credential.password, password })
    : false;
  if (!valid) redirect(`/cashier/unlock?next=${encodeURIComponent(next)}&error=invalid`);

  await clearCashierShiftCookie();
  redirect(next);
}

export async function updateBranchRewardStock(formData: FormData) {
  const { branch } = await requireCashierManagerPageSession("/cashier/stock");
  const rewardId = nonEmpty(formData, "rewardId");
  const stockCount = optionalStock(formData);
  const active = text(formData, "active") === "true";
  await db
    .insert(rewardBranchAllocations)
    .values({
      rewardId,
      branchId: branch.id,
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
  revalidatePath("/cashier/stock");
  revalidatePath("/cashier/redeem");
  revalidatePath(`/manager/rewards/${rewardId}/edit`);
}

export async function createBranchStaffAccount(
  _: CreateAccountState,
  formData: FormData
): Promise<CreateAccountState> {
  const { branch } = await requireCashierManagerPageSession("/cashier/accounts/new");
  try {
    const name = nonEmpty(formData, "name");
    const email = nonEmpty(formData, "email").toLowerCase();
    const branchRole = branchRoleFromForm(formData);
    const pin = nonEmpty(formData, "pin");
    if (!isValidPin(pin)) throw new Error("PIN must be exactly 4 digits");

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
      await tx.insert(userRoles).values({ authUserId: authUser.id, role: branchRole }).onConflictDoNothing();
      await tx.insert(staffRoleDetails).values({
        staffProfileId,
        role: branchRole,
        branchId: branch.id,
        pinHash: hashDemoPin(pin)
      });
    });

    let invitationFailed = false;
    try {
      await sendSignInLink({ email, callbackURL: "/cashier", intent: "invite", role: branchRole });
    } catch {
      invitationFailed = true;
    }
    revalidatePath("/cashier/accounts");
    return { temporaryPassword: password, invitationSent: !invitationFailed, invitationFailed, email, name };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Could not create staff account" };
  }
}

export async function updateBranchStaffAccount(formData: FormData) {
  const { branch } = await requireCashierManagerPageSession("/cashier/accounts");
  const id = nonEmpty(formData, "id");
  const name = nonEmpty(formData, "name");
  const branchRole = branchRoleFromForm(formData);
  const pin = text(formData, "pin");
  if (pin && !isValidPin(pin)) throw new Error("PIN must be exactly 4 digits");

  await db.transaction(async (tx) => {
    const existingBranchDetail = await tx.query.staffRoleDetails.findFirst({
      where: and(
        eq(staffRoleDetails.staffProfileId, id),
        inArray(staffRoleDetails.role, ["cashier", "branch_manager"]),
        eq(staffRoleDetails.branchId, branch.id)
      )
    });
    if (!existingBranchDetail) throw new Error("Staff account is not assigned to this branch");
    if (!pin && !existingBranchDetail.pinHash) throw new Error("PIN is required for branch accounts");

    const [profile] = await tx
      .update(staffProfiles)
      .set({ name, updatedAt: new Date() })
      .where(eq(staffProfiles.id, id))
      .returning({ authUserId: staffProfiles.authUserId });
    if (!profile) throw new Error("Staff profile not found");

    const oppositeBranchRole = branchRole === "cashier" ? "branch_manager" : "cashier";
    await tx
      .delete(staffRoleDetails)
      .where(and(eq(staffRoleDetails.staffProfileId, id), eq(staffRoleDetails.role, oppositeBranchRole)));
    await tx
      .delete(userRoles)
      .where(and(eq(userRoles.authUserId, profile.authUserId), eq(userRoles.role, oppositeBranchRole)));

    await tx.update(user).set({ name, updatedAt: new Date() }).where(eq(user.id, profile.authUserId));
    await tx.insert(userRoles).values({ authUserId: profile.authUserId, role: branchRole }).onConflictDoNothing();
    await tx
      .insert(staffRoleDetails)
      .values({
        staffProfileId: id,
        role: branchRole,
        branchId: branch.id,
        pinHash: pin ? hashDemoPin(pin) : existingBranchDetail.pinHash
      })
      .onConflictDoUpdate({
        target: [staffRoleDetails.staffProfileId, staffRoleDetails.role],
        set: {
          branchId: branch.id,
          pinHash: pin ? hashDemoPin(pin) : existingBranchDetail.pinHash,
          updatedAt: new Date()
        }
      });
  });

  revalidatePath("/cashier/accounts");
  redirect(`/cashier/accounts?changed=${id}&toast=staff-updated`);
}

export async function setBranchStaffActive(formData: FormData) {
  const { branch } = await requireCashierManagerPageSession("/cashier/accounts");
  const id = nonEmpty(formData, "id");
  const active = text(formData, "active") === "true";
  const detail = await db.query.staffRoleDetails.findFirst({
    where: and(
      eq(staffRoleDetails.staffProfileId, id),
      inArray(staffRoleDetails.role, ["cashier", "branch_manager"]),
      eq(staffRoleDetails.branchId, branch.id)
    )
  });
  if (!detail) throw new Error("Staff account is not assigned to this branch");
  await db.update(staffProfiles).set({ active, updatedAt: new Date() }).where(eq(staffProfiles.id, id));
  revalidatePath("/cashier/accounts");
  revalidatePath(`/cashier/accounts/${id}/edit`);
}

export async function createBranchCustomerAccount(
  _: CreateAccountState,
  formData: FormData
): Promise<CreateAccountState> {
  await requireCashierManagerPageSession("/cashier/ledger/new");
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
    revalidatePath("/cashier/ledger");
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

export async function updateBranchCustomer(formData: FormData) {
  await requireCashierManagerPageSession("/cashier/ledger");
  const id = nonEmpty(formData, "id");
  const name = nonEmpty(formData, "name");
  const phone = nonEmpty(formData, "phone");

  await db.transaction(async (tx) => {
    const [customer] = await tx
      .update(customers)
      .set({ name, phone, updatedAt: new Date() })
      .where(eq(customers.id, id))
      .returning({ authUserId: customers.authUserId, email: customers.email });
    if (!customer) throw new Error("Customer not found");
    await tx.update(user).set({ name, updatedAt: new Date() }).where(eq(user.id, customer.authUserId));
  });

  revalidatePath("/cashier/ledger");
  redirect(`/cashier/ledger?changed=${id}&toast=customer-updated`);
}

export async function setBranchCustomerActive(formData: FormData) {
  await requireCashierManagerPageSession("/cashier/ledger");
  const id = nonEmpty(formData, "id");
  const active = text(formData, "active") === "true";
  await db.update(customers).set({ active, updatedAt: new Date() }).where(eq(customers.id, id));
  revalidatePath("/cashier/ledger");
  revalidatePath(`/cashier/ledger/${id}/edit`);
}

export async function adjustBranchCustomerPoints(formData: FormData) {
  const { profile, branch } = await requireCashierManagerPageSession("/cashier/ledger");
  const customerId = nonEmpty(formData, "id");
  const pointsDelta = cleanPointDelta(formData);
  const reason = nonEmpty(formData, "reason");

  await db.transaction(async (tx) => {
    const managerRole = await tx.query.staffRoleDetails.findFirst({
      where: and(
        eq(staffRoleDetails.staffProfileId, profile.id),
        eq(staffRoleDetails.role, "branch_manager"),
        eq(staffRoleDetails.branchId, branch.id)
      )
    });
    if (!managerRole) throw new Error("Branch manager profile is missing");

    const [updatedCustomer] = await tx
      .update(customers)
      .set({
        pointsBalance: sql`${customers.pointsBalance} + ${pointsDelta}`,
        updatedAt: new Date()
      })
      .where(
        and(
          eq(customers.id, customerId),
          eq(customers.active, true),
          sql`${customers.pointsBalance} + ${pointsDelta} >= 0`
        )
      )
      .returning();
    if (!updatedCustomer) throw new Error("Customer is missing or adjustment would make balance negative");

    await tx.insert(transactions).values({
      id: randomUUID(),
      customerId,
      staffProfileId: profile.id,
      branchId: branch.id,
      type: "manual",
      pointsDelta,
      reason
    });
  });

  revalidatePath("/cashier/ledger");
  revalidatePath(`/cashier/ledger/${customerId}/edit`);
}

export async function awardCustomerPoints(formData: FormData) {
  const { profile, branch } = await requireCashierShiftSession();
  const customerId = nonEmpty(formData, "customerId");
  const billTotal = Number(nonEmpty(formData, "billTotal"));
  if (!Number.isFinite(billTotal) || billTotal <= 0) redirect(`/cashier/award?customerId=${customerId}&bill=invalid`);
  const billTotalCents = Math.round(billTotal * 100);
  await awardPoints({ customerId, staffProfileId: profile.id, branchId: branch.id, billTotalCents });
  revalidatePath(`/cashier/customer/${customerId}`);
  redirect(`/cashier/customer/${customerId}?toast=points-awarded`);
}

export async function redeemCustomerReward(formData: FormData) {
  const { profile, branch } = await requireCashierShiftSession();
  const customerId = nonEmpty(formData, "customerId");
  await redeemReward({
    customerId,
    staffProfileId: profile.id,
    branchId: branch.id,
    rewardId: nonEmpty(formData, "rewardId")
  });
  revalidatePath(`/cashier/customer/${customerId}`);
  redirect(`/cashier/customer/${customerId}?toast=reward-redeemed`);
}
