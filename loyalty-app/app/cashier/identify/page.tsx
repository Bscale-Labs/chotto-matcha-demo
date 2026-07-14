import Link from "next/link";
import { ChevronRight, Search } from "lucide-react";
import { CashierShell } from "@/components/cashier/cashier-shell";
import { Eyebrow } from "@/components/shared/eyebrow";
import { CustomerAvatar, ScanFrame } from "@/components/cashier/cashier-visuals";
import { requireCashierShiftSession } from "@/lib/auth/session";
import { searchActiveCustomers } from "@/lib/data/customers";
import { formatPoints } from "@/lib/formatters";

export default async function CashierIdentifyPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { profile, branch } = await requireCashierShiftSession();
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const matches = query ? await searchActiveCustomers(query) : [];

  return (
    <CashierShell sessionLabel={`${branch.name} · ${profile.name}`}>
      <section className="cashier-panel rounded-lg p-6 sm:p-8">
        <div className="mx-auto w-full max-w-lg text-center">
          <Eyebrow className="text-matcha-deep">Scan member QR</Eyebrow>
          <ScanFrame className="mt-6" />
          <p className="mx-auto mt-6 max-w-xs text-sm leading-6 text-ink-muted">
            Position the member QR code inside the frame.
          </p>
        </div>

        <div className="mx-auto my-8 flex w-full max-w-2xl items-center gap-4" aria-hidden="true">
          <span className="h-px flex-1 bg-line-soft" />
          <span className="text-xs font-semibold uppercase tracking-eyebrow text-ink-muted">or</span>
          <span className="h-px flex-1 bg-line-soft" />
        </div>

        <div className="mx-auto w-full max-w-2xl">
          <div className="text-center">
            <Eyebrow className="text-matcha-deep">Find member manually</Eyebrow>
            <p className="mt-2 text-sm leading-6 text-ink-muted">
              Search by customer name, member code, email, or phone.
            </p>
          </div>

          <form action="/cashier/identify" method="get" className="mt-5 flex flex-col gap-3 sm:flex-row">
            <label className="flex min-h-[56px] flex-1 items-center gap-3 rounded-md border border-line bg-cream px-4 focus-within:border-matcha-deep focus-within:shadow-focus">
              <Search className="h-5 w-5 shrink-0 text-ink-faint" strokeWidth={1.75} aria-hidden="true" />
              <span className="sr-only">Search customers</span>
              <input
                type="search"
                name="q"
                defaultValue={query}
                placeholder="Enter customer name"
                autoComplete="off"
                className="min-w-0 flex-1 bg-transparent text-base text-charcoal placeholder:text-ink-faint focus:outline-none"
              />
            </label>
            <button type="submit" className="action-lacquer min-h-[56px] rounded-pill px-8 font-medium">
              Search
            </button>
          </form>

          {query ? (
            <div className="mt-5" aria-live="polite">
              <p className="mb-3 text-xs font-medium text-ink-muted">
                {matches.length > 0
                  ? `${matches.length} ${matches.length === 1 ? "member" : "members"} found`
                  : "No matching members found"}
              </p>
              {matches.length > 0 ? (
                <ul className="grid gap-2">
                  {matches.map((customer) => (
                    <li key={customer.id}>
                      <Link
                        href={`/cashier/customer/${customer.id}`}
                        className="gloss group flex min-h-[72px] items-center gap-3 rounded-lg border border-line-soft bg-milk p-3 text-left transition-colors duration-fast ease-out-soft hover:border-matcha-deep hover:bg-sage-wash"
                      >
                        <CustomerAvatar name={customer.name} className="h-11 w-11" />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-medium text-charcoal">{customer.name}</span>
                          <span className="mt-0.5 block truncate text-xs text-ink-muted">
                            {customer.code} · {customer.phone}
                          </span>
                        </span>
                        <span className="counter shrink-0 text-xs font-semibold text-matcha-deep">
                          {formatPoints(customer.pointsBalance)} pts
                        </span>
                        <ChevronRight
                          className="h-4 w-4 shrink-0 text-ink-faint transition-colors group-hover:text-matcha-deep"
                          strokeWidth={1.75}
                          aria-hidden="true"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="rounded-md border border-line-soft bg-cream p-5 text-sm leading-6 text-ink-muted">
                  Check the spelling or try the customer&apos;s member code, email, or phone number.
                </div>
              )}
            </div>
          ) : null}
        </div>
      </section>
    </CashierShell>
  );
}
