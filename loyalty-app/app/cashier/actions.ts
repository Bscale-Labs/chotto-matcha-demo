"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db/client";
import { branches, staffProfiles, staffRoleDetails } from "@/db/schema";
import { hashDemoPin } from "@/lib/auth/pin";
import { clearCashierShiftCookie, setCashierShiftCookie } from "@/lib/auth/shift";
import { requireCashierShiftSession } from "@/lib/auth/session";
import { awardPoints, redeemReward } from "@/lib/data/transactions";

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function nonEmpty(formData: FormData, key: string) {
  const value = text(formData, key);
  if (!value) throw new Error(`${key} is required`);
  return value;
}

export async function startCashierShift(formData: FormData) {
  const staffProfileId = nonEmpty(formData, "staffProfileId");
  const pin = nonEmpty(formData, "pin");

  const [profile, detail] = await Promise.all([
    db.query.staffProfiles.findFirst({
      where: and(eq(staffProfiles.id, staffProfileId), eq(staffProfiles.active, true))
    }),
    db.query.staffRoleDetails.findFirst({
      where: and(
        eq(staffRoleDetails.staffProfileId, staffProfileId),
        eq(staffRoleDetails.role, "cashier")
      )
    })
  ]);
  if (!profile || !detail?.branchId) redirect("/cashier?pin=invalid");

  const branch = await db.query.branches.findFirst({
    where: and(
      eq(branches.id, detail.branchId),
      eq(branches.active, true)
    )
  });
  if (!detail?.pinHash || detail.pinHash !== hashDemoPin(pin) || !branch) {
    redirect("/cashier?pin=invalid");
  }

  await setCashierShiftCookie({
    staffProfileId: profile.id,
    branchId: detail.branchId,
    issuedAt: Date.now()
  });
  revalidatePath("/cashier");
  redirect("/cashier/identify");
}

export async function endCashierShift() {
  await clearCashierShiftCookie();
  redirect("/cashier");
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
