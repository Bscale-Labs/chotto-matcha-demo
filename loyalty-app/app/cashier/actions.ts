"use server";

import { verifyPassword } from "better-auth/crypto";
import { and, eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db/client";
import { account, rewardBranchAllocations, staffProfiles, staffRoleDetails } from "@/db/schema";
import {
  clearCashierManagerUnlockCookie,
  setCashierManagerUnlockCookie
} from "@/lib/auth/cashier-manager";
import { hashDemoPin } from "@/lib/auth/pin";
import { clearCashierShiftCookie, setCashierShiftCookie } from "@/lib/auth/shift";
import {
  requireCashierManagerSession,
  requireCashierShiftSession,
  requireCashierTerminalSession
} from "@/lib/auth/session";
import { awardPoints, redeemReward } from "@/lib/data/transactions";

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

function safeCashierNext(value: string) {
  if (
    (value !== "/cashier" && !value.startsWith("/cashier/")) ||
    value.startsWith("/cashier/login") ||
    value.startsWith("/cashier/logout") ||
    value.startsWith("/cashier/unlock")
  ) {
    return "/cashier/stock";
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
  const next = safeCashierNext(text(formData, "next") || "/cashier/stock");
  const credential = await db.query.account.findFirst({
    where: and(eq(account.userId, terminal.user.id), eq(account.providerId, "credential"))
  });

  const valid = credential?.password
    ? await verifyPassword({ hash: credential.password, password })
    : false;
  if (!valid) redirect(`/cashier/unlock?next=${encodeURIComponent(next)}&error=invalid`);

  await setCashierManagerUnlockCookie({
    staffProfileId: terminal.profile.id,
    branchId: terminal.branch.id,
    issuedAt: Date.now()
  });
  redirect(next);
}

export async function lockCashierManagerMode() {
  await clearCashierManagerUnlockCookie();
  redirect("/cashier");
}

export async function updateBranchRewardStock(formData: FormData) {
  const { branch } = await requireCashierManagerSession("/cashier/stock");
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
