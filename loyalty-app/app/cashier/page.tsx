import { ArrowRight, KeyRound } from "lucide-react";
import { Button } from "@/components/shared/button";
import { CashierShell } from "@/components/cashier/cashier-shell";
import { Eyebrow } from "@/components/shared/eyebrow";
import { startCashierShift } from "@/app/cashier/actions";
import { getCashierShiftCookie } from "@/lib/auth/shift";
import { requireCashierSession } from "@/lib/auth/session";
import { getBranchById } from "@/lib/data/branches";

export default async function CashierPage({
  searchParams
}: {
  searchParams: Promise<{ pin?: string }>;
}) {
  const [{ profile, roleDetail }, shift, params] = await Promise.all([
    requireCashierSession(),
    getCashierShiftCookie(),
    searchParams
  ]);
  const branch = roleDetail.branchId ? await getBranchById(roleDetail.branchId) : null;
  const activeShift = shift?.staffProfileId === profile.id && shift.branchId === roleDetail.branchId;

  return (
    <CashierShell sessionLabel={branch ? `${branch.name} · ${profile.name}` : profile.name}>
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <section className="rounded-lg border border-line-soft bg-cream p-7 shadow-sm">
          <Eyebrow className="text-matcha-deep">Branch device</Eyebrow>
          <h1 className="mt-3 font-display text-[36px] font-medium leading-[42px] text-charcoal">
            {branch?.name ?? "No branch assigned"}
          </h1>
          <p className="mt-2 text-sm leading-6 text-ink-muted">{branch?.address ?? "Ask a manager to assign a branch."}</p>

          <form action={startCashierShift} className="mt-7 grid max-w-sm gap-3">
            <label className="grid gap-2 text-sm font-medium text-charcoal">
              Shift PIN
              <input
                name="pin"
                type="password"
                inputMode="numeric"
                className="h-12 rounded-md border border-line bg-cream px-4 text-base focus:border-matcha-deep focus:outline-none focus:shadow-focus"
                placeholder="••••"
              />
            </label>
            {params.pin === "invalid" ? <p className="text-sm text-error-text">Invalid PIN.</p> : null}
            <Button type="submit" icon={KeyRound} disabled={!branch}>Start shift</Button>
          </form>
        </section>
        <aside className="rounded-lg border border-line-soft bg-cream p-7 shadow-sm">
          <Eyebrow className="text-matcha-deep">Active session</Eyebrow>
          <h2 className="mt-3 font-display text-[22px] font-medium leading-[28px] text-charcoal">
            {activeShift ? `${profile.name} is on the bar` : "No active shift"}
          </h2>
          <p className="mt-2 text-sm leading-6 text-ink-muted">
            {activeShift
              ? "Identify a member, then award points or redeem a reward."
              : "Enter your assigned PIN to unlock cashier actions."}
          </p>
          {activeShift ? (
            <Button href="/cashier/identify" icon={ArrowRight} iconPosition="trailing" className="mt-6 w-full">
              Identify member
            </Button>
          ) : null}
        </aside>
      </div>
    </CashierShell>
  );
}
