"use client";

import { useEffect, useRef, useState } from "react";
import { clsx } from "clsx";
import { ChevronDown, MapPin } from "lucide-react";
import { RewardImage } from "@/components/customer/reward-image";
import { PointsPill } from "@/components/customer/points-pill";
import { formatPoints } from "@/lib/formatters";
import { pointsNeeded } from "@/lib/points";
import type { Customer, Reward } from "@/lib/types";

export function RewardCard({
  reward,
  customer,
  className
}: {
  reward: Reward & { availableBranchNames?: string[] };
  customer: Customer;
  className?: string;
}) {
  const [showLocations, setShowLocations] = useState(false);
  const locationsRef = useRef<HTMLDivElement>(null);
  const branches = reward.availableBranchNames;
  const hasAvailabilityData = Array.isArray(branches);
  const branchCount = branches?.length ?? 0;
  const available = hasAvailabilityData ? branchCount > 0 : true;

  const needed = pointsNeeded(customer, reward);
  const ready = needed === 0 && available;
  const progress = Math.min(1, customer.pointsBalance / reward.pointCost);
  // The bar tracks real progress toward the cost: full once redeemable,
  // otherwise how far the current balance has come.
  const fillRatio = ready ? 1 : progress;

  useEffect(() => {
    if (!showLocations) return;
    const onPointerDown = (event: PointerEvent) => {
      if (locationsRef.current && !locationsRef.current.contains(event.target as Node)) {
        setShowLocations(false);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShowLocations(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [showLocations]);

  const availabilityLabel = !hasAvailabilityData
    ? null
    : branchCount === 0
      ? "Unavailable for now"
      : branchCount === 1
        ? "Available at 1 location"
        : `Available at ${branchCount} locations`;

  return (
    <article
      className={clsx(
        "rounded-sm border border-line-soft bg-milk p-3 shadow-sm transition-colors duration-fast ease-out-soft hover:border-line",
        className
      )}
    >
      <div className="flex min-h-20 gap-4">
        <RewardImage imageUrl={reward.imageUrl} name={reward.name} type={reward.type} />
        <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 py-1">
          <div className="min-w-0">
            <div className="flex items-start justify-between gap-3">
              <h3 className="min-w-0 font-display text-base leading-[19px] text-charcoal">
                {reward.name}
              </h3>
              <PointsPill points={reward.pointCost} tone={ready ? "solid" : "soft"} />
            </div>
            <p className="mt-1.5 line-clamp-2 text-xs leading-[16px] text-ink-muted">
              {reward.description}
            </p>
          </div>
          <div>
            <div className="h-1 w-full overflow-hidden rounded-pill bg-line-soft">
              <div
                className="h-full rounded-pill bg-matcha-deep transition-[width] duration-base ease-out-soft"
                style={{ width: `${Math.round(fillRatio * 100)}%` }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between gap-3 text-xs leading-4">
              {availabilityLabel && branchCount > 0 && branches ? (
                <div ref={locationsRef} className="relative min-w-0">
                  <button
                    type="button"
                    onClick={() => setShowLocations((value) => !value)}
                    aria-expanded={showLocations}
                    aria-haspopup="true"
                    className="group flex min-w-0 items-center gap-1 rounded-pill text-ink-muted transition-colors duration-fast ease-out-soft hover:text-matcha-deep"
                  >
                    <MapPin className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} aria-hidden="true" />
                    <span className="truncate">{availabilityLabel}</span>
                    <ChevronDown
                      className={clsx(
                        "h-3.5 w-3.5 shrink-0 opacity-70 transition-transform duration-fast ease-out-soft",
                        showLocations && "rotate-180"
                      )}
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                  </button>
                  {showLocations ? (
                    <div
                      role="menu"
                      className="absolute left-0 top-full z-40 mt-1.5 w-max min-w-[190px] max-w-[240px] rounded-md border border-line bg-milk p-1.5 shadow-lg"
                    >
                      <p className="px-2 pb-1 pt-0.5 text-[11px] font-medium uppercase tracking-wide text-ink-muted">
                        Available at
                      </p>
                      <ul className="flex flex-col">
                        {branches.map((branch) => (
                          <li key={branch} role="menuitem">
                            <div className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm leading-tight text-charcoal">
                              <MapPin
                                className="h-4 w-4 shrink-0 text-matcha-deep"
                                strokeWidth={1.75}
                                aria-hidden="true"
                              />
                              <span className="truncate">{branch}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              ) : (
                <span className="truncate text-ink-muted">{availabilityLabel ?? ""}</span>
              )}
              <span
                className={clsx(
                  "counter shrink-0 font-medium",
                  ready ? "text-matcha-deep" : !available ? "text-error-text" : "text-ink-muted"
                )}
              >
                {ready
                  ? "Ready"
                  : !available
                    ? "Unavailable"
                    : `${formatPoints(customer.pointsBalance)} / ${formatPoints(reward.pointCost)}`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
