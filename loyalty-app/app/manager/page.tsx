import { ManagerShell } from "@/components/manager/manager-shell";
import { DataTable } from "@/components/shared/table";
import { SectionTitle } from "@/components/shared/section-title";
import { StatCard } from "@/components/shared/stat-card";
import { branches, dashboardStats, transactions, getBranch } from "@/lib/mock-data";
import { formatDate, formatPoints } from "@/lib/formatters";

export default function ManagerPage() {
  return (
    <ManagerShell>
      <div className="space-y-6">
        <SectionTitle eyebrow="Today" title="Manager dashboard">
          Demo data mirrors the single Railway Postgres model planned for the production pass.
        </SectionTitle>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Customers" value={String(dashboardStats.activeCustomers)} detail="active demo profiles" />
          <StatCard label="Issued" value={formatPoints(dashboardStats.pointsIssuedAllTime)} detail="all-time points" />
          <StatCard label="Redeemed" value={formatPoints(dashboardStats.pointsRedeemedAllTime)} detail="all-time points" />
          <StatCard label="Branches" value={String(branches.length)} detail="active locations" />
        </div>
        <DataTable
          headers={["Date", "Branch", "Type", "Points"]}
          rows={transactions.map((transaction) => [
            formatDate(transaction.createdAt),
            getBranch(transaction.branchId)?.name ?? "Manager",
            <span key={transaction.id} className="capitalize">{transaction.type}</span>,
            <span key={`${transaction.id}-points`} className={transaction.pointsDelta > 0 ? "font-bold text-matcha" : "font-bold text-persimmon"}>
              {transaction.pointsDelta > 0 ? "+" : ""}
              {formatPoints(transaction.pointsDelta)}
            </span>
          ])}
        />
      </div>
    </ManagerShell>
  );
}
