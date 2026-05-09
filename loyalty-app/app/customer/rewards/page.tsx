import { RewardCard } from "@/components/customer/reward-card";
import { CustomerShell } from "@/components/customer/customer-shell";
import { getCustomer, rewards } from "@/lib/mock-data";

export default function CustomerRewardsPage() {
  const customer = getCustomer();

  return (
    <CustomerShell>
      <section>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-matcha">Catalog</p>
        <h1 className="mt-2 font-display text-4xl text-ink">Rewards</h1>
        <div className="mt-4 flex gap-2">
          {["All", "Items", "Merch"].map((filter) => (
            <button key={filter} className="rounded-full border border-moss/15 bg-white/70 px-4 py-2 text-sm font-bold text-moss">
              {filter}
            </button>
          ))}
        </div>
      </section>
      <div className="mt-5 grid gap-3">
        {rewards.map((reward) => (
          <RewardCard key={reward.id} reward={reward} customer={customer} />
        ))}
      </div>
    </CustomerShell>
  );
}
