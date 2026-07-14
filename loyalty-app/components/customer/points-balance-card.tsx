import { clsx } from "clsx";
import type { ReactNode } from "react";
import { formatPoints } from "@/lib/formatters";

export function PointsBalanceCard({
  points,
  greeting,
  actions,
  className
}: {
  points: number;
  greeting?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
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
            </div>

            <div className="mt-7">
              <p className="counter font-display text-[56px] font-medium leading-[0.9] tracking-display">
                {formatPoints(points)}
              </p>
              <p className="mt-3 text-xs text-cream/85">available points</p>
            </div>

          </>
        )}
      </div>
    </section>
  );
}
