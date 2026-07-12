import { RewardCard } from "@/components/customer/reward-card";
import { CustomerShell } from "@/components/customer/customer-shell";
import { requireCustomerSession } from "@/lib/auth/session";
import { listActiveRewardsWithBranches } from "@/lib/data/rewards";
import { pointsNeeded } from "@/lib/points";

export default async function CustomerRewardsPage() {
  const { customer } = await requireCustomerSession();
  const rewards = await listActiveRewardsWithBranches();
  const ready = rewards.filter(
    (reward) => pointsNeeded(customer, reward) === 0 && reward.availableBranchNames.length > 0
  );
  const soon = rewards.filter((reward) => !ready.includes(reward));

  return (
    <CustomerShell>
      <section>
        <h1 className="font-display text-[40px] font-medium leading-[44px] text-charcoal">
          Your rewards
        </h1>
      </section>

      {ready.length > 0 ? (
        <section className="mt-7">
          <h2 className="font-display text-[20px] font-medium leading-7 text-charcoal">
            Ready for you
          </h2>
          <p className="mt-1 text-sm text-ink-muted">
            Go on, you've earned these
          </p>
          <div className="mt-3 grid gap-3">
            {ready.map((reward) => (
              <RewardCard key={reward.id} reward={reward} customer={customer} />
            ))}
          </div>
        </section>
      ) : null}

      {soon.length > 0 ? (
        <section className="mt-7">
          <h2 className="font-display text-[20px] font-medium leading-7 text-charcoal">Soon</h2>
          <p className="mt-1 text-sm text-ink-muted">Just a little more to go.</p>
          <div className="mt-3 grid gap-3">
            {soon.map((reward) => (
              <RewardCard key={reward.id} reward={reward} customer={customer} />
            ))}
          </div>
        </section>
      ) : null}
    </CustomerShell>
  );
}
