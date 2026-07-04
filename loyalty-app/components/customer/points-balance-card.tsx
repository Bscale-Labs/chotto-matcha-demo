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
  tier: Tier;
  nextTier?: Tier | null;
  pointsToNext?: number;
  progress?: number;
  greeting?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  const TierIcon = tier.icon;
  const fallbackTarget = Math.max(points + 1, Math.ceil((points + 1) / 500) * 500);
  const progressTarget = nextTier?.min ?? fallbackTarget;
  const progressLabel = nextTier?.name ?? "Elevation";
  const remainingPoints =
    nextTier && typeof pointsToNext === "number"
      ? pointsToNext
      : Math.max(0, progressTarget - points);
  const progressValue =
    nextTier && typeof progress === "number"
      ? progress
      : Math.min(1, Math.max(0, points / progressTarget));

  return (
    <section
      className={clsx(
        "matcha-panel relative h-[255px] overflow-hidden rounded-[28px] px-6 py-5 text-cream shadow-[var(--shadow-panel)]",
        className
      )}
    >
      <div className="absolute inset-0 z-10 px-6 py-5">
        {greeting ? (
          <div className="absolute left-6 top-5 text-sm font-medium leading-5 text-cream/90">
            {greeting}
          </div>
        ) : null}

        <div className="absolute left-[186px] top-[41px] inline-flex max-w-[9.75rem] items-center gap-1.5 rounded-pill bg-sage/30 px-3 py-1.5 text-[11px] font-medium leading-4 text-cream/90">
          <TierIcon className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} aria-hidden="true" />
          <span className="truncate">{tier.name}</span>
        </div>

        <div className="absolute left-6 top-[40px]">
          <p className="counter font-display text-[56px] font-medium leading-[0.9] tracking-display">
            {formatPoints(points)}
          </p>
          <p className="mt-1 text-xs text-cream/85">available points</p>
        </div>

        <p className="absolute right-6 top-[74px] max-w-[8.75rem] text-xs leading-4 text-cream/80">
          {tier.vibe}
        </p>

        <div className="absolute left-6 right-6 top-[132px] border-t border-cream/12 pt-3">
          <div className="flex items-baseline justify-between text-[11px] leading-4">
            <span className="font-medium text-cream/82">
              {formatPoints(remainingPoints)} points to {progressLabel}
            </span>
            <span className="counter text-cream/80">
              {formatPoints(points)} / {formatPoints(progressTarget)}
            </span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-pill bg-cream/18">
            <div
              className="h-full rounded-pill bg-sage-tint/90"
              style={{ width: `${Math.round(progressValue * 100)}%` }}
            />
          </div>
        </div>

        {actions ? <div className="absolute bottom-5 left-6 right-6">{actions}</div> : null}
      </div>
    </section>
  );
}
