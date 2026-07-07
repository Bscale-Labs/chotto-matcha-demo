import { DataTable } from "@/components/shared/table";
import { SectionTitle } from "@/components/shared/section-title";
import { CashierShell } from "@/components/cashier/cashier-shell";
import { requireCashierManagerPageSession } from "@/lib/auth/session";
import { listTransactionsWithLabels } from "@/lib/data/manager";
import { formatDate, formatPeso, formatPoints } from "@/lib/formatters";

function transactionLabel(type: "earn" | "redeem" | "manual") {
  if (type === "earn") return "Earn";
  if (type === "redeem") return "Claim";
  return "Manual";
}

export default async function CashierLedgerPage() {
  const { profile, branch } = await requireCashierManagerPageSession("/cashier/ledger");

  const transactionRows = await listTransactionsWithLabels({ branchId: branch.id });

  return (
    <CashierShell sessionLabel={`${branch.name} · ${profile.name}`} mode="manager">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionTitle title="Ledger" />
      </div>

      <section className="cashier-panel mt-4 rounded-lg p-5">
        {transactionRows.length > 0 ? (
          <DataTable
            headers={["Date", "Customer", "Staff", "Type", "Claim", "Bill", "Points"]}
            className="[&_td]:px-3 [&_td]:py-3.5 [&_th]:px-3 [&_th]:py-3.5"
            rows={transactionRows.map(({ transaction, customerName, staffName, rewardName }) => [
              <span key={`${transaction.id}-date`} className="whitespace-nowrap text-sm text-charcoal">
                {formatDate(transaction.createdAt)}
              </span>,
              <span key={`${transaction.id}-customer`} className="font-medium text-charcoal">
                {customerName}
              </span>,
              <span key={`${transaction.id}-staff`} className="text-sm text-ink-muted">
                {staffName}
              </span>,
              <span key={`${transaction.id}-type`} className="text-sm text-ink-muted">
                {transactionLabel(transaction.type)}
              </span>,
              <span key={`${transaction.id}-claim`} className="block truncate text-sm text-ink-muted">
                {transaction.type === "redeem" ? rewardName ?? "Reward" : "-"}
              </span>,
              <span key={`${transaction.id}-bill`} className="counter text-sm text-ink-muted">
                {transaction.billTotalCents ? formatPeso(transaction.billTotalCents / 100) : "-"}
              </span>,
              <span
                key={`${transaction.id}-points`}
                className={
                  transaction.pointsDelta > 0
                    ? "counter text-sm font-medium text-matcha-deep"
                    : "counter text-sm font-medium text-error-text"
                }
              >
                {transaction.pointsDelta > 0 ? "+" : ""}
                {formatPoints(transaction.pointsDelta)}
              </span>
            ])}
          />
        ) : (
          <div className="rounded-md border border-line-soft bg-cream p-6 text-sm leading-6 text-ink-muted">
            No transactions have been recorded at this branch yet.
          </div>
        )}
      </section>
    </CashierShell>
  );
}
