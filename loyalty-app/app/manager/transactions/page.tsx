import { ManagerShell } from "@/components/manager/manager-shell";
import { DataTable } from "@/components/shared/table";
import { SectionTitle } from "@/components/shared/section-title";
import { customers, getBranch, getReward, getStaff, transactions } from "@/lib/mock-data";
import { formatDate, formatPeso, formatPoints } from "@/lib/formatters";

export default function ManagerTransactionsPage() {
  return (
    <ManagerShell>
      <div className="space-y-7">
        <SectionTitle eyebrow="Ledger" title="Transactions" />
        <DataTable
          headers={["When", "Member", "Staff", "Branch", "Type", "Bill", "Leaves"]}
          rows={transactions.map((transaction) => {
            const customer = customers.find((item) => item.id === transaction.customerId);
            return [
              <span key={`${transaction.id}-when`} className="text-sm text-charcoal">
                {formatDate(transaction.createdAt)}
              </span>,
              <span key={`${transaction.id}-member`} className="font-medium text-charcoal">
                {customer?.name ?? "Unknown"}
              </span>,
              <span key={`${transaction.id}-staff`} className="text-sm text-ink-muted">
                {getStaff(transaction.staffId)?.name ?? "Unknown"}
              </span>,
              <span key={`${transaction.id}-branch`} className="text-sm text-ink-muted">
                {getBranch(transaction.branchId)?.name ?? "Manager"}
              </span>,
              <span key={`${transaction.id}-type`} className="text-sm text-ink-muted">
                {transaction.rewardId
                  ? getReward(transaction.rewardId)?.name ?? transaction.type
                  : transaction.type}
              </span>,
              <span key={`${transaction.id}-bill`} className="counter text-sm text-ink-muted">
                {transaction.billTotal ? formatPeso(transaction.billTotal) : "—"}
              </span>,
              <span
                key={`${transaction.id}-points`}
                className={
                  transaction.pointsDelta > 0
                    ? "counter text-sm font-medium text-matcha-deep"
                    : "counter text-sm font-medium text-ink-muted"
                }
              >
                {transaction.pointsDelta > 0 ? "+" : ""}
                {formatPoints(transaction.pointsDelta)}
              </span>
            ];
          })}
        />
      </div>
    </ManagerShell>
  );
}
