"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { createBranch, updateBranch } from "@/app/manager/actions";
import { Button } from "@/components/shared/button";

type BranchDetailsFormProps =
  | {
      mode: "create";
    }
  | {
      mode: "edit";
      branch: {
        id: string;
        code: string | null;
        name: string;
        address: string;
        googleMapsUrl: string | null;
        active: boolean;
      };
    };

export function BranchDetailsForm(props: BranchDetailsFormProps) {
  const isEdit = props.mode === "edit";
  const branch = isEdit ? props.branch : null;
  const [active, setActive] = useState(branch?.active ?? true);
  const [dirty, setDirty] = useState(!isEdit);

  function markDirty() {
    if (!dirty) setDirty(true);
  }

  function toggleActive() {
    setActive((current) => !current);
    markDirty();
  }

  return (
    <form
      action={isEdit ? updateBranch : createBranch}
      className="grid max-w-2xl gap-5 rounded-lg border border-line-soft bg-cream p-6"
    >
      {branch ? <input type="hidden" name="id" value={branch.id} /> : null}
      <input type="hidden" name="active" value={active ? "true" : "false"} />

      <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_160px]">
        <label className="grid min-w-0 gap-2 text-sm font-medium text-charcoal">
          Branch name
          <input
            name="name"
            required
            defaultValue={branch?.name}
            placeholder="BGC Matcha Bar"
            className="h-12 w-full min-w-0 rounded-md border border-line bg-cream px-4 text-base font-normal focus:border-matcha-deep focus:outline-none focus:shadow-focus"
            onChange={markDirty}
          />
        </label>
        <label className="grid min-w-0 gap-2 text-sm font-medium text-charcoal">
          Branch code
          <input
            name="code"
            defaultValue={branch?.code ?? ""}
            placeholder="BGC"
            className="h-12 w-full min-w-0 rounded-md border border-line bg-cream px-4 text-base font-normal uppercase focus:border-matcha-deep focus:outline-none focus:shadow-focus"
            onChange={markDirty}
          />
        </label>
      </div>

      <label className="grid gap-2 text-sm font-medium text-charcoal">
        Address
        <textarea
          name="address"
          required
          defaultValue={branch?.address}
          placeholder="High Street, Bonifacio Global City"
          className="min-h-[104px] rounded-md border border-line bg-cream px-4 py-3 text-base font-normal focus:border-matcha-deep focus:outline-none focus:shadow-focus"
          onChange={markDirty}
        />
      </label>

      <label className="grid gap-2 text-sm font-medium text-charcoal">
        Google Maps link
        <input
          name="googleMapsUrl"
          type="url"
          defaultValue={branch?.googleMapsUrl ?? ""}
          placeholder="https://maps.google.com/?q=14.5529,121.0493"
          className="h-12 w-full min-w-0 rounded-md border border-line bg-cream px-4 text-base font-normal focus:border-matcha-deep focus:outline-none focus:shadow-focus"
          onChange={markDirty}
        />
      </label>

      <div className="grid gap-2">
        <span className="text-sm font-medium text-charcoal">Status</span>
        <button
          type="button"
          role="switch"
          aria-checked={active}
          onClick={toggleActive}
          className="flex min-h-[60px] items-center justify-between gap-4 rounded-md border border-line bg-milk px-4 text-left transition-colors duration-fast ease-out-soft hover:border-matcha-deep focus:outline-none focus:shadow-focus"
        >
          <span>
            <span className="block text-base font-medium text-charcoal">
              {active ? "Open" : "Closed"}
            </span>
            <span className="block text-sm text-ink-muted">
              {active ? "Branch is available to cashiers and rewards." : "Branch is hidden from active workflows."}
            </span>
          </span>
          <span
            aria-hidden="true"
            className={clsx(
              "relative h-8 w-14 shrink-0 rounded-pill border transition-colors duration-fast ease-out-soft",
              active ? "border-matcha-deep bg-matcha-deep" : "border-line bg-line-soft"
            )}
          >
            <span
              className={clsx(
                "absolute top-1 h-6 w-6 rounded-full bg-cream shadow-sm transition-transform duration-fast ease-out-soft",
                active ? "translate-x-6" : "translate-x-1"
              )}
            />
          </span>
        </button>
      </div>

      <div className="flex justify-end gap-3">
        <Button href="/manager/branches" variant="secondary">Cancel</Button>
        <Button type="submit" variant={dirty ? "primary" : "secondary"} disabled={isEdit && !dirty}>
          {isEdit ? "Save branch" : "Create branch"}
        </Button>
      </div>
    </form>
  );
}
