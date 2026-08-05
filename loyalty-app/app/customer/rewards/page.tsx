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
          Rewards
        </h1>
      </section>

      {rewards.length === 0 ? (
        <div className="mt-7 rounded-lg border border-dashed border-line p-6 text-center">
          <p className="text-sm text-ink-muted">No rewards yet — the menu is being whisked.</p>
        </div>
      ) : null}

      {ready.length > 0 ? (
        <section className="mt-7">
          <h2 className="font-display text-[20px] font-medium leading-7 text-charcoal">
            Ready for you
          </h2>
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
