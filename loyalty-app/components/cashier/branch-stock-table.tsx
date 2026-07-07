"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { updateBranchRewardStock } from "@/app/cashier/actions";
import { Button } from "@/components/shared/button";
import { Pill } from "@/components/shared/pill";
import { RewardThumbnail } from "@/components/cashier/cashier-visuals";
import { FIELD_CHANGED_CLASS } from "@/components/shared/dirty-form";
import { ToastActionForm } from "@/components/shared/toast-action-form";
import { formatPoints } from "@/lib/formatters";

type StockReward = {
  id: string;
  name: string;
  description: string;
  pointCost: number;
  type: "item" | "merch";
  branchStockCount: number | null;
  branchActive: boolean;
};

function stockStatus(active: boolean, stock: string) {
  if (stock !== "" && Number(stock) <= 0) return { label: "Out of stock", tone: "warn" as const };
  if (!active) return { label: "Resting", tone: "muted" as const };
  if (stock === "") return { label: "Always", tone: "default" as const };
  return { label: "Available", tone: "default" as const };
}

function BranchStockRow({ reward }: { reward: StockReward }) {
  const initialStock = reward.branchStockCount === null ? "" : String(reward.branchStockCount);
  const [savedStock, setSavedStock] = useState(() => initialStock);
  const [savedActive, setSavedActive] = useState(() => reward.branchActive);
  const [stock, setStock] = useState(() => initialStock);
  const [active, setActive] = useState(() => reward.branchActive);
  const dirty = stock !== savedStock || active !== savedActive;
  const status = stockStatus(active, stock);
  const isOutOfStock = stock !== "" && Number(stock) <= 0;

  return (
    <ToastActionForm
      action={updateBranchRewardStock}
      successTitle="Stock saved"
      successMessage={`${reward.name} was updated for this branch.`}
      errorTitle="Could not save stock"
      refreshOnSuccess={false}
      onSuccess={() => {
        setSavedStock(stock);
        setSavedActive(active);
      }}
      className="gloss grid gap-4 rounded-lg border border-line-soft bg-milk p-4 sm:grid-cols-[1fr_auto] sm:items-center"
    >
      <input type="hidden" name="rewardId" value={reward.id} />
      <input type="hidden" name="active" value={active ? "true" : "false"} />
      <div className="flex min-w-0 items-center gap-3">
        <RewardThumbnail
          rewardId={reward.id}
          name={reward.name}
          className="h-14 w-14 shrink-0 rounded-md border border-line-soft bg-sage-wash"
        />
        <span className="min-w-0">
          <span className="block truncate font-medium text-charcoal">{reward.name}</span>
          <span className="mt-1 block truncate text-xs capitalize text-ink-muted">
            {reward.type} · {formatPoints(reward.pointCost)} points
          </span>
        </span>
      </div>
      <div className="grid gap-3 sm:grid-cols-[160px_176px_88px] sm:items-end">
        <label className="grid gap-2 text-xs font-semibold uppercase tracking-eyebrow text-ink-muted">
          Stock
          <input
            name="stockCount"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={stock}
            placeholder="Always available"
            aria-label={`${reward.name} stock`}
            className={clsx(
              "h-11 w-full min-w-0 rounded-md border border-line bg-cream px-3 text-sm font-medium text-charcoal transition-colors focus:border-matcha-deep focus:outline-none focus:shadow-focus",
              stock !== savedStock && FIELD_CHANGED_CLASS
            )}
            onChange={(event) => setStock(event.target.value.replace(/\D/g, ""))}
          />
        </label>
        <div className="grid gap-2">
          <span className="text-xs font-semibold uppercase tracking-eyebrow text-ink-muted">Status</span>
          {isOutOfStock ? (
            <div className="flex h-11 w-full min-w-0 items-center rounded-md border border-line bg-cream px-3">
              <Pill tone={status.tone} className="self-center">
                {status.label}
              </Pill>
            </div>
          ) : (
            <button
              type="button"
              role="switch"
              aria-checked={active}
              aria-label={active ? `Rest ${reward.name}` : `Make ${reward.name} available`}
              onClick={() => setActive((current) => !current)}
              className={clsx(
                "flex h-11 w-full min-w-0 items-center justify-between gap-3 rounded-md border border-line bg-cream px-3 transition-colors duration-fast ease-out-soft hover:border-matcha-deep focus:outline-none focus:shadow-focus",
                active !== savedActive && FIELD_CHANGED_CLASS
              )}
            >
              <Pill tone={status.tone} className="self-center">
                {status.label}
              </Pill>
              <span
                className={clsx(
                  "relative h-6 w-10 shrink-0 rounded-pill border transition-colors duration-fast ease-out-soft",
                  active ? "border-matcha-deep bg-matcha-deep" : "border-line bg-line-soft"
                )}
                aria-hidden="true"
              >
                <span
                  className={clsx(
                    "absolute left-0.5 top-0.5 h-5 w-5 rounded-pill bg-cream shadow-sm transition-transform duration-fast ease-out-soft",
                    active && "translate-x-4"
                  )}
                />
              </span>
            </button>
          )}
        </div>
        <Button
          type="submit"
          className={dirty ? "h-11 px-4" : "invisible h-11 px-4"}
          disabled={!dirty}
          aria-hidden={!dirty}
          tabIndex={dirty ? undefined : -1}
        >
          Save
        </Button>
      </div>
    </ToastActionForm>
  );
}

export function BranchStockTable({ rewards }: { rewards: StockReward[] }) {
  return (
    <div className="grid gap-2">
      {rewards.length > 0 ? (
        rewards.map((reward) => (
          <BranchStockRow
            key={`${reward.id}-${reward.branchStockCount ?? "always"}-${reward.branchActive}`}
            reward={reward}
          />
        ))
      ) : (
        <div className="rounded-md border border-line-soft bg-cream p-6 text-sm leading-6 text-ink-muted">
          No active rewards are available for branch stock management.
        </div>
      )}
    </div>
  );
}
