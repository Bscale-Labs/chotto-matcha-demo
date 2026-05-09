import { ArrowDownRight, ArrowUpRight, Users } from "lucide-react";
import { ManagerShell } from "@/components/manager/manager-shell";
import { DataTable } from "@/components/shared/table";
import { SectionTitle } from "@/components/shared/section-title";
import { StatCard } from "@/components/shared/stat-card";
import { branches, dashboardStats, getBranch, transactions } from "@/lib/mock-data";
import { formatDate, formatPoints } from "@/lib/formatters";

export default function ManagerPage() {
  return (
    <ManagerShell>
      <div className="space-y-7">
        <SectionTitle eyebrow="Today" title="Quietly thriving">
          Demo data mirrors the single Postgres model planned for production.
        </SectionTitle>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Members"
            value={String(dashboardStats.activeCustomers)}
            detail="Active community"
          />
          <StatCard
            label="Leaves issued"
            value={formatPoints(dashboardStats.pointsIssuedAllTime)}
            detail="All-time earned"
          />
          <StatCard
            label="Leaves redeemed"
            value={formatPoints(dashboardStats.pointsRedeemedAllTime)}
            detail="All-time spent"
          />
          <StatCard
            label="Branches"
            value={String(branches.length)}
            detail="Pouring today"
          />
        </div>

        <section>
          <h2 className="mb-3 font-display text-[24px] font-medium leading-[30px] text-charcoal">
            Recent ledger
          </h2>
          <DataTable
            headers={["When", "Branch", "Type", "Leaves"]}
            rows={transactions.map((transaction) => [
              <span key={`${transaction.id}-when`} className="text-sm text-charcoal">
                {formatDate(transaction.createdAt)}
              </span>,
              <span key={`${transaction.id}-branch`} className="inline-flex items-center gap-2 text-sm text-charcoal">
                <Users className="h-3.5 w-3.5 text-ink-muted" strokeWidth={1.5} aria-hidden="true" />
                {getBranch(transaction.branchId)?.name ?? "Manager"}
              </span>,
              <span key={`${transaction.id}-type`} className="capitalize text-sm text-ink-muted">
                {transaction.type}
              </span>,
              <span
                key={`${transaction.id}-points`}
                className={
                  transaction.pointsDelta > 0
                    ? "counter inline-flex items-center gap-1 text-sm font-medium text-matcha-deep"
                    : "counter inline-flex items-center gap-1 text-sm font-medium text-ink-muted"
                }
              >
                {transaction.pointsDelta > 0 ? (
                  <ArrowUpRight className="h-3 w-3" strokeWidth={1.5} aria-hidden="true" />
                ) : (
                  <ArrowDownRight className="h-3 w-3" strokeWidth={1.5} aria-hidden="true" />
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
