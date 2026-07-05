"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { updateRewardAllocation } from "@/app/manager/actions";
import { Button } from "@/components/shared/button";
import { FIELD_CHANGED_CLASS } from "@/components/shared/dirty-form";
import { ToastActionForm } from "@/components/shared/toast-action-form";

type Branch = {
  id: string;
  name: string;
};

type Allocation = {
  branchId: string;
  stockCount: number | null;
};

function StockCell({
  rewardId,
  branch,
  initialStock
}: {
  rewardId: string;
  branch: Branch;
  initialStock: number | null;
}) {
  const initialValue = initialStock === null ? "" : String(initialStock);
  const [value, setValue] = useState(initialValue);
  const dirty = value !== initialValue;

  return (
    <ToastActionForm
      action={updateRewardAllocation}
      successTitle="Branch stock saved"
      errorTitle="Could not save branch stock"
      className="flex w-full items-center justify-between gap-3"
    >
      <input type="hidden" name="rewardId" value={rewardId} />
      <input type="hidden" name="branchId" value={branch.id} />
      <input type="hidden" name="active" value="true" />
      <input
        name="stockCount"
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={value}
        placeholder="Always available"
        aria-label={`${branch.name} stock`}
        className={clsx(
          "h-11 w-40 rounded-md border border-line bg-cream px-3 text-sm text-charcoal focus:border-matcha-deep focus:outline-none focus:shadow-focus",
          dirty && FIELD_CHANGED_CLASS
        )}
        onChange={(event) => {
          const nextValue = event.target.value.replace(/\D/g, "");
          setValue(nextValue);
        }}
      />
      <span className="inline-flex min-w-[104px] justify-end">
        <Button
          type="submit"
          className={dirty ? undefined : "invisible"}
          disabled={!dirty}
          aria-hidden={!dirty}
          tabIndex={dirty ? undefined : -1}
        >
          Save
        </Button>
      </span>
    </ToastActionForm>
  );
}

export function RewardAllocationTable({
  rewardId,
  branches,
  allocations
}: {
  rewardId: string;
  branches: Branch[];
  allocations: Allocation[];
}) {
  const allocationsByBranch = new Map(
    allocations.map((allocation) => [allocation.branchId, allocation])
  );
  const columnTemplate = "minmax(10rem,0.8fr) minmax(20rem,1.2fr)";

  return (
    <div className="overflow-hidden rounded-lg border border-line-soft">
      <div className="overflow-x-auto overscroll-x-none">
        <div className="min-w-[520px] text-left text-sm" role="table">
          <div className="bg-matcha-deep text-cream" role="rowgroup">
            <div
              className="grid"
              role="row"
              style={{ gridTemplateColumns: columnTemplate }}
            >
              <div
                className="min-w-0 bg-matcha-deep px-4 py-3 text-[11px] font-semibold uppercase tracking-eyebrow text-cream/85"
                role="columnheader"
              >
                Branch
              </div>
              <div
                className="min-w-0 bg-matcha-deep px-4 py-3 text-[11px] font-semibold uppercase tracking-eyebrow text-cream/85"
                role="columnheader"
              >
                Stock
              </div>
            </div>
          </div>
          <div
            className="max-h-none overflow-y-auto overscroll-none lg:max-h-[calc(100vh-21rem)]"
            role="rowgroup"
          >
            {branches.map((branch) => {
              const allocation = allocationsByBranch.get(branch.id);
              return (
                <div
                  key={branch.id}
                  className="grid border-t border-line-soft first:border-t-0"
                  role="row"
                  style={{ gridTemplateColumns: columnTemplate }}
                >
                  <div className="min-w-0 px-4 py-3.5 font-medium text-charcoal" role="cell">
                    {branch.name}
                  </div>
                  <div className="min-w-0 px-4 py-3.5" role="cell">
                    <StockCell
                      rewardId={rewardId}
                      branch={branch}
                      initialStock={allocation?.stockCount ?? null}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
