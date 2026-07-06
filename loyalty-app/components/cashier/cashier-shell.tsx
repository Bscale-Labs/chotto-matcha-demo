import { Clock3, LogOut, ScanLine } from "lucide-react";
import { Brand } from "@/components/shared/brand";
import { Button } from "@/components/shared/button";
import { CashierNav } from "@/components/cashier/cashier-nav";
import { endCashierShift } from "@/app/cashier/actions";

type CashierShellMode = "service" | "manager";

export function CashierShell({
  children,
  sessionLabel = "Shift setup",
  mode = "service"
}: {
  children: React.ReactNode;
  sessionLabel?: string;
  mode?: CashierShellMode;
}) {
  const isManagerMode = mode === "manager";
  const branchLabel = sessionLabel.split(" · ")[0] ?? sessionLabel;

  return (
    <main className="cashier-surface min-h-screen py-5 lg:h-screen lg:overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 lg:h-full">
        <header className="mb-4 grid items-center gap-3 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
          <div className="flex min-w-0 items-center gap-2.5">
            <Brand href={isManagerMode ? "/cashier" : "/cashier/start"} size="sm" className="shrink-0" />
            <span className="shrink-0 text-sm text-ink-faint" aria-hidden="true">
              |
            </span>
            <span className="truncate text-sm font-medium text-charcoal">{branchLabel}</span>
          </div>
          <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-eyebrow text-matcha-deep md:justify-self-center">
            <Clock3 className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            Cashier mode
          </span>
          <div className="flex flex-wrap items-center gap-2 md:justify-self-end">
            {isManagerMode ? (
              <Button href="/cashier/start" icon={ScanLine} className="!min-h-10 !px-3 !py-2 text-sm">
                Enter cashier screen
              </Button>
            ) : null}
            {!isManagerMode ? (
              <form action={endCashierShift}>
                <Button type="submit" variant="secondary" icon={LogOut} className="px-4">
                  End shift
                </Button>
              </form>
            ) : null}
          </div>
        </header>
        <div className="grid gap-4 lg:h-[calc(100%-4.25rem)] lg:grid-cols-[240px_minmax(0,1fr)]">
          <aside className="surface-paper flex flex-col rounded-lg p-2 lg:h-full lg:min-h-0">
            <CashierNav mode={mode} />
            {isManagerMode ? (
              <div className="mt-4 border-t border-line-soft pt-2 lg:mt-auto">
                <form action="/cashier/logout" method="post">
                  <Button type="submit" variant="secondary" icon={LogOut} className="!min-h-10 w-full !px-3 !py-2 text-sm">
                    Sign out terminal
                  </Button>
                </form>
              </div>
            ) : null}
          </aside>
          <section className="min-w-0 lg:h-full lg:overflow-y-auto lg:pr-2">{children}</section>
        </div>
      </div>
    </main>
  );
}
