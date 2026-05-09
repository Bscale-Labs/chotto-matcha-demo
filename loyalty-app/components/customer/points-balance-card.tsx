import { Leaf } from "lucide-react";
import { clsx } from "clsx";
import type { Tier } from "@/lib/loyalty";
import { formatPoints } from "@/lib/formatters";

export function PointsBalanceCard({
  leaves,
  tier,
  nextTier,
  leavesToNext,
  progress,
  className
}: {
  leaves: number;
  tier: Tier;
  nextTier?: Tier | null;
  leavesToNext?: number;
  progress?: number;
  className?: string;
}) {
  const showProgress = nextTier && typeof progress === "number" && typeof leavesToNext === "number";

  return (
    <section
      className={clsx(
        "relative overflow-hidden rounded-xl bg-matcha-deep p-7 text-cream shadow-md",
        className
      )}
    >
      <Leaf
        className="pointer-events-none absolute -right-6 top-1/2 h-44 w-44 -translate-y-1/2 text-cream/15"
        strokeWidth={1.2}
        aria-hidden="true"
      />
      <div className="relative">
        <p className="eyebrow text-cream/70">Your leaves</p>
        <p className="mt-3 font-display text-[64px] font-medium leading-none tracking-display">
          {formatPoints(leaves)}
        </p>
        <p className="mt-2 text-sm text-cream/75">
          <span aria-hidden="true">{tier.glyph}</span> {tier.name} · {tier.vibe}
        </p>

        {showProgress ? (
          <div className="mt-6 max-w-[16rem]">
            <div className="flex items-baseline justify-between text-xs">
              <span className="text-cream/70">{leavesToNext} leaves to {nextTier!.name}</span>
              <span className="counter font-medium text-cream">
                {formatPoints(leaves)} / {formatPoints(nextTier!.min)}
              </span>
            </div>
            <div className="mt-2 h-1 w-full overflow-hidden rounded-pill bg-cream/20">
              <div
                className="h-full rounded-pill bg-cream"
                style={{ width: `${Math.round(progress! * 100)}%` }}
              />
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
