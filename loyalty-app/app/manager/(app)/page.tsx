import { ArrowDownRight, ArrowUpRight, Building2 } from "lucide-react";
import { DataTable } from "@/components/shared/table";
import { SectionTitle } from "@/components/shared/section-title";
import { listTransactionsWithLabels } from "@/lib/data/manager";
import { formatDate, formatPoints } from "@/lib/formatters";

export default async function ManagerPage() {
  const transactionRows = await listTransactionsWithLabels({}, 100);

  return (
    <div className="flex min-h-0 flex-col gap-5 lg:h-full">
        <SectionTitle title="Manager dashboard" />

        <section className="flex min-h-[360px] flex-1 flex-col lg:min-h-0">
          <h2 className="mb-3 font-sans text-[17px] font-bold leading-6 tracking-tight text-charcoal">
            Recent ledger
          </h2>
          <DataTable
            className="min-h-0 flex-1"
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
  );
}
