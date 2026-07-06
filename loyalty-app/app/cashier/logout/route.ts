import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { clearCashierShiftCookie } from "@/lib/auth/shift";

export async function POST(request: Request) {
  await clearCashierShiftCookie();
  await auth.api.signOut({ headers: await headers() });
  return NextResponse.redirect(new URL("/cashier", request.url), { status: 303 });
}
