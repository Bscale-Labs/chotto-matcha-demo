import { RewardCard } from "@/components/customer/reward-card";
import { CustomerShell } from "@/components/customer/customer-shell";
import { requireCustomerSession } from "@/lib/auth/session";
import { listActiveRewards } from "@/lib/data/rewards";
import { formatPoints } from "@/lib/formatters";

const filters = ["All", "Drinks", "Treats", "Merch"];

export default async function CustomerRewardsPage() {
  const { customer } = await requireCustomerSession();
  const rewards = await listActiveRewards();
  const ready = rewards.filter((r) => customer.pointsBalance >= r.pointCost && r.active && (r.stockCount ?? 1) > 0);
  const onTheWay = rewards.filter((r) => !ready.includes(r));

  return (
    <CustomerShell>
      <section>
        <p className="eyebrow text-matcha-deep">Catalog</p>
        <h1 className="mt-2 font-display text-[40px] font-medium leading-[44px] text-charcoal">
          Your rewards
        </h1>
        <p className="mt-2 text-sm leading-5 text-ink-muted">
          {formatPoints(customer.pointsBalance)} points to spend, slowly.
        </p>
        <div className="sticky top-2 z-20 mt-5">
          <div className="surface-glass flex gap-1.5 overflow-x-auto rounded-pill p-1.5">
            {filters.map((filter, index) => (
              <button
                key={filter}
                type="button"
                className={
                  index === 0
                    ? "action-lacquer min-h-[40px] shrink-0 rounded-pill px-4 text-sm font-semibold"
                    : "min-h-[40px] shrink-0 rounded-pill px-4 text-sm font-medium text-ink-muted transition-colors duration-fast ease-out-soft hover:bg-sage-wash hover:text-matcha-deep"
                }
              >
                {filter}
              </button>
            ))}
          </div>
          <div className="scroll-edge-diffuse pointer-events-none absolute inset-x-0 top-full h-4" />
        </div>
      </section>

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

      <section className="mt-7">
        <h2 className="font-display text-[20px] font-medium leading-7 text-charcoal">
          Soon
        </h2>
        <p className="mt-1 text-sm text-ink-muted">A few more points and these are yours.</p>
        <div className="mt-3 grid gap-3">
          {onTheWay.map((reward) => (
            <RewardCard key={reward.id} reward={reward} customer={customer} />
          ))}
        </div>
      </section>
    </CustomerShell>
  );
}
