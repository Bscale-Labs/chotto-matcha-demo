import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { auth } from "@/lib/auth/server";
import { db } from "@/db/client";
import { staffProfiles, userRoles } from "@/db/schema";

export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

export async function requireManagerSession() {
  const session = await getSession();
  if (!session) redirect("/manager/login");

  const role = await db.query.userRoles.findFirst({
    where: and(
      eq(userRoles.authUserId, session.user.id),
      eq(userRoles.role, "manager")
    )
  });
  if (!role) redirect("/manager/access-denied");

  const profile = await db.query.staffProfiles.findFirst({
    where: and(
      eq(staffProfiles.authUserId, session.user.id),
      eq(staffProfiles.active, true)
    )
  });
  if (!profile) redirect("/manager/access-denied");

  return { user: session.user, profile };
}
