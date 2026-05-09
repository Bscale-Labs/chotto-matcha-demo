import { Gift } from "lucide-react";
import { formatPoints } from "@/lib/formatters";
import { pointsNeeded } from "@/lib/points";
import type { Customer, Reward } from "@/lib/types";

export function RewardCard({ reward, customer }: { reward: Reward; customer: Customer }) {
  const needed = pointsNeeded(customer, reward);
  const stockLabel = reward.stockCount === null ? "Unlimited" : `${reward.stockCount} left`;

  return (
    <article className="matcha-card rounded-[8px] p-4">
      <div className="flex gap-4">
        <div className="grid h-20 w-20 shrink-0 place-items-center rounded-[8px] bg-matcha/15 text-moss">
          <Gift className="h-8 w-8" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h2 className="font-bold leading-tight text-ink">{reward.name}</h2>
            <span className="rounded-full bg-ink px-3 py-1 text-xs font-bold text-paper">{formatPoints(reward.pointCost)}</span>
          </div>
          <p className="mt-2 line-clamp-2 text-sm leading-5 text-ink/62">{reward.description}</p>
          <div className="mt-3 flex items-center justify-between text-xs font-bold uppercase tracking-[0.12em]">
            <span className="text-moss">{stockLabel}</span>
            <span className={needed === 0 ? "text-matcha" : "text-persimmon"}>
              {needed === 0 ? "Ready" : `${formatPoints(needed)} more`}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
