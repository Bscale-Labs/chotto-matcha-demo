"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { CheckCircle2 } from "lucide-react";
import { updateBranchRewardStock } from "@/app/cashier/actions";
import { Button } from "@/components/shared/button";
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

function BranchStockRow({ reward }: { reward: StockReward }) {
  const initialStock = reward.branchStockCount === null ? "" : String(reward.branchStockCount);
  const [savedStock, setSavedStock] = useState(initialStock);
  const [savedActive, setSavedActive] = useState(reward.branchActive);
  const [stock, setStock] = useState(initialStock);
  const [active, setActive] = useState(reward.branchActive);
  const dirty = stock !== savedStock || active !== savedActive;

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
      <div className="grid gap-3 sm:grid-cols-[160px_132px_88px] sm:items-end">
        <label className="grid gap-2 text-xs font-semibold uppercase tracking-eyebrow text-ink-muted">
          Stock
          <input
            name="stockCount"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={stock}
            placeholder="Always"
            aria-label={`${reward.name} stock`}
            className={clsx(
              "h-11 rounded-md border border-line bg-cream px-3 text-sm font-medium text-charcoal transition-colors focus:border-matcha-deep focus:outline-none focus:shadow-focus",
              stock !== savedStock && FIELD_CHANGED_CLASS
            )}
            onChange={(event) => setStock(event.target.value.replace(/\D/g, ""))}
          />
        </label>
        <label className="grid gap-2 text-xs font-semibold uppercase tracking-eyebrow text-ink-muted">
          Status
          <button
            type="button"
            aria-pressed={active}
            onClick={() => setActive((current) => !current)}
            className={clsx(
              "flex h-11 items-center justify-between rounded-md border px-3 text-sm font-medium transition-colors",
              active
                ? "border-matcha-deep bg-sage-wash text-matcha-deep"
                : "border-line bg-cream text-ink-muted",
              active !== savedActive && FIELD_CHANGED_CLASS
            )}
          >
            {active ? "Available" : "Hidden"}
            <CheckCircle2
              className={clsx("h-4 w-4", active ? "opacity-100" : "opacity-30")}
              strokeWidth={1.75}
              aria-hidden="true"
            />
          </button>
        </label>
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
        rewards.map((reward) => <BranchStockRow key={reward.id} reward={reward} />)
      ) : (
        <div className="rounded-md border border-line-soft bg-cream p-6 text-sm leading-6 text-ink-muted">
          No active rewards are available for branch stock management.
        </div>
      )}
    </div>
  );
}
