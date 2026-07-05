import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { notFound } from "next/navigation";
import { Button } from "@/components/shared/button";
import { Eyebrow } from "@/components/shared/eyebrow";
import { Pill } from "@/components/shared/pill";
import { CashierShell } from "@/components/cashier/cashier-shell";
import { RewardThumbnail } from "@/components/cashier/cashier-visuals";
import { redeemCustomerReward } from "@/app/cashier/actions";
import { requireCashierShiftSession } from "@/lib/auth/session";
import { getCustomerById } from "@/lib/data/customers";
import { listActiveRewardsForBranch } from "@/lib/data/rewards";
import { canRedeem } from "@/lib/points";
import { formatPoints } from "@/lib/formatters";

export default async function CashierRedeemPage({
  searchParams
}: {
  searchParams: Promise<{ customerId?: string }>;
}) {
  const { profile, branch, roleDetail } = await requireCashierShiftSession();
  const { customerId } = await searchParams;
  if (!customerId) notFound();
  const [customer, rewards] = await Promise.all([
    getCustomerById(customerId),
    listActiveRewardsForBranch(branch.id)
  ]);
  if (!customer?.active) notFound();
  const firstAvailableRewardId = rewards.find((reward) => canRedeem(customer, reward))?.id;
  const canManageAccounts = roleDetail.role === "branch_manager";

  return (
    <CashierShell sessionLabel={`${branch.name} · ${profile.name}`} canManageAccounts={canManageAccounts}>
      <div className="mb-4">
        <Button href={`/cashier/customer/${customer.id}`} variant="tertiary" icon={ArrowLeft}>
          Back to member
        </Button>
      </div>
      <section className="cashier-panel rounded-lg p-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow className="text-matcha-deep">Redeem reward</Eyebrow>
            <h1 className="mt-3 font-display text-[40px] font-medium leading-[44px] text-charcoal">
              {customer.name}
            </h1>
            <p className="mt-2 text-sm leading-6 text-ink-muted">
              {formatPoints(customer.pointsBalance)} points available.
            </p>
          </div>
          <Pill tone="inverse">{formatPoints(customer.pointsBalance)} pts</Pill>
        </div>

        <form action={redeemCustomerReward} className="mt-5 grid gap-2">
          <input type="hidden" name="customerId" value={customer.id} />
          {rewards.map((reward) => {
            const available = canRedeem(customer, reward);
            return (
              <label
                key={reward.id}
                className="gloss grid min-h-[84px] grid-cols-[auto_1fr_auto] items-center gap-3 rounded-lg border border-line-soft bg-milk p-3 transition-colors duration-fast ease-out-soft hover:border-matcha-deep has-[:checked]:border-matcha-deep has-[:checked]:bg-sage-wash"
              >
                <input
                  type="radio"
                  name="rewardId"
                  value={reward.id}
                  className="h-4 w-4 accent-[var(--matcha-deep)]"
                  disabled={!available}
                  defaultChecked={available && reward.id === firstAvailableRewardId}
                />
                <div className="flex min-w-0 items-center gap-3">
                  <RewardThumbnail
                    rewardId={reward.id}
                    name={reward.name}
                    className="h-12 w-12 shrink-0 rounded-md border border-line-soft bg-sage-wash"
                  />
                  <span className="min-w-0">
                    <span className="block truncate font-medium text-charcoal">{reward.name}</span>
                    <span className="counter mt-0.5 block truncate text-xs text-ink-muted">
                      {formatPoints(reward.pointCost)} points ·{" "}
                      {reward.stockCount === null ? "Always available" : `${reward.stockCount} left`}
                    </span>
                  </span>
                </div>
                <Pill tone={available ? "default" : "muted"}>
                  {available ? "Ready" : "Locked"}
                </Pill>
              </label>
            );
          })}

          <div className="sticky bottom-4 z-20 mt-3">
            <div className="surface-glass rounded-pill p-1.5">
              <Button
                type="submit"
                size="lg"
                icon={CheckCircle2}
                disabled={!firstAvailableRewardId}
                className="w-full"
              >
                Confirm reward
              </Button>
            </div>
          </div>
        </form>
      </section>
    </CashierShell>
  );
}
