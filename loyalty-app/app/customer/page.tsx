import Link from "next/link";
import { ChevronRight, Gift, QrCode } from "lucide-react";
import { CustomerShell } from "@/components/customer/customer-shell";
import { PointsBalanceCard } from "@/components/customer/points-balance-card";
import { RewardTile } from "@/components/customer/reward-tile";
import { requireCustomerSession } from "@/lib/auth/session";
import { listActiveRewardsWithBranches } from "@/lib/data/rewards";
import { pointsNeeded } from "@/lib/points";

export default async function CustomerHome() {
  const { customer } = await requireCustomerSession();
  const firstName = customer.name.split(" ")[0];

  const rewards = await listActiveRewardsWithBranches();
  const isReady = (reward: (typeof rewards)[number]) =>
    pointsNeeded(customer, reward) === 0 && reward.availableBranchNames.length > 0;
  // Surface what the customer can claim right now first, then the closest goals —
  // so the section always has something to show without going empty.
  const featured = [...rewards]
    .sort((left, right) => {
      const leftReady = isReady(left);
      const rightReady = isReady(right);
      if (leftReady !== rightReady) return leftReady ? -1 : 1;
      if (leftReady && rightReady) return right.pointCost - left.pointCost;
      return pointsNeeded(customer, left) - pointsNeeded(customer, right);
    })
    .slice(0, 4);

  return (
    <CustomerShell>
      <PointsBalanceCard
        points={customer.pointsBalance}
        greeting={<>Hi, {firstName}</>}
        actions={
          <>
            <Link
              href="/customer/qr"
              className="surface-glass flex min-h-tap w-full items-center justify-center gap-2 rounded-pill px-4 text-[15px] font-semibold text-matcha-deep transition-colors duration-fast ease-out-soft"
            >
              <QrCode className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
              Show QR
            </Link>
            <Link
              href="/customer/rewards"
              className="flex min-h-tap w-full items-center justify-center gap-2 rounded-pill border border-cream/70 px-4 text-[15px] font-semibold text-cream transition-colors duration-fast ease-out-soft hover:bg-cream/10"
            >
              <Gift className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
              Rewards
            </Link>
          </>
        }
      />

      {featured.length > 0 ? (
        <section className="mt-7">
          <header className="mb-3 flex items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-[24px] font-medium leading-[29px] text-charcoal">
                Ready to redeem
              </h2>
              <p className="mt-0.5 text-sm text-ink-muted">What your points can get you</p>
            </div>
            <Link
              href="/customer/rewards"
              className="-my-2.5 inline-flex min-h-tap shrink-0 items-center gap-0.5 px-1 text-sm font-medium text-matcha-deep transition-colors duration-fast ease-out-soft hover:text-forest"
            >
              See all
              <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
            </Link>
          </header>
          <div className="grid grid-cols-2 gap-3.5">
            {featured.map((reward) => (
              <RewardTile key={reward.id} reward={reward} ready={isReady(reward)} />
            ))}
          </div>
        </section>
      ) : null}
    </CustomerShell>
  );
}
