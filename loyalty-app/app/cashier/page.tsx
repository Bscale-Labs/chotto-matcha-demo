import Link from "next/link";
import { Boxes, LogOut, Package, ScanLine, ShieldCheck, Store, UsersRound } from "lucide-react";
import { Button } from "@/components/shared/button";
import { Brand } from "@/components/shared/brand";
import { Eyebrow } from "@/components/shared/eyebrow";
import { requireCashierTerminalSession } from "@/lib/auth/session";

export default async function CashierManagerHomePage() {
  const { profile, branch } = await requireCashierTerminalSession();

  return (
    <main className="cashier-surface min-h-screen py-5">
      <div className="mx-auto flex max-w-5xl flex-col gap-5 px-4">
        <header className="flex items-center justify-between gap-3">
          <Brand href="/cashier" size="sm" />
          <div className="flex flex-wrap justify-end gap-2">
            <span className="surface-glass inline-flex min-h-tap items-center gap-2 rounded-pill px-3.5 text-sm text-ink-muted">
              <ShieldCheck className="h-3.5 w-3.5 text-matcha-deep" strokeWidth={1.75} aria-hidden="true" />
              {branch.name}
            </span>
            <form action="/cashier/logout" method="post">
              <Button type="submit" variant="secondary" icon={LogOut} className="px-4">
                Sign out terminal
              </Button>
            </form>
          </div>
        </header>

        <section className="cashier-panel overflow-hidden rounded-lg">
          <div className="grid gap-0 lg:grid-cols-[1fr_320px]">
            <div className="p-6 sm:p-8">
              <Eyebrow className="text-matcha-deep">Branch manager</Eyebrow>
              <h1 className="mt-3 max-w-2xl font-display text-[42px] font-medium leading-[46px] text-charcoal sm:text-[50px] sm:leading-[54px]">
                {branch.name}
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-ink-muted">
                Signed in as {profile.name}. Manage this branch first, then enter cashier mode when the counter is ready.
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-[1.15fr_1fr_1fr]">
                <Button
                  href="/cashier/start"
                  icon={ScanLine}
                  iconPosition="leading"
                  className="min-h-[72px] justify-between rounded-md px-5 sm:col-span-3 md:col-span-1"
                >
                  Enter cashier mode
                </Button>
                <Button
                  href="/cashier/stock"
                  variant="secondary"
                  icon={Package}
                  className="min-h-[72px] justify-start rounded-md px-5"
                >
                  Manage stock
                </Button>
                <Button
                  href="/cashier/accounts"
                  variant="secondary"
                  icon={UsersRound}
                  className="min-h-[72px] justify-start rounded-md px-5"
                >
                  Branch accounts
                </Button>
              </div>
            </div>

            <aside className="border-t border-line-soft bg-cream p-6 lg:border-l lg:border-t-0">
              <div className="grid h-full content-between gap-6">
                <div className="rounded-lg border border-line-soft bg-milk p-5">
                  <Store className="h-5 w-5 text-matcha-deep" strokeWidth={1.75} aria-hidden="true" />
                  <p className="mt-4 text-xs font-semibold uppercase tracking-eyebrow text-ink-muted">
                    Terminal branch
                  </p>
                  <p className="mt-2 font-medium text-charcoal">{branch.name}</p>
                  <p className="mt-1 text-sm leading-6 text-ink-muted">{branch.address}</p>
                </div>
                <div className="rounded-lg border border-line-soft bg-milk p-5">
                  <Boxes className="h-5 w-5 text-matcha-deep" strokeWidth={1.75} aria-hidden="true" />
                  <p className="mt-4 text-xs font-semibold uppercase tracking-eyebrow text-ink-muted">
                    Branch tools
                  </p>
                  <p className="mt-2 text-sm leading-6 text-ink-muted">
                    Stock and account screens use a short manager unlock.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-3">
          <Link
            href="/cashier/start"
            className="gloss rounded-lg border border-line-soft bg-milk p-5 text-sm transition-colors hover:border-matcha-deep hover:bg-sage-wash"
          >
            <ScanLine className="h-5 w-5 text-matcha-deep" strokeWidth={1.75} aria-hidden="true" />
            <span className="mt-4 block font-medium text-charcoal">Cashier mode</span>
            <span className="mt-1 block text-ink-muted">Open the staff PIN screen.</span>
          </Link>
          <Link
            href="/cashier/stock"
            className="gloss rounded-lg border border-line-soft bg-milk p-5 text-sm transition-colors hover:border-matcha-deep hover:bg-sage-wash"
          >
            <Package className="h-5 w-5 text-matcha-deep" strokeWidth={1.75} aria-hidden="true" />
            <span className="mt-4 block font-medium text-charcoal">Stock</span>
            <span className="mt-1 block text-ink-muted">Update branch reward availability.</span>
          </Link>
          <Link
            href="/cashier/accounts"
            className="gloss rounded-lg border border-line-soft bg-milk p-5 text-sm transition-colors hover:border-matcha-deep hover:bg-sage-wash"
          >
            <UsersRound className="h-5 w-5 text-matcha-deep" strokeWidth={1.75} aria-hidden="true" />
            <span className="mt-4 block font-medium text-charcoal">Accounts</span>
            <span className="mt-1 block text-ink-muted">Review members active in this branch.</span>
          </Link>
        </section>
      </div>
    </main>
  );
}
