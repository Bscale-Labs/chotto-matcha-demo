import { RewardCard } from "@/components/customer/reward-card";
import { CustomerShell } from "@/components/customer/customer-shell";
import { getCustomer, rewards } from "@/lib/mock-data";
import { formatPoints } from "@/lib/formatters";

const filters = ["All", "Drinks", "Treats", "Merch"];

export default function CustomerRewardsPage() {
  const customer = getCustomer();
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
          {formatPoints(customer.pointsBalance)} leaves to spend, slowly.
        </p>
        <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
          {filters.map((filter, index) => (
            <button
              key={filter}
              type="button"
              className={
                index === 0
                  ? "min-h-tap shrink-0 rounded-pill bg-matcha-deep px-4 text-sm font-medium text-cream"
                  : "min-h-tap shrink-0 rounded-pill border border-line bg-cream px-4 text-sm font-medium text-ink-muted transition-colors duration-fast ease-out-soft hover:border-matcha-deep hover:text-matcha-deep"
              }
            >
              {filter}
            </button>
          ))}
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
        <p className="mt-1 text-sm text-ink-muted">A few more leaves and these are yours.</p>
        <div className="mt-3 grid gap-3">
          {onTheWay.map((reward) => (
            <RewardCard key={reward.id} reward={reward} customer={customer} />
          ))}
        </div>
      </section>
    </CustomerShell>
  );
}
