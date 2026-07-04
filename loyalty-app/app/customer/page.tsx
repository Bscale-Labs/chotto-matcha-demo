import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, ChevronRight, Gift, QrCode } from "lucide-react";
import { CustomerShell } from "@/components/customer/customer-shell";
import { PointsBalanceCard } from "@/components/customer/points-balance-card";
import { RewardCard } from "@/components/customer/reward-card";
import { requireCustomerSession } from "@/lib/auth/session";
import { listBranches } from "@/lib/data/branches";
import { getCustomerRecentTransactions } from "@/lib/data/customers";
import { listActiveRewards } from "@/lib/data/rewards";
import { formatDate, formatPoints } from "@/lib/formatters";
import { getNextTier, getTier, pointsToNextTier, tierProgress } from "@/lib/loyalty";

export default async function CustomerHome() {
  const { customer } = await requireCustomerSession();
  const [recent, rewards, branches] = await Promise.all([
    getCustomerRecentTransactions(customer.id, 3),
    listActiveRewards(),
    listBranches()
  ]);
  const branchById = new Map(branches.map((branch) => [branch.id, branch]));
  const rewardById = new Map(rewards.map((reward) => [reward.id, reward]));
  const firstName = customer.name.split(" ")[0];
  const tier = getTier(customer.pointsBalance);
  const nextTier = getNextTier(customer.pointsBalance);
  const pointsToNext = pointsToNextTier(customer.pointsBalance);
  const progress = tierProgress(customer.pointsBalance);
  const featured = rewards.slice(0, 2);

  return (
    <CustomerShell>
      <PointsBalanceCard
        points={customer.pointsBalance}
        tier={tier}
        nextTier={nextTier}
        pointsToNext={pointsToNext}
        progress={progress}
        greeting={<>Hi, {firstName}</>}
        actions={
          <div className="grid grid-cols-2 gap-[18px]">
            <Link
              href="/customer/qr"
              className="surface-glass inline-flex min-h-tap items-center justify-center gap-2 rounded-pill px-4 text-[15px] font-semibold text-matcha-deep transition-colors duration-fast ease-out-soft"
            >
              <QrCode className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
              Show QR
            </Link>
            <Link
              href="/customer/rewards"
              className="inline-flex min-h-tap items-center justify-center gap-2 rounded-pill border border-cream/70 px-4 text-[15px] font-semibold text-cream transition-colors duration-fast ease-out-soft hover:bg-cream/10"
            >
              <Gift className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
              Rewards
            </Link>
          </div>
        }
      />

      <section className="mt-[15px]">
        <header className="mb-1.5 flex items-end justify-between">
          <div>
            <p className="eyebrow text-matcha-deep">Today&apos;s moment</p>
            <h2 className="font-display text-[24px] font-medium leading-[29px] text-charcoal">
              Ready to redeem
            </h2>
          </div>
          <Link
            href="/customer/rewards"
            className="-my-2.5 inline-flex min-h-tap items-center gap-0.5 px-1 text-sm font-medium text-matcha-deep transition-colors duration-fast ease-out-soft hover:text-forest"
          >
            See all
            <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
          </Link>
        </header>
        <div className="grid gap-3.5">
          {featured.map((reward) => (
            <RewardCard key={reward.id} reward={reward} customer={customer} />
          ))}
        </div>
      </section>

      <section className="mt-2.5">
        <header className="mb-2.5 flex items-center justify-between">
          <p className="eyebrow text-matcha-deep">Recent activity</p>
          <Link
            href="/customer/activity"
            className="-my-2.5 inline-flex min-h-tap items-center gap-0.5 px-1 text-sm font-medium text-matcha-deep transition-colors duration-fast ease-out-soft hover:text-forest"
          >
            View all
            <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
          </Link>
        </header>
        <ul className="divide-y divide-line-soft overflow-hidden rounded-sm border border-line-soft bg-milk shadow-sm">
          {recent.map((transaction) => {
            const earned = transaction.pointsDelta > 0;
            const label =
              transaction.type === "redeem"
                ? rewardById.get(transaction.rewardId ?? "")?.name ?? "Reward redeemed"
                : branchById.get(transaction.branchId ?? "")?.name ?? "Manual moment";
            return (
              <li
                key={transaction.id}
                className="flex items-center justify-between gap-3 px-4 py-1"
              >
                <span
                  className={
                    earned
                      ? "grid h-8 w-8 shrink-0 place-items-center rounded-pill bg-sage-wash text-matcha-deep"
                      : "grid h-8 w-8 shrink-0 place-items-center rounded-pill bg-rice text-error-text"
                  }
                  aria-hidden="true"
                >
                  {earned ? (
                    <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.75} />
                  ) : (
                    <ArrowDownRight className="h-3.5 w-3.5" strokeWidth={1.75} />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium leading-4 text-charcoal">{label}</p>
                  <p className="text-xs leading-[15px] text-ink-muted">
                    {formatDate(transaction.createdAt)}
                  </p>
                </div>
                <span
                  className={
                    earned
                      ? "counter inline-flex shrink-0 items-center gap-1 text-sm font-medium text-matcha-deep"
                      : "counter inline-flex shrink-0 items-center gap-1 text-sm font-medium text-error-text"
                  }
                >
                  {earned ? "+" : ""}
                  {formatPoints(transaction.pointsDelta)}
                </span>
              </li>
            );
          })}
        </ul>
      </section>
    </CustomerShell>
  );
}
