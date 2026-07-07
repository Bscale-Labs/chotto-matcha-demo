import { redirect } from "next/navigation";
import { ArrowLeft, Clock3 } from "lucide-react";
import { Button } from "@/components/shared/button";
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
    <main className="cashier-surface min-h-screen py-5 lg:flex lg:items-center lg:py-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-5 px-4">
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
            <Button href="/cashier/unlock?next=%2Fcashier%2Fledger" variant="secondary" icon={ArrowLeft} className="!min-h-10 !px-3 !py-2 text-sm">
              Back to manager
            </Button>
          </div>
        </header>

        <section className="cashier-panel overflow-hidden rounded-lg">
          <div className="grid lg:grid-cols-[300px_1fr]">
            <aside className="relative hidden overflow-hidden border-r border-line-soft bg-cream lg:block lg:min-h-[clamp(560px,72vh,660px)]">
              <StartShiftStillLife className="absolute inset-0 h-full w-full object-[50%_50%]" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(250,247,242,0.08),rgba(24,56,31,0.12))]" />
            </aside>
            <StartShiftForm branchName={terminal.branch.name} cashiers={cashiers} showPinError={params.pin === "invalid"} />
          </div>
        </section>
      </div>
    </main>
  );
}
