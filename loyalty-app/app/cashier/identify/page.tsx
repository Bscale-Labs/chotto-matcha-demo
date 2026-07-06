import Link from "next/link";
import { ArrowLeft, ChevronRight, Search } from "lucide-react";
import { Button } from "@/components/shared/button";
import { CashierShell } from "@/components/cashier/cashier-shell";
import { Eyebrow } from "@/components/shared/eyebrow";
import { CustomerAvatar, ScanFrame } from "@/components/cashier/cashier-visuals";
import { requireCashierShiftSession } from "@/lib/auth/session";
import { listCustomers } from "@/lib/data/customers";
import { formatPoints } from "@/lib/formatters";

export default async function CashierIdentifyPage() {
  const { profile, branch } = await requireCashierShiftSession();
  const customers = (await listCustomers()).filter((customer) => customer.active);

  return (
    <CashierShell sessionLabel={`${branch.name} · ${profile.name}`}>
      <div className="mb-4">
        <Button href="/cashier/start" variant="tertiary" icon={ArrowLeft}>
          Back to dashboard
        </Button>
      </div>
      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <section className="cashier-panel grid min-h-[540px] place-items-center rounded-lg p-8 text-center">
          <div className="w-full max-w-md">
            <Eyebrow className="text-matcha-deep">Scan member code</Eyebrow>
            <ScanFrame className="mt-8" />
            <p className="mx-auto mt-6 max-w-xs text-sm leading-6 text-ink-muted">
              Position the member code inside the frame.
            </p>
            <div className="mx-auto mt-6 flex max-w-xs items-center gap-3">
              <span className="h-px flex-1 bg-line" />
              <span className="text-xs font-medium uppercase tracking-eyebrow text-ink-faint">or</span>
              <span className="h-px flex-1 bg-line" />
            </div>
            <label className="surface-paper mx-auto mt-5 flex max-w-xs items-center gap-2 rounded-md px-4 py-3 text-sm text-ink-muted focus-within:border-matcha-deep focus-within:shadow-focus">
              <Search className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
              <input
                placeholder="Enter code, phone, or name manually"
                className="min-w-0 flex-1 bg-transparent placeholder:text-ink-faint focus:outline-none"
              />
            </label>
          </div>
        </section>
        <aside className="cashier-panel rounded-lg p-5">
          <Eyebrow className="text-matcha-deep">Lookup</Eyebrow>
          <label className="surface-paper mt-4 flex items-center gap-2 rounded-md px-4 py-3 text-sm text-ink-muted focus-within:border-matcha-deep focus-within:shadow-focus">
            <Search className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
            <input
              placeholder="Search code, phone, or name"
              className="min-w-0 flex-1 bg-transparent placeholder:text-ink-faint focus:outline-none"
            />
          </label>
          <div className="mt-4 grid gap-2">
            {customers.map((customer) => (
              <Link
                key={customer.id}
                href={`/cashier/customer/${customer.id}`}
                className="gloss group flex min-h-[92px] items-center gap-3 rounded-lg border border-line-soft bg-milk p-4 transition-colors duration-fast ease-out-soft hover:border-matcha-deep hover:bg-sage-wash active:bg-sage-tint"
              >
                <CustomerAvatar name={customer.name} className="h-12 w-12" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium text-charcoal">{customer.name}</span>
                  <span className="mt-1 block truncate text-xs text-ink-muted">
                    {customer.code} · {customer.phone}
                  </span>
                </span>
                <span className="counter inline-flex shrink-0 items-center rounded-pill bg-sage-wash px-2.5 py-1 text-xs font-medium text-matcha-deep">
                  {formatPoints(customer.pointsBalance)} pts
                </span>
                <ChevronRight
                  className="h-4 w-4 shrink-0 text-ink-faint transition-colors group-hover:text-matcha-deep"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </CashierShell>
  );
}
