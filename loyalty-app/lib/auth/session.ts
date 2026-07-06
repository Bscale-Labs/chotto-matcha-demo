import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { and, eq, inArray } from "drizzle-orm";
import { auth } from "@/lib/auth/server";
import { db } from "@/db/client";
import { branches, customers, staffProfiles, staffRoleDetails, userRoles } from "@/db/schema";
import { getCashierManagerUnlockCookie } from "@/lib/auth/cashier-manager";
import { clearCashierShiftCookie, getCashierShiftCookie } from "@/lib/auth/shift";
import type { Role } from "@/lib/types";

export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

async function requireAuthenticatedSession(loginPath: string) {
  const session = await getSession();
  if (!session) redirect(loginPath);
  return session;
}

function getUserRole(authUserId: string, role: Role) {
  return db.query.userRoles.findFirst({
    where: and(eq(userRoles.authUserId, authUserId), eq(userRoles.role, role))
  });
}

export async function requireManagerSession() {
  const session = await requireAuthenticatedSession("/manager/login");

  const [userRole, profile] = await Promise.all([
    getUserRole(session.user.id, "manager"),
    db.query.staffProfiles.findFirst({
      where: and(eq(staffProfiles.authUserId, session.user.id), eq(staffProfiles.active, true))
    })
  ]);
  if (!userRole) redirect("/manager/access-denied");
  if (!profile) redirect("/manager/access-denied");

  const roleDetail = await db.query.staffRoleDetails.findFirst({
    where: and(eq(staffRoleDetails.staffProfileId, profile.id), eq(staffRoleDetails.role, "manager"))
  });
  if (!roleDetail) redirect("/manager/access-denied");

  return { user: session.user, profile, roleDetail };
}

export async function requireCustomerSession() {
  const session = await requireAuthenticatedSession("/customer/login");

  const [userRole, customer] = await Promise.all([
    getUserRole(session.user.id, "customer"),
    db.query.customers.findFirst({
      where: and(eq(customers.authUserId, session.user.id), eq(customers.active, true))
    })
  ]);
  if (!userRole) redirect("/customer/access-denied");
  if (!customer) redirect("/customer/access-denied");

  return { user: session.user, customer };
}

function unlockRedirect(nextPath: string) {
  redirect(`/cashier/unlock?next=${encodeURIComponent(nextPath)}`);
}

export async function requireCashierTerminalSession() {
  const session = await requireAuthenticatedSession("/cashier/login");

  const [userRole, profile] = await Promise.all([
    db.query.userRoles.findFirst({
      where: and(eq(userRoles.authUserId, session.user.id), eq(userRoles.role, "branch_manager"))
    }),
    db.query.staffProfiles.findFirst({
      where: and(eq(staffProfiles.authUserId, session.user.id), eq(staffProfiles.active, true))
    })
  ]);
  if (!userRole) redirect("/cashier/access-denied");
  if (!profile) redirect("/cashier/access-denied");

  const roleDetail = await db.query.staffRoleDetails.findFirst({
    where: and(
      eq(staffRoleDetails.staffProfileId, profile.id),
      eq(staffRoleDetails.role, "branch_manager")
    )
  });
  if (!roleDetail?.branchId) redirect("/cashier/access-denied");

  const branch = await db.query.branches.findFirst({
    where: and(eq(branches.id, roleDetail.branchId), eq(branches.active, true))
  });
  if (!branch) redirect("/cashier/access-denied");

  return { user: session.user, profile, roleDetail, branch };
}

export async function requireCashierShiftSession() {
  const terminal = await requireCashierTerminalSession();
  const shift = await getCashierShiftCookie();
  if (!shift) redirect("/cashier");
  if (shift.branchId !== terminal.branch.id) {
    await clearCashierShiftCookie();
    redirect("/cashier");
  }

  const [profile, roleDetail] = await Promise.all([
    db.query.staffProfiles.findFirst({
      where: and(eq(staffProfiles.id, shift.staffProfileId), eq(staffProfiles.active, true))
    }),
    db.query.staffRoleDetails.findFirst({
      where: and(
        eq(staffRoleDetails.staffProfileId, shift.staffProfileId),
        inArray(staffRoleDetails.role, ["cashier", "branch_manager"]),
        eq(staffRoleDetails.branchId, shift.branchId)
      )
    })
  ]);
  if (!profile) redirect("/cashier/access-denied");
  if (!roleDetail) {
    redirect("/cashier/access-denied");
  }

  return { user: terminal.user, terminalProfile: terminal.profile, profile, roleDetail, shift, branch: terminal.branch };
}

export async function requireCashierManagerSession(nextPath = "/cashier/stock") {
  const terminal = await requireCashierTerminalSession();
  const unlock = await getCashierManagerUnlockCookie();
  if (
    !unlock ||
    unlock.staffProfileId !== terminal.profile.id ||
    unlock.branchId !== terminal.branch.id
  ) {
    unlockRedirect(nextPath);
  }

  return terminal;
}
