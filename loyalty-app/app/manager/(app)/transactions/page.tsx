import { Search } from "lucide-react";
import { DataTable } from "@/components/shared/table";
import { SectionTitle } from "@/components/shared/section-title";
import { Button } from "@/components/shared/button";
import { Select } from "@/components/shared/select";
import { DateRangePicker } from "@/components/manager/date-range-picker";
import { listBranches } from "@/lib/data/branches";
import { listTransactionsWithLabels } from "@/lib/data/manager";
import { formatDate, formatPeso, formatPoints } from "@/lib/formatters";

function parseDateFilter(value: string | undefined, boundary: "start" | "end") {
  if (!value) return undefined;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  const date = match
    ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
    : new Date(value);

  if (Number.isNaN(date.getTime())) return undefined;
  if (boundary === "end") date.setHours(23, 59, 59, 999);
  else date.setHours(0, 0, 0, 0);
  return date;
}

export default async function ManagerTransactionsPage({
  searchParams
}: {
  searchParams: Promise<{
    type?: string;
    branchId?: string;
    customer?: string;
    customerId?: string;
    from?: string;
    to?: string;
  }>;
}) {
  const params = await searchParams;
  const type = params.type === "earn" || params.type === "redeem" || params.type === "manual" ? params.type : undefined;
  const customerQuery = params.customer ?? params.customerId;
  const [transactions, branches] = await Promise.all([
    listTransactionsWithLabels({
      type,
      branchId: params.branchId || undefined,
      customerQuery: customerQuery || undefined,
      from: parseDateFilter(params.from, "start"),
      to: parseDateFilter(params.to, "end")
    }),
    listBranches()
  ]);

  return (
    <div className="flex min-h-0 flex-col gap-5 lg:h-full">
      <SectionTitle title="Transactions" />
      <form className="surface-paper grid items-end gap-x-4 gap-y-3 rounded-lg bg-cream p-4 md:grid-cols-2 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,0.95fr)_minmax(0,1.05fr)_minmax(20rem,1.55fr)_minmax(9.75rem,0.7fr)]">
        <label htmlFor="transactions-type" className="grid min-w-0 gap-1 text-xs font-medium text-ink-muted">
          Type
          <Select
            id="transactions-type"
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
        <label htmlFor="transactions-branch" className="grid min-w-0 gap-1 text-xs font-medium text-ink-muted">
          Branch
          <Select
            id="transactions-branch"
            name="branchId"
            defaultValue={params.branchId ?? ""}
            className="min-h-[44px] px-3 text-sm"
            options={[
              { value: "", label: "All branches" },
              ...branches.map((branch) => ({ value: branch.id, label: branch.name }))
            ]}
          />
        </label>
        <label
          htmlFor="transactions-customer"
          className="grid min-w-0 gap-1 text-xs font-medium text-ink-muted"
        >
          Customer code
          <input
            id="transactions-customer"
            name="customer"
            defaultValue={customerQuery ?? ""}
            placeholder="CM-7K2P9Q"
            className="h-11 min-h-tap w-full min-w-0 rounded-md border border-line bg-cream px-3 text-sm text-charcoal placeholder:text-ink-faint focus:border-matcha-deep focus:outline-none"
          />
        </label>
        <DateRangePicker
          key={`${params.from ?? ""}-${params.to ?? ""}`}
          from={params.from}
          to={params.to}
          className="md:col-span-2 lg:col-span-1"
        />
        <Button
          type="submit"
          icon={Search}
          className="h-11 self-end rounded-md px-4 py-0 text-sm font-semibold md:col-span-2 lg:col-span-1 lg:w-full"
        >
          Search
        </Button>
      </form>
      <DataTable
        headers={["Date", "Member", "Staff", "Branch", "Type", "Bill", "Points"]}
        rows={transactions.map(({ transaction, customerName, staffName, branchName, rewardName }) => {
          return [
            <span key={`${transaction.id}-date`} className="whitespace-nowrap text-sm text-charcoal">
              {formatDate(transaction.createdAt)}
            </span>,
            <span key={`${transaction.id}-member`} className="font-medium text-charcoal">
              {customerName}
            </span>,
            <span key={`${transaction.id}-staff`} className="text-sm text-ink-muted">
              {staffName}
            </span>,
            <span key={`${transaction.id}-branch`} className="text-sm text-ink-muted">
              {branchName ?? "Admin"}
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
