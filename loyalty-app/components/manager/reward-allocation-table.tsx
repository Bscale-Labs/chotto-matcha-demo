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

  return (
    <div className="overflow-x-auto overscroll-x-none rounded-lg border border-line-soft">
      <table className="w-full min-w-[520px] border-collapse text-left text-sm">
        <thead>
          <tr className="bg-matcha-deep text-cream">
            <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-eyebrow text-cream/85">
              Branch
            </th>
            <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-eyebrow text-cream/85">
              Stock
            </th>
          </tr>
        </thead>
        <tbody>
          {branches.map((branch) => {
            const allocation = allocationsByBranch.get(branch.id);
            return (
              <tr key={branch.id} className="border-t border-line-soft first:border-t-0">
                <td className="px-4 py-3.5 align-middle font-medium text-charcoal">
                  {branch.name}
                </td>
                <td className="px-4 py-3.5 align-middle">
                  <StockCell
                    rewardId={rewardId}
                    branch={branch}
                    initialStock={allocation?.stockCount ?? null}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
