import { redirect } from "next/navigation";
import { ArrowLeft, Clock3 } from "lucide-react";
import { Button } from "@/components/shared/button";
import { Eyebrow } from "@/components/shared/eyebrow";
import { getCashierShiftCookie } from "@/lib/auth/shift";
import { listCashiersForBranch } from "@/lib/data/staff";
import { Brand } from "@/components/shared/brand";
import { StartShiftForm } from "@/components/cashier/start-shift-form";
import { StartShiftStillLife } from "@/components/cashier/cashier-visuals";
import { requireCashierShiftSession, requireCashierTerminalSession } from "@/lib/auth/session";

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

  if (activeSession) redirect("/cashier/identify");

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
            <Button href="/cashier/unlock?next=%2Fcashier%2Faccounts" variant="secondary" icon={ArrowLeft} className="!min-h-10 !px-3 !py-2 text-sm">
              Back to manager
            </Button>
          </div>
        </header>

        <section className="cashier-panel overflow-hidden rounded-lg">
          <div className="grid lg:grid-cols-[300px_1fr]">
            <aside className="relative hidden min-h-[520px] overflow-hidden border-r border-line-soft bg-cream lg:block">
              <StartShiftStillLife className="absolute inset-0 h-full w-full object-[50%_50%]" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(250,247,242,0.08),rgba(24,56,31,0.12))]" />
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
