"use client";

import { useEffect, useState } from "react";
import { clsx } from "clsx";
import { createBranch, updateBranch } from "@/app/manager/actions";
import { Button } from "@/components/shared/button";
import {
  DirtyFieldsProvider,
  DirtySaveButton,
  TrackedInput,
  TrackedTextarea,
  useDirtyFields
} from "@/components/shared/dirty-form";

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

const inputClass =
  "h-12 w-full min-w-0 rounded-md border border-line bg-cream px-4 text-base font-normal focus:border-matcha-deep focus:outline-none focus:shadow-focus";

export function BranchDetailsForm(props: BranchDetailsFormProps) {
  const isEdit = props.mode === "edit";
  const branch = isEdit ? props.branch : null;
  const initialActive = branch?.active ?? true;
  const [active, setActive] = useState(initialActive);
  const { ctx, report } = useDirtyFields(props.mode);

  // The status switch isn't a field, so it reports its own dirtiness.
  useEffect(() => {
    report("branch-active", active !== initialActive);
  }, [active, initialActive, report]);

  return (
    <DirtyFieldsProvider value={ctx}>
      <form
        action={isEdit ? updateBranch : createBranch}
        className="surface-paper grid max-w-2xl gap-5 rounded-lg p-6"
      >
        {branch ? <input type="hidden" name="id" value={branch.id} /> : null}
        <input type="hidden" name="active" value={active ? "true" : "false"} />

        <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_160px]">
          <label htmlFor="branch-name" className="grid min-w-0 gap-2 text-sm font-medium text-charcoal">
            Branch name
            <TrackedInput
              id="branch-name"
              name="name"
              required
              defaultValue={branch?.name}
              placeholder="BGC Matcha Bar"
              className={inputClass}
            />
          </label>
          <label htmlFor="branch-code" className="grid min-w-0 gap-2 text-sm font-medium text-charcoal">
            Branch code
            <TrackedInput
              id="branch-code"
              name="code"
              defaultValue={branch?.code ?? ""}
              placeholder="BGC"
              className={clsx(inputClass, "uppercase")}
            />
          </label>
        </div>

        <label htmlFor="branch-address" className="grid gap-2 text-sm font-medium text-charcoal">
          Address
          <TrackedTextarea
            id="branch-address"
            name="address"
            required
            defaultValue={branch?.address}
            placeholder="High Street, Bonifacio Global City"
            className="min-h-[104px] rounded-md border border-line bg-cream px-4 py-3 text-base font-normal focus:border-matcha-deep focus:outline-none focus:shadow-focus"
          />
        </label>

        <label htmlFor="branch-google-maps-url" className="grid gap-2 text-sm font-medium text-charcoal">
          Google Maps link
          <TrackedInput
            id="branch-google-maps-url"
            name="googleMapsUrl"
            type="url"
            defaultValue={branch?.googleMapsUrl ?? ""}
            placeholder="https://maps.google.com/?q=14.5529,121.0493"
            className={inputClass}
          />
        </label>

        <div className="flex flex-wrap items-center justify-between gap-4 rounded-md border border-line-soft bg-cream px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="text-sm font-medium text-charcoal">Status</span>
            <span
              className={clsx(
                "rounded-pill px-3 py-1 text-xs font-medium",
                active ? "bg-sage-wash text-matcha-deep" : "bg-line-soft text-ink-muted"
              )}
            >
              {active ? "Open" : "Closed"}
            </span>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={active}
            aria-label={active ? "Close branch" : "Open branch"}
            onClick={() => setActive((current) => !current)}
            className={clsx(
              "relative h-8 w-14 shrink-0 rounded-pill border transition-colors duration-fast ease-out-soft focus:outline-none focus:shadow-focus",
              active ? "border-matcha-deep bg-matcha-deep" : "border-line bg-line-soft"
            )}
          >
            <span
              className={clsx(
                "absolute left-1 top-1 h-6 w-6 rounded-pill bg-cream shadow-sm transition-transform duration-fast ease-out-soft",
                active && "translate-x-6"
              )}
            />
          </button>
        </div>

        <div className="flex justify-end gap-3">
          <Button href="/manager/branches" variant="secondary">Cancel</Button>
          <DirtySaveButton pendingLabel={isEdit ? "Saving…" : "Creating…"}>
            {isEdit ? "Save branch" : "Create branch"}
          </DirtySaveButton>
        </div>
      </form>
    </DirtyFieldsProvider>
  );
}
