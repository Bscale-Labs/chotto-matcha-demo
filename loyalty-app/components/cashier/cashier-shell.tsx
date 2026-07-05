import { Clock3, LogOut, ShieldCheck, Sparkles } from "lucide-react";
import { Brand } from "@/components/shared/brand";
import { Button } from "@/components/shared/button";
import { CashierNav } from "@/components/cashier/cashier-nav";
import { endCashierShift } from "@/app/cashier/actions";

export function CashierShell({
  children,
  sessionLabel = "Shift setup"
}: {
  children: React.ReactNode;
  sessionLabel?: string;
}) {
  return (
    <main className="cashier-surface min-h-screen py-4">
      <div className="mx-auto max-w-[1180px] px-4">
        <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <Brand href="/cashier" size="sm" />
          <div className="flex flex-wrap items-center justify-end gap-2">
            <span className="surface-glass inline-flex min-h-tap items-center gap-2 rounded-pill px-3.5 text-sm font-medium text-charcoal">
              <Sparkles className="h-3.5 w-3.5 text-matcha-deep" strokeWidth={1.75} aria-hidden="true" />
              {sessionLabel}
            </span>
            <span className="surface-glass hidden min-h-tap items-center gap-2 rounded-pill px-3.5 text-sm text-ink-muted sm:inline-flex">
              <Clock3 className="h-3.5 w-3.5 text-matcha-deep" strokeWidth={1.75} aria-hidden="true" />
              Cashier tablet
            </span>
            <form action={endCashierShift}>
              <Button type="submit" variant="secondary" icon={LogOut} className="px-4">
                End shift
              </Button>
            </form>
            <form action="/cashier/logout" method="post">
              <Button type="submit" variant="secondary" icon={ShieldCheck} className="px-4">
                Reset device
              </Button>
            </form>
          </div>
        </header>
        <div className="grid gap-4 lg:grid-cols-[116px_1fr]">
          <aside className="cashier-rail rounded-lg p-3 lg:sticky lg:top-4 lg:h-[calc(100vh-6.5rem)] lg:min-h-[620px]">
            <CashierNav />
          </aside>
          <section className="min-w-0">{children}</section>
        </div>
      </div>
    </main>
  );
}
