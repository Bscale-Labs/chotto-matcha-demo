import { ArrowDownRight, ArrowUpRight, Building2 } from "lucide-react";
import { ManagerShell } from "@/components/manager/manager-shell";
import { DataTable } from "@/components/shared/table";
import { SectionTitle } from "@/components/shared/section-title";
import { StatCard } from "@/components/shared/stat-card";
import { listBranches } from "@/lib/data/branches";
import { getManagerDashboardStats } from "@/lib/data/dashboard";
import { listTransactionsWithLabels } from "@/lib/data/manager";
import { formatDate, formatPoints } from "@/lib/formatters";

export default async function ManagerPage() {
  const [dashboardStats, branchRows, transactionRows] = await Promise.all([
    getManagerDashboardStats(),
    listBranches(),
    listTransactionsWithLabels({}, 10)
  ]);

  return (
    <ManagerShell>
      <div className="space-y-7">
        <SectionTitle title="Manager dashboard" />

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Members"
            value={String(dashboardStats.activeCustomers)}
            detail="Active community"
          />
          <StatCard
            label="Points issued"
            value={formatPoints(dashboardStats.pointsIssuedAllTime)}
            detail="All-time earned"
          />
          <StatCard
            label="Points redeemed"
            value={formatPoints(dashboardStats.pointsRedeemedAllTime)}
            detail="All-time spent"
          />
          <StatCard
            label="Branches"
            value={String(branchRows.length)}
            detail="Pouring today"
          />
        </div>

        <section>
          <h2 className="mb-3 font-sans text-[17px] font-bold leading-6 tracking-tight text-charcoal">
            Recent ledger
          </h2>
          <DataTable
            headers={["When", "Branch", "Type", "Points"]}
            rows={transactionRows.map(({ transaction, branchName }) => [
              <span key={`${transaction.id}-when`} className="text-sm text-charcoal">
                {formatDate(transaction.createdAt)}
              </span>,
              <span key={`${transaction.id}-branch`} className="inline-flex items-center gap-2 text-sm text-charcoal">
                <Building2 className="h-3.5 w-3.5 text-ink-muted" strokeWidth={1.75} aria-hidden="true" />
                {branchName ?? "Manager"}
              </span>,
              <span key={`${transaction.id}-type`} className="capitalize text-sm text-ink-muted">
                {transaction.type}
              </span>,
              <span
                key={`${transaction.id}-points`}
                className={
                  transaction.pointsDelta > 0
                    ? "counter inline-flex items-center gap-1 text-sm font-medium text-matcha-deep"
                    : "counter inline-flex items-center gap-1 text-sm font-medium text-error-text"
                }
              >
                {transaction.pointsDelta > 0 ? (
                  <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                ) : (
                  <ArrowDownRight className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                )}
                {transaction.pointsDelta > 0 ? "+" : ""}
                {formatPoints(transaction.pointsDelta)}
              </span>
            ])}
          />
        </section>
      </div>
    </ManagerShell>
  );
}
