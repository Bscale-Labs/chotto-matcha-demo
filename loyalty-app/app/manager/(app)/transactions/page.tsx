import { DataTable } from "@/components/shared/table";
import { SectionTitle } from "@/components/shared/section-title";
import { Button } from "@/components/shared/button";
import { Select } from "@/components/shared/select";
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
    <div className="flex min-h-0 flex-col gap-5 lg:h-full">
        <SectionTitle title="Transactions" />
        <form className="surface-paper grid gap-3 rounded-lg bg-cream p-4 md:grid-cols-2 lg:grid-cols-[repeat(4,minmax(0,1fr))_180px]">
          <label className="grid gap-1 text-xs font-medium text-ink-muted">
            Type
            <Select
              name="type"
              defaultValue={type ?? ""}
              className="min-h-[44px] px-3 text-sm"
              options={[
                { value: "", label: "All types" },
                { value: "earn", label: "Earn" },
                { value: "redeem", label: "Redeem" },
                { value: "manual", label: "Manual" }
              ]}
            />
          </label>
          <label className="grid gap-1 text-xs font-medium text-ink-muted">
            Branch
            <Select
              name="branchId"
              defaultValue={params.branchId ?? ""}
              className="min-h-[44px] px-3 text-sm"
              options={[
                { value: "", label: "All branches" },
                ...branches.map((branch) => ({ value: branch.id, label: branch.name }))
              ]}
            />
          </label>
          <label className="grid gap-1 text-xs font-medium text-ink-muted">
            Customer ID
            <input
              name="customerId"
              defaultValue={params.customerId ?? ""}
              placeholder="cust-…"
              className="h-11 min-h-tap rounded-md border border-line bg-cream px-3 text-sm text-charcoal placeholder:text-ink-faint focus:border-matcha-deep focus:outline-none"
            />
          </label>
          <label className="grid gap-1 text-xs font-medium text-ink-muted">
            From
            <input
              name="from"
              type="date"
              defaultValue={params.from ?? ""}
              className="h-11 min-h-tap rounded-md border border-line bg-cream px-3 text-sm text-charcoal focus:border-matcha-deep focus:outline-none"
            />
          </label>
          <Button type="submit" className="self-end rounded-md px-4 text-sm font-semibold md:col-span-2 lg:col-span-1">
            Filter
          </Button>
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
  );
}
