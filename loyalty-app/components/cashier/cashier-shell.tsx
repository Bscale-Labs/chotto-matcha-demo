import { LogOut, Sparkles } from "lucide-react";
import { Brand } from "@/components/shared/brand";
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
    <main className="min-h-screen bg-stone py-6">
      <div className="mx-auto max-w-6xl px-5">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Brand href="/cashier" size="sm" />
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-pill border border-line-soft bg-cream px-3 py-1.5 text-sm text-charcoal shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-matcha-deep" strokeWidth={1.75} aria-hidden="true" />
              {sessionLabel}
            </span>
            <form action={endCashierShift}>
              <button className="inline-flex min-h-tap items-center gap-2 rounded-pill border border-line bg-cream px-4 text-sm font-medium text-charcoal transition-colors duration-fast ease-out-soft hover:border-matcha-deep hover:text-matcha-deep">
                <LogOut className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                End shift
              </button>
            </form>
            <form action="/cashier/logout" method="post">
              <button className="inline-flex min-h-tap items-center rounded-pill border border-line bg-cream px-4 text-sm font-medium text-charcoal transition-colors duration-fast ease-out-soft hover:border-matcha-deep hover:text-matcha-deep">
                Sign out
              </button>
            </form>
          </div>
        </header>
        <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
          <aside className="rounded-lg border border-line-soft bg-cream p-2 shadow-sm lg:sticky lg:top-6 lg:h-fit lg:min-h-[calc(100vh-8rem)]">
            <CashierNav />
          </aside>
          <section className="min-w-0">{children}</section>
        </div>
      </div>
    </main>
  );
}
