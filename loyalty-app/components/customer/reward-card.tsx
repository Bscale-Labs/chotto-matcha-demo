import { Leaf } from "lucide-react";
import { clsx } from "clsx";
import { formatPoints } from "@/lib/formatters";
import { pointsNeeded } from "@/lib/points";
import type { Customer, Reward } from "@/lib/types";

export function RewardCard({
  reward,
  customer,
  className
}: {
  reward: Reward;
  customer: Customer;
  className?: string;
}) {
  const needed = pointsNeeded(customer, reward);
  const ready = needed === 0;
  const progress = Math.min(1, customer.pointsBalance / reward.pointCost);
  const stockLabel =
    reward.stockCount === null ? "Always available" : reward.stockCount === 0 ? "Out for now" : `${reward.stockCount} left`;

  return (
    <article
      className={clsx(
        "rounded-lg border border-line-soft bg-cream p-4 transition-colors duration-fast ease-out-soft hover:border-line",
        className
      )}
    >
      <div className="flex gap-4">
        <div
          className="grid h-16 w-16 shrink-0 place-items-center rounded-md text-matcha-deep"
          style={{
            backgroundImage:
              "linear-gradient(135deg, var(--sage-wash) 0%, var(--sage-tint) 100%)"
          }}
          aria-hidden="true"
        >
          <Leaf className="h-7 w-7" strokeWidth={1.5} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-display text-[18px] leading-6 text-charcoal">{reward.name}</h3>
            <span className="counter shrink-0 rounded-pill bg-sage-wash px-2.5 py-1 text-xs font-medium text-matcha-deep">
              {formatPoints(reward.pointCost)}
            </span>
          </div>
          <p className="mt-1 line-clamp-2 text-sm leading-5 text-ink-muted">{reward.description}</p>
          <div className="mt-3">
            <div className="h-1 w-full overflow-hidden rounded-pill bg-line-soft">
              <div
                className="h-full rounded-pill bg-matcha-deep transition-[width] duration-base ease-out-soft"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-ink-muted">{stockLabel}</span>
              <span
                className={clsx(
                  "counter font-medium",
                  ready ? "text-matcha-deep" : "text-ink-muted"
                )}
              >
                {ready
                  ? "Ready"
                  : `${formatPoints(customer.pointsBalance)} / ${formatPoints(reward.pointCost)}`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
