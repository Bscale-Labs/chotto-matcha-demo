"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { setStaffActive } from "@/app/manager/actions";
import { ToastActionForm } from "@/components/shared/toast-action-form";

export function StaffStatusToggle({
  staffProfileId,
  initialActive
}: {
  staffProfileId: string;
  initialActive: boolean;
}) {
  const [active, setActive] = useState(initialActive);
  const nextActive = !active;

  return (
    <ToastActionForm
      action={setStaffActive}
      successTitle={nextActive ? "Staff activated" : "Staff deactivated"}
      errorTitle="Could not update staff status"
      onSuccess={() => setActive((current) => !current)}
      refreshOnSuccess={false}
      className="flex flex-wrap items-center justify-between gap-4"
    >
      <input type="hidden" name="id" value={staffProfileId} />
      <input type="hidden" name="active" value={String(nextActive)} />
      <div className="flex min-w-0 items-center gap-3">
        <h2 className="font-sans text-[17px] font-bold leading-6 tracking-tight text-charcoal">
          Status
        </h2>
        <span
          className={clsx(
            "rounded-pill px-3 py-1 text-xs font-medium",
            active ? "bg-sage-wash text-matcha-deep" : "bg-line-soft text-ink-muted"
          )}
        >
          {active ? "Activated" : "Deactivated"}
        </span>
      </div>
      <button
        type="submit"
        role="switch"
        aria-checked={active}
        aria-label={active ? "Deactivate staff" : "Activate staff"}
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
    </ToastActionForm>
  );
}
