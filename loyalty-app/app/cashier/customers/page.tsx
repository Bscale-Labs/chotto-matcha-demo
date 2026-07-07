import Link from "next/link";
import { ChevronRight, Plus, ReceiptText } from "lucide-react";
import { Button } from "@/components/shared/button";
import { SectionTitle } from "@/components/shared/section-title";
import { CashierShell } from "@/components/cashier/cashier-shell";
import { CustomerAvatar } from "@/components/cashier/cashier-visuals";
import { requireCashierManagerPageSession } from "@/lib/auth/session";
import { listBranchCustomerAccounts } from "@/lib/data/staff";
import { formatDate, formatPoints } from "@/lib/formatters";

export default async function CashierCustomersPage() {
  const { profile, branch } = await requireCashierManagerPageSession("/cashier/customers");

  const accounts = await listBranchCustomerAccounts(branch.id);

  return (
    <CashierShell sessionLabel={`${branch.name} · ${profile.name}`} mode="manager">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionTitle title="Customers" />
        <Button href="/cashier/customers/new" icon={Plus}>Add customer</Button>
      </div>

      <section className="cashier-panel mt-4 rounded-lg p-5">
        <div className="grid gap-2">
          {accounts.length > 0 ? (
            accounts.map((account) => (
              <Link
                key={account.id}
                href={`/cashier/customers/${account.id}/edit`}
                className="gloss group grid gap-4 rounded-lg border border-line-soft bg-milk p-4 transition-colors duration-fast ease-out-soft hover:border-matcha-deep hover:bg-sage-wash sm:grid-cols-[1fr_auto] sm:items-center"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <CustomerAvatar name={account.name} className="h-12 w-12 shrink-0" />
                  <span className="min-w-0">
                    <span className="block truncate font-medium text-charcoal">{account.name}</span>
                    <span className="mt-1 block truncate text-xs text-ink-muted">
                      {account.code} · {account.phone}
                    </span>
                  </span>
                </span>
                <span className="grid gap-2 sm:min-w-[18rem] sm:grid-cols-[1fr_auto] sm:items-center">
                  <span className="grid gap-1 text-xs text-ink-muted">
                    <span className="inline-flex items-center gap-1.5">
                      <ReceiptText className="h-3.5 w-3.5 text-matcha-deep" strokeWidth={1.75} aria-hidden="true" />
                      {account.branchTransactions} branch visits
                    </span>
                    <span>Last visit {formatDate(account.lastActivityAt)}</span>
                  </span>
                  <span className="inline-flex items-center justify-between gap-3 sm:justify-end">
                    <span className="counter rounded-pill bg-sage-wash px-2.5 py-1 text-xs font-semibold text-matcha-deep">
                      {formatPoints(account.pointsBalance)} pts
                    </span>
                    <ChevronRight
                      className="h-4 w-4 shrink-0 text-ink-faint transition-colors group-hover:text-matcha-deep"
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                  </span>
                </span>
              </Link>
            ))
          ) : (
            <div className="rounded-md border border-line-soft bg-cream p-6 text-sm leading-6 text-ink-muted">
              No customer activity has been recorded at this branch yet.
            </div>
          )}
        </div>
      </section>
    </CashierShell>
  );
}
