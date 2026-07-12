import { clsx } from "clsx";
import type { ReactNode } from "react";
import type { Tier } from "@/lib/loyalty";
import { formatPoints } from "@/lib/formatters";

export function PointsBalanceCard({
  points,
  tier,
  nextTier,
  pointsToNext,
  progress,
  greeting,
  actions,
  className
}: {
  points: number;
  tier?: Tier | null;
  nextTier?: Tier | null;
  pointsToNext?: number;
  progress?: number;
  greeting?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  const TierIcon = tier?.icon;
  const showProgress =
    Boolean(nextTier) && typeof pointsToNext === "number" && typeof progress === "number";
  const progressValue = Math.min(1, Math.max(0, progress ?? 0));

  return (
    <section
      className={clsx(
        "matcha-panel relative flex flex-col overflow-hidden rounded-[28px] px-6 py-5 text-cream shadow-[var(--shadow-panel)]",
        actions ? "min-h-[164px]" : "min-h-[210px]",
        className
      )}
    >
      <div className="relative z-10 flex flex-1 flex-col">
        {actions ? (
          <div className="flex flex-1 items-stretch gap-4">
            <div className="flex min-w-0 flex-1 flex-col justify-between">
              {greeting ? (
                <div className="text-sm font-medium leading-5 text-cream/90">{greeting}</div>
              ) : (
                <span />
              )}
              <p className="counter font-display text-[56px] font-medium leading-[0.9] tracking-display">
                {formatPoints(points)}
              </p>
              <p className="text-xs text-cream/85">available points</p>
            </div>
            <div className="flex w-[42%] max-w-[190px] shrink-0 flex-col justify-between">
              {actions}
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between gap-3">
              {greeting ? (
                <div className="text-sm font-medium leading-5 text-cream/90">{greeting}</div>
              ) : (
                <span />
              )}
              {tier && TierIcon ? (
                <div className="inline-flex max-w-[9.75rem] items-center gap-1.5 rounded-pill bg-sage/30 px-3 py-1.5 text-[11px] font-medium leading-4 text-cream/90">
                  <TierIcon className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} aria-hidden="true" />
                  <span className="truncate">{tier.name}</span>
                </div>
              ) : null}
            </div>

            <div className="mt-7">
              <p className="counter font-display text-[56px] font-medium leading-[0.9] tracking-display">
                {formatPoints(points)}
              </p>
              <p className="mt-3 text-xs text-cream/85">available points</p>
            </div>

            {tier?.vibe ? (
              <p className="mt-2 max-w-[16rem] text-xs leading-4 text-cream/80">{tier.vibe}</p>
            ) : null}

            {showProgress ? (
              <div className="mt-4 border-t border-cream/12 pt-3">
                <div className="flex items-baseline justify-between text-[11px] leading-4">
                  <span className="font-medium text-cream/82">
                    {formatPoints(pointsToNext ?? 0)} points to {nextTier?.name}
                  </span>
                  <span className="counter text-cream/80">
                    {formatPoints(points)} / {formatPoints(nextTier?.min ?? points)}
                  </span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-pill bg-cream/18">
                  <div
                    className="h-full rounded-pill bg-sage-tint/90"
                    style={{ width: `${Math.round(progressValue * 100)}%` }}
                  />
                </div>
              </div>
            ) : null}
          </>
        )}
      </div>
    </section>
  );
}
