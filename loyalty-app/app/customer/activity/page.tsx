import { ArrowDownRight, ArrowUpRight, Leaf } from "lucide-react";
import { CustomerShell } from "@/components/customer/customer-shell";
import { getBranch, getCustomer, getCustomerTransactions, getReward } from "@/lib/mock-data";
import { formatDate, formatPoints } from "@/lib/formatters";

const typeMeta = {
  earn: { label: "Earned", tone: "earn" },
  redeem: { label: "Redeemed", tone: "redeem" },
  manual: { label: "Adjustment", tone: "manual" }
} as const;

export default function CustomerActivityPage() {
  const customer = getCustomer();
  const activity = getCustomerTransactions(customer.id);

  const earned = activity
    .filter((transaction) => transaction.pointsDelta > 0)
    .reduce((sum, transaction) => sum + transaction.pointsDelta, 0);

  return (
    <CustomerShell>
      <section>
        <p className="eyebrow text-matcha-deep">Your moments</p>
        <h1 className="mt-2 font-display text-[40px] font-medium leading-[44px] text-charcoal">
          Journal
        </h1>
        <p className="mt-2 text-sm leading-5 text-ink-muted">
          A quiet record of every visit, sip, and reward.
        </p>
      </section>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-md border border-line-soft bg-cream p-4">
          <p className="eyebrow text-ink-muted">All-time leaves</p>
          <p className="counter mt-3 font-display text-[28px] font-medium leading-none text-charcoal">
            {formatPoints(earned)}
          </p>
        </div>
        <div className="rounded-md border border-line-soft bg-sage-wash p-4">
          <p className="eyebrow text-matcha-deep/70">Moments logged</p>
          <p className="counter mt-3 font-display text-[28px] font-medium leading-none text-matcha-deep">
            {activity.length}
          </p>
        </div>
      </div>

      <ul className="mt-6 grid gap-2">
        {activity.map((transaction) => {
          const earned = transaction.pointsDelta > 0;
          const meta = typeMeta[transaction.type] ?? typeMeta.manual;
          const label =
            transaction.type === "redeem"
              ? getReward(transaction.rewardId ?? "")?.name ?? "Reward redeemed"
              : transaction.type === "earn"
                ? getBranch(transaction.branchId)?.name ?? "Visit"
                : transaction.reason ?? "Manual adjustment";
          return (
            <li
              key={transaction.id}
              className="flex items-center gap-3 rounded-md border border-line-soft bg-cream p-4"
            >
              <span
                className={
                  earned
                    ? "grid h-10 w-10 shrink-0 place-items-center rounded-pill bg-sage-wash text-matcha-deep"
                    : "grid h-10 w-10 shrink-0 place-items-center rounded-pill bg-stone text-ink-muted"
                }
                aria-hidden="true"
              >
                {earned ? (
                  <Leaf className="h-4 w-4" strokeWidth={1.5} />
                ) : (
                  <ArrowDownRight className="h-4 w-4" strokeWidth={1.5} />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-charcoal">{label}</p>
                <p className="mt-0.5 text-xs text-ink-muted">
                  <span className="capitalize">{meta.label}</span> · {formatDate(transaction.createdAt)}
                </p>
              </div>
              <span
                className={
                  earned
                    ? "counter inline-flex items-center gap-1 text-sm font-medium text-matcha-deep"
                    : "counter inline-flex items-center gap-1 text-sm font-medium text-ink-muted"
                }
              >
                {earned ? "+" : ""}
                {formatPoints(transaction.pointsDelta)}
                <ArrowUpRight
                  className={earned ? "h-3 w-3" : "h-3 w-3 rotate-90"}
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </span>
            </li>
          );
        })}
      </ul>
    </CustomerShell>
  );
}
