import Link from "next/link";
import { ArrowUpRight, Gift, QrCode } from "lucide-react";
import { Button } from "@/components/shared/button";
import { CustomerShell } from "@/components/customer/customer-shell";
import { PointsBalanceCard } from "@/components/customer/points-balance-card";
import { TierBadge } from "@/components/customer/tier-badge";
import { RewardCard } from "@/components/customer/reward-card";
import { getBranch, getCustomer, getCustomerTransactions, getReward, rewards } from "@/lib/mock-data";
import { formatDate, formatPoints } from "@/lib/formatters";
import { getNextTier, getTier, leavesToNextTier, tierProgress } from "@/lib/loyalty";

export default function CustomerHome() {
  const customer = getCustomer();
  const firstName = customer.name.split(" ")[0];
  const tier = getTier(customer.pointsBalance);
  const nextTier = getNextTier(customer.pointsBalance);
  const leavesToNext = leavesToNextTier(customer.pointsBalance);
  const progress = tierProgress(customer.pointsBalance);
  const recent = getCustomerTransactions(customer.id).slice(0, 3);
  const featured = rewards.slice(0, 2);

  return (
    <CustomerShell>
      <section className="mb-7">
        <p className="text-base text-ink-muted">Welcome back,</p>
        <h1 className="mt-1 font-display text-[40px] font-medium leading-[44px] text-charcoal">
          {firstName}.
        </h1>
        <div className="mt-3">
          <TierBadge tier={tier} />
        </div>
      </section>

      <PointsBalanceCard
        leaves={customer.pointsBalance}
        tier={tier}
        nextTier={nextTier}
        leavesToNext={leavesToNext}
        progress={progress}
      />

      <div className="mt-5 grid grid-cols-2 gap-3">
        <Button href="/customer/qr" icon={QrCode}>Show QR</Button>
        <Button href="/customer/rewards" variant="secondary" icon={Gift}>Rewards</Button>
      </div>

      <section className="mt-9">
        <header className="mb-3 flex items-end justify-between">
          <div>
            <p className="eyebrow text-matcha-deep">Today&apos;s moment</p>
            <h2 className="mt-2 font-display text-[24px] font-medium leading-[30px] text-charcoal">
              Ready to redeem
            </h2>
          </div>
          <Link
            href="/customer/rewards"
            className="text-sm font-medium text-matcha-deep transition-colors duration-fast ease-out-soft hover:text-forest"
          >
            See all
          </Link>
        </header>
        <div className="grid gap-3">
          {featured.map((reward) => (
            <RewardCard key={reward.id} reward={reward} customer={customer} />
          ))}
        </div>
      </section>

      <section className="mt-9">
        <header className="mb-3 flex items-end justify-between">
          <h2 className="font-display text-[24px] font-medium leading-[30px] text-charcoal">
            Recent moments
          </h2>
          <Link
            href="/customer/activity"
            className="text-sm font-medium text-matcha-deep transition-colors duration-fast ease-out-soft hover:text-forest"
          >
            Open journal
          </Link>
        </header>
        <ul className="grid gap-2">
          {recent.map((transaction) => {
            const earned = transaction.pointsDelta > 0;
            const label =
              transaction.type === "redeem"
                ? getReward(transaction.rewardId ?? "")?.name ?? "Reward redeemed"
                : getBranch(transaction.branchId)?.name ?? "Manual moment";
            return (
              <li
                key={transaction.id}
                className="flex items-center justify-between rounded-md border border-line-soft bg-cream px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-charcoal">{label}</p>
                  <p className="mt-0.5 text-xs text-ink-muted">
                    {formatDate(transaction.createdAt)}
                  </p>
                </div>
                <span
                  className={
                    earned
                      ? "counter ml-3 inline-flex items-center gap-1 rounded-pill bg-sage-wash px-2.5 py-1 text-xs font-medium text-matcha-deep"
                      : "counter ml-3 inline-flex items-center gap-1 rounded-pill bg-stone px-2.5 py-1 text-xs font-medium text-ink-muted"
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
      </section>
    </CustomerShell>
  );
}
