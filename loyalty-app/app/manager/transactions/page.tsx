import { ManagerShell } from "@/components/manager/manager-shell";
import { DataTable } from "@/components/shared/table";
import { SectionTitle } from "@/components/shared/section-title";
import { listBranches } from "@/lib/data/branches";
import { listTransactionsWithLabels } from "@/lib/data/manager";
import { formatDate, formatPeso, formatPoints } from "@/lib/formatters";

export default async function ManagerTransactionsPage({
  searchParams
}: {
  searchParams: Promise<{ type?: string; branchId?: string; customerId?: string; from?: string; to?: string }>;
}) {
  const params = await searchParams;
  const type = params.type === "earn" || params.type === "redeem" || params.type === "manual" ? params.type : undefined;
  const [transactions, branches] = await Promise.all([
    listTransactionsWithLabels({
      type,
      branchId: params.branchId || undefined,
      customerId: params.customerId || undefined,
      from: params.from ? new Date(params.from) : undefined,
      to: params.to ? new Date(params.to) : undefined
    }),
    listBranches()
  ]);

  return (
    <ManagerShell>
      <div className="space-y-7">
        <SectionTitle eyebrow="Ledger" title="Transactions" />
        <form className="grid gap-3 rounded-lg border border-line-soft bg-cream p-4 shadow-sm md:grid-cols-5">
          <label className="grid gap-1 text-xs font-medium text-ink-muted">
            Type
            <select
              name="type"
              defaultValue={type ?? ""}
              className="h-10 rounded-md border border-line bg-cream px-3 text-sm text-charcoal focus:border-matcha-deep focus:outline-none"
            >
              <option value="">All types</option>
              <option value="earn">Earn</option>
              <option value="redeem">Redeem</option>
              <option value="manual">Manual</option>
            </select>
          </label>
          <label className="grid gap-1 text-xs font-medium text-ink-muted">
            Branch
            <select
              name="branchId"
              defaultValue={params.branchId ?? ""}
              className="h-10 rounded-md border border-line bg-cream px-3 text-sm text-charcoal focus:border-matcha-deep focus:outline-none"
            >
              <option value="">All branches</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>{branch.name}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-1 text-xs font-medium text-ink-muted">
            Customer ID
            <input
              name="customerId"
              defaultValue={params.customerId ?? ""}
              placeholder="cust-…"
              className="h-10 rounded-md border border-line bg-cream px-3 text-sm text-charcoal placeholder:text-ink-faint focus:border-matcha-deep focus:outline-none"
            />
          </label>
          <label className="grid gap-1 text-xs font-medium text-ink-muted">
            From
            <input
              name="from"
              type="date"
              defaultValue={params.from ?? ""}
              className="h-10 rounded-md border border-line bg-cream px-3 text-sm text-charcoal focus:border-matcha-deep focus:outline-none"
            />
          </label>
          <button className="h-10 self-end rounded-md bg-matcha-deep px-4 text-sm font-medium text-cream shadow-sm transition-colors duration-fast ease-out-soft hover:bg-forest">
            Filter
          </button>
        </form>
        <DataTable
          headers={["When", "Member", "Staff", "Branch", "Type", "Bill", "Points"]}
          rows={transactions.map(({ transaction, customerName, staffName, branchName, rewardName }) => {
            return [
              <span key={`${transaction.id}-when`} className="text-sm text-charcoal">
                {formatDate(transaction.createdAt)}
              </span>,
              <span key={`${transaction.id}-member`} className="font-medium text-charcoal">
                {customerName}
              </span>,
              <span key={`${transaction.id}-staff`} className="text-sm text-ink-muted">
                {staffName}
              </span>,
              <span key={`${transaction.id}-branch`} className="text-sm text-ink-muted">
                {branchName ?? "Manager"}
              </span>,
              <span key={`${transaction.id}-type`} className="text-sm text-ink-muted">
                {rewardName ?? transaction.type}
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
            ];
          })}
        />
      </div>
    </ManagerShell>
  );
}
