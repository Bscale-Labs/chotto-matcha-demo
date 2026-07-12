import { ArrowDownRight, ArrowUpRight, Leaf } from "lucide-react";
import { CustomerShell } from "@/components/customer/customer-shell";
import { requireCustomerSession } from "@/lib/auth/session";
import { listBranches } from "@/lib/data/branches";
import { getCustomerRecentTransactions } from "@/lib/data/customers";
import { listRewards } from "@/lib/data/rewards";
import { formatDate, formatPoints } from "@/lib/formatters";

const typeMeta = {
  earn: { label: "Earned", tone: "earn" },
  redeem: { label: "Redeemed", tone: "redeem" },
  manual: { label: "Adjustment", tone: "manual" }
} as const;

export default async function CustomerActivityPage() {
  const { customer } = await requireCustomerSession();
  const [activity, branches, rewards] = await Promise.all([
    getCustomerRecentTransactions(customer.id, 100),
    listBranches(),
    listRewards()
  ]);
  const branchById = new Map(branches.map((branch) => [branch.id, branch]));
  const rewardById = new Map(rewards.map((reward) => [reward.id, reward]));

  return (
    <CustomerShell>
      <section>
        <h1 className="font-display text-[40px] font-medium leading-[44px] text-charcoal">
          History
        </h1>
      </section>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="surface-paper rounded-md p-4">
          <p className="eyebrow text-ink-muted">Current points</p>
          <p className="counter mt-3 font-display text-[28px] font-medium leading-none text-charcoal">
            {formatPoints(customer.pointsBalance)}
          </p>
        </div>
        <div className="rounded-md border border-line-soft bg-sage-wash p-4">
          <p className="eyebrow text-matcha-deep/70">Activities logged</p>
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
              ? rewardById.get(transaction.rewardId ?? "")?.name ?? "Reward redeemed"
              : transaction.type === "earn"
                ? branchById.get(transaction.branchId ?? "")?.name ?? "Visit"
                : transaction.reason ?? "Manual adjustment";
          return (
            <li
              key={transaction.id}
              className="surface-paper flex items-center gap-3 rounded-md p-4"
            >
              <span
                className={
                  earned
                    ? "grid h-10 w-10 shrink-0 place-items-center rounded-pill bg-sage-wash text-matcha-deep"
                    : "grid h-10 w-10 shrink-0 place-items-center rounded-pill bg-honey-wash text-honey"
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
                    : "counter inline-flex items-center gap-1 text-sm font-medium text-honey"
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
