import { ArrowRight } from "lucide-react";
import { Button } from "@/components/shared/button";
import { CashierShell } from "@/components/cashier/cashier-shell";
import { Eyebrow } from "@/components/shared/eyebrow";
import { getCashierShiftCookie } from "@/lib/auth/shift";
import { getBranchById } from "@/lib/data/branches";
import { getStaffProfileById, listActiveCashiersWithBranches } from "@/lib/data/staff";
import { Brand } from "@/components/shared/brand";
import { StartShiftForm } from "@/components/cashier/start-shift-form";

export default async function CashierPage({
  searchParams
}: {
  searchParams: Promise<{ pin?: string }>;
}) {
  const [shift, params, cashiers] = await Promise.all([
    getCashierShiftCookie(),
    searchParams,
    listActiveCashiersWithBranches()
  ]);
  const [activeProfile, activeBranch] = shift
    ? await Promise.all([getStaffProfileById(shift.staffProfileId), getBranchById(shift.branchId)])
    : [null, null];
  const activeShift = Boolean(activeProfile?.active && activeBranch?.active);

  if (!activeShift) {
    return (
      <main className="min-h-screen bg-stone py-6">
        <div className="mx-auto flex max-w-3xl flex-col gap-6 px-5">
          <header className="flex items-center justify-between gap-3">
            <Brand href="/" size="sm" />
            <span className="rounded-pill border border-line-soft bg-cream px-3 py-1.5 text-sm text-ink-muted shadow-sm">
              Cashier device
            </span>
          </header>

          <section className="rounded-lg border border-line-soft bg-cream p-7 shadow-sm">
            <Eyebrow className="text-matcha-deep">Start shift</Eyebrow>
            <h1 className="mt-3 font-display text-[36px] font-medium leading-[42px] text-charcoal">
              Choose your cashier account.
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-ink-muted">
              This selector belongs to the cashier station. Pick your name and enter your PIN to unlock member lookup.
            </p>

            <StartShiftForm cashiers={cashiers} showPinError={params.pin === "invalid"} />
          </section>
        </div>
      </main>
    );
  }

  if (!activeProfile || !activeBranch) {
    throw new Error("Active cashier shift is missing profile or branch data");
  }

  return (
    <CashierShell sessionLabel={`${activeBranch.name} · ${activeProfile.name}`}>
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <section className="rounded-lg border border-line-soft bg-cream p-7 shadow-sm">
          <Eyebrow className="text-matcha-deep">Branch device</Eyebrow>
          <h1 className="mt-3 font-display text-[36px] font-medium leading-[42px] text-charcoal">
            {activeBranch.name}
          </h1>
          <p className="mt-2 text-sm leading-6 text-ink-muted">{activeBranch.address}</p>

          <div className="mt-7 rounded-md border border-line-soft bg-stone/35 p-5">
            <p className="eyebrow text-ink-muted">Signed in as</p>
            <p className="mt-2 text-lg font-medium text-charcoal">{activeProfile.name}</p>
            <p className="mt-1 text-sm text-ink-muted">End shift to return to the account selector.</p>
          </div>
        </section>
        <aside className="rounded-lg border border-line-soft bg-cream p-7 shadow-sm">
          <Eyebrow className="text-matcha-deep">Active session</Eyebrow>
          <h2 className="mt-3 font-display text-[22px] font-medium leading-[28px] text-charcoal">
            {activeProfile.name} is on the bar
          </h2>
          <p className="mt-2 text-sm leading-6 text-ink-muted">
            Identify a member, then award points or redeem a reward.
          </p>
          <Button href="/cashier/identify" icon={ArrowRight} iconPosition="trailing" className="mt-6 w-full">
            Identify member
          </Button>
        </aside>
      </div>
    </CashierShell>
  );
}
