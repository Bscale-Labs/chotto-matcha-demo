import { ArrowLeft, ArrowRight, Clock3, LogOut, ScanLine, ShieldCheck, UserRoundCheck } from "lucide-react";
import { Button } from "@/components/shared/button";
import { CashierShell } from "@/components/cashier/cashier-shell";
import { Eyebrow } from "@/components/shared/eyebrow";
import { getCashierShiftCookie } from "@/lib/auth/shift";
import { listCashiersForBranch } from "@/lib/data/staff";
import { Brand } from "@/components/shared/brand";
import { StartShiftForm } from "@/components/cashier/start-shift-form";
import { endCashierShift } from "@/app/cashier/actions";
import { CustomerAvatar, StartShiftStillLife, StorefrontSketch } from "@/components/cashier/cashier-visuals";
import { requireCashierShiftSession, requireCashierTerminalSession } from "@/lib/auth/session";
import { staffRoleLabel } from "@/lib/roles/staff";

export default async function CashierStartPage({
  searchParams
}: {
  searchParams: Promise<{ pin?: string }>;
}) {
  const [terminal, shift, params] = await Promise.all([
    requireCashierTerminalSession(),
    getCashierShiftCookie(),
    searchParams
  ]);
  const activeSession = shift ? await requireCashierShiftSession() : null;

  if (!activeSession) {
    const cashiers = await listCashiersForBranch(terminal.branch.id);
    return (
      <main className="cashier-surface min-h-screen py-5">
        <div className="mx-auto flex max-w-5xl flex-col gap-5 px-4">
          <header className="grid items-center gap-3 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
            <div className="flex min-w-0 items-center gap-2.5">
              <Brand href="/cashier" size="sm" className="shrink-0" />
              <span className="shrink-0 text-sm text-ink-faint" aria-hidden="true">
                |
              </span>
              <span className="truncate text-sm font-medium text-charcoal">{terminal.branch.name}</span>
            </div>
            <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-eyebrow text-matcha-deep md:justify-self-center">
              <Clock3 className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
              Cashier mode
            </span>
            <div className="flex flex-wrap gap-2 md:justify-self-end">
              <Button href="/cashier/unlock?next=%2Fcashier" variant="secondary" icon={ArrowLeft} className="!min-h-10 !px-3 !py-2 text-sm">
                Back to manager
              </Button>
              <form action="/cashier/logout" method="post">
                <Button type="submit" variant="secondary" icon={LogOut} className="!min-h-10 !px-3 !py-2 text-sm">
                  Sign out terminal
                </Button>
              </form>
            </div>
          </header>

          <section className="cashier-panel overflow-hidden rounded-lg">
            <div className="grid lg:grid-cols-[300px_1fr]">
              <aside className="relative hidden min-h-[520px] overflow-hidden border-r border-line-soft bg-cream lg:block">
                <StartShiftStillLife className="absolute inset-0 h-full w-full object-[50%_50%]" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(250,247,242,0.08),rgba(24,56,31,0.12))]" />
                <div
                  className="surface-glass absolute bottom-7 left-7 right-7 flex items-center gap-2 rounded-md p-3 text-xs text-ink-muted"
                  style={{ position: "absolute" }}
                >
                  <ShieldCheck className="h-4 w-4 text-matcha-deep" strokeWidth={1.75} aria-hidden="true" />
                  Secure device. Shift activity is protected.
                </div>
              </aside>
              <div className="p-6 sm:p-8">
                <Eyebrow className="text-matcha-deep">Start shift</Eyebrow>
                <h1 className="mt-3 font-display text-[40px] font-medium leading-[44px] text-charcoal">
                  {terminal.branch.name}
                </h1>
                <p className="mt-2 max-w-xl text-sm leading-6 text-ink-muted">
                  Select assigned staff and enter a PIN to start serving.
                </p>

                <StartShiftForm cashiers={cashiers} showPinError={params.pin === "invalid"} />
              </div>
            </div>
          </section>
        </div>
      </main>
    );
  }

  const activeProfile = activeSession.profile;
  const activeBranch = activeSession.branch;
  const activeRole = activeSession.roleDetail.role;

  return (
    <CashierShell sessionLabel={`${activeBranch.name} · ${activeProfile.name}`}>
      <div className="grid items-start gap-4 lg:grid-cols-[0.74fr_1.26fr]">
        <section className="cashier-panel rounded-lg p-6">
          <Eyebrow className="text-matcha-deep">Your shift</Eyebrow>
          <div className="mt-5 flex items-start gap-4">
            <CustomerAvatar name={activeProfile.name} className="h-16 w-16 text-lg" />
            <div className="min-w-0">
              <h1 className="font-display text-[34px] font-medium leading-[38px] text-charcoal">
                {activeProfile.name}
              </h1>
              <p className="mt-1 text-sm text-ink-muted">{staffRoleLabel(activeRole)} · Started today</p>
              <span className="mt-3 inline-flex rounded-pill bg-sage-wash px-3 py-1 text-xs font-medium text-matcha-deep">
                Active
              </span>
            </div>
          </div>
          <p className="mt-6 max-w-sm text-sm leading-6 text-ink-muted">
            End shift when taking a break or at end of day.
          </p>
          <form action={endCashierShift} className="mt-5">
            <Button type="submit" variant="secondary" icon={LogOut} className="w-full px-5">
              End shift
            </Button>
          </form>
        </section>

        <section className="cashier-panel rounded-lg p-6">
          <div className="grid gap-5 md:grid-cols-[1fr_300px] md:items-stretch">
            <div>
              <Eyebrow className="text-matcha-deep">Branch device</Eyebrow>
              <h2 className="font-display text-[34px] font-medium leading-[38px] text-charcoal">
                {activeBranch.name}
              </h2>
              <p className="mt-2 text-sm leading-6 text-ink-muted">{activeBranch.address}</p>
              <div className="mt-5 grid gap-3 text-sm text-ink-muted sm:grid-cols-2">
                <div className="surface-paper rounded-md p-4">
                  <Clock3 className="mb-3 h-4 w-4 text-matcha-deep" strokeWidth={1.75} aria-hidden="true" />
                  Shift-ready tablet
                </div>
                <div className="surface-paper rounded-md p-4">
                  <UserRoundCheck className="mb-3 h-4 w-4 text-matcha-deep" strokeWidth={1.75} aria-hidden="true" />
                  Member lookup enabled
                </div>
              </div>
            </div>
            <StorefrontSketch className="h-full min-h-[190px] w-full rounded-md border border-line-soft shadow-sm" />
          </div>
        </section>
      </div>

      <section className="cashier-panel mt-4 rounded-lg p-6">
        <Eyebrow className="text-matcha-deep">Quick actions</Eyebrow>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <Button
            href="/cashier/identify"
            icon={ScanLine}
            iconPosition="leading"
            className="min-h-[76px] justify-start rounded-md px-5"
          >
            Identify member
          </Button>
          <Button
            href="/cashier/identify"
            variant="secondary"
            icon={ArrowRight}
            iconPosition="trailing"
            className="min-h-[76px] justify-between rounded-md px-5"
          >
            Open lookup
          </Button>
        </div>
      </section>
    </CashierShell>
  );
}
