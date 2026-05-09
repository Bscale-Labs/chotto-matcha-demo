import { ManagerShell } from "@/components/manager/manager-shell";
import { DataTable } from "@/components/shared/table";
import { SectionTitle } from "@/components/shared/section-title";
import { customers, getBranch, getReward, getStaff, transactions } from "@/lib/mock-data";
import { formatDate, formatPeso, formatPoints } from "@/lib/formatters";

export default function ManagerTransactionsPage() {
  return (
    <ManagerShell>
      <div className="space-y-6">
        <SectionTitle eyebrow="Ledger" title="Transactions" />
        <DataTable
          headers={["Date", "Customer", "Staff", "Branch", "Type", "Amount", "Points"]}
          rows={transactions.map((transaction) => {
            const customer = customers.find((item) => item.id === transaction.customerId);
            return [
              formatDate(transaction.createdAt),
              customer?.name ?? "Unknown",
              getStaff(transaction.staffId)?.name ?? "Unknown",
              getBranch(transaction.branchId)?.name ?? "Manager",
              transaction.rewardId ? getReward(transaction.rewardId)?.name ?? transaction.type : transaction.type,
              transaction.billTotal ? formatPeso(transaction.billTotal) : "-",
              <span key={`${transaction.id}-points`} className={transaction.pointsDelta > 0 ? "font-bold text-matcha" : "font-bold text-persimmon"}>
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
