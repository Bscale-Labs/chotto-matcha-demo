import { CustomerShell } from "@/components/customer/customer-shell";
import { getBranch, getCustomer, getCustomerTransactions, getReward } from "@/lib/mock-data";
import { formatDate, formatPoints } from "@/lib/formatters";

export default function CustomerActivityPage() {
  const customer = getCustomer();
  const activity = getCustomerTransactions(customer.id);

  return (
    <CustomerShell>
      <h1 className="font-display text-4xl text-ink">Activity</h1>
      <div className="mt-5 grid gap-3">
        {activity.map((transaction) => (
          <article key={transaction.id} className="matcha-card rounded-[8px] p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-bold capitalize text-ink">{transaction.type}</p>
                <p className="mt-1 text-sm text-ink/60">
                  {transaction.type === "redeem" ? getReward(transaction.rewardId ?? "")?.name : getBranch(transaction.branchId)?.name}
                </p>
                <p className="mt-1 text-xs text-ink/45">{formatDate(transaction.createdAt)}</p>
              </div>
              <span className={transaction.pointsDelta > 0 ? "font-bold text-matcha" : "font-bold text-persimmon"}>
                {transaction.pointsDelta > 0 ? "+" : ""}
                {formatPoints(transaction.pointsDelta)}
              </span>
            </div>
          </article>
        ))}
      </div>
    </CustomerShell>
  );
}
