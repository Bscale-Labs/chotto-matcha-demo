import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const CASHIER_MANAGER_UNLOCK_COOKIE = "cashier_manager_unlock";
const UNLOCK_TTL_SECONDS = 60 * 10;

export type CashierManagerUnlock = {
  staffProfileId: string;
  branchId: string;
  issuedAt: number;
};

function secret() {
  return process.env.BETTER_AUTH_SECRET ?? "chotto-demo-manager-unlock-secret";
}

function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("base64url");
}

function encodeUnlock(unlock: CashierManagerUnlock) {
  const payload = Buffer.from(JSON.stringify(unlock), "utf8").toString("base64url");
  return `${payload}.${sign(payload)}`;
}

function decodeUnlock(value: string): CashierManagerUnlock | null {
  const [payload, signature] = value.split(".");
  if (!payload || !signature) return null;

  const expected = sign(payload);
  const expectedBuffer = Buffer.from(expected);
  const signatureBuffer = Buffer.from(signature);
  if (
    expectedBuffer.length !== signatureBuffer.length ||
    !timingSafeEqual(expectedBuffer, signatureBuffer)
  ) {
    return null;
  }

  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as Partial<CashierManagerUnlock>;
    if (
      typeof parsed.staffProfileId !== "string" ||
      typeof parsed.branchId !== "string" ||
      typeof parsed.issuedAt !== "number"
    ) {
      return null;
    }
    if (Date.now() - parsed.issuedAt > UNLOCK_TTL_SECONDS * 1000) return null;
    return parsed as CashierManagerUnlock;
  } catch {
    return null;
  }
}

export async function getCashierManagerUnlockCookie() {
  const cookieStore = await cookies();
  const value = cookieStore.get(CASHIER_MANAGER_UNLOCK_COOKIE)?.value;
  return value ? decodeUnlock(value) : null;
}

export async function setCashierManagerUnlockCookie(unlock: CashierManagerUnlock) {
  const cookieStore = await cookies();
  cookieStore.set(CASHIER_MANAGER_UNLOCK_COOKIE, encodeUnlock(unlock), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/cashier",
    maxAge: UNLOCK_TTL_SECONDS
  });
}

export async function clearCashierManagerUnlockCookie() {
  const cookieStore = await cookies();
  cookieStore.set(CASHIER_MANAGER_UNLOCK_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/cashier",
    maxAge: 0
  });
}
