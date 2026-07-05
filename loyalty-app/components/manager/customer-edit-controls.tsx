"use client";

import { useState, type FormEvent } from "react";
import { clsx } from "clsx";
import { adjustCustomerPoints, setCustomerActive } from "@/app/manager/actions";
import { Button } from "@/components/shared/button";
import { ToastActionForm } from "@/components/shared/toast-action-form";

const inputClass =
  "rounded-md border border-line bg-cream px-4 py-3 focus:border-matcha-deep focus:outline-none focus:shadow-focus";

function cleanPointsInput(value: string) {
  const compact = value.replace(/[^\d-]/g, "");
  return compact.startsWith("-")
    ? `-${compact.slice(1).replace(/-/g, "")}`
    : compact.replace(/-/g, "");
}

function validPointDelta(value: string) {
  if (!/^-?\d+$/.test(value)) return false;
  return Number(value) !== 0;
}

export function CustomerPointsAdjuster({ customerId }: { customerId: string }) {
  const [pointsDelta, setPointsDelta] = useState("");
  const [reason, setReason] = useState("");
  const canSubmit = validPointDelta(pointsDelta) && reason.trim().length > 0;

  function preventInvalidSubmit(event: FormEvent<HTMLFormElement>) {
    if (!canSubmit) event.preventDefault();
  }

  return (
    <ToastActionForm
      action={adjustCustomerPoints}
      successTitle="Points adjusted"
      successMessage="The member balance and ledger were updated."
      errorTitle="Could not adjust points"
      onSubmit={preventInvalidSubmit}
      onSuccess={() => {
        setPointsDelta("");
        setReason("");
      }}
      refreshOnSuccess={false}
      className="grid gap-3 sm:grid-cols-[160px_1fr_auto]"
    >
      <input type="hidden" name="id" value={customerId} />
      <label className="grid gap-2 text-sm font-medium text-charcoal">
        Points
        <input
          name="pointsDelta"
          type="text"
          inputMode="numeric"
          value={pointsDelta}
          onChange={(event) => setPointsDelta(cleanPointsInput(event.target.value))}
          className={clsx(inputClass, "counter")}
          placeholder="50 or -20"
        />
      </label>
      <label className="grid gap-2 text-sm font-medium text-charcoal">
        Reason
        <input
          name="reason"
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          className={inputClass}
          placeholder="Reason for adjustment"
        />
      </label>
      <div className="flex items-end">
        {canSubmit ? <Button type="submit">Apply</Button> : null}
      </div>
    </ToastActionForm>
  );
}

export function CustomerStatusToggle({
  customerId,
  initialActive
}: {
  customerId: string;
  initialActive: boolean;
}) {
  const [active, setActive] = useState(initialActive);
  const nextActive = !active;

  return (
    <ToastActionForm
      action={setCustomerActive}
      successTitle={nextActive ? "Member activated" : "Member deactivated"}
      errorTitle="Could not update member status"
      onSuccess={() => setActive((current) => !current)}
      refreshOnSuccess={false}
      className="flex flex-wrap items-center justify-between gap-4"
    >
      <input type="hidden" name="id" value={customerId} />
      <input type="hidden" name="active" value={String(nextActive)} />
      <div className="flex min-w-0 items-center gap-3">
        <h2 className="font-sans text-[17px] font-bold leading-6 tracking-tight text-charcoal">
          Status
        </h2>
        <span className={clsx(
          "rounded-pill px-3 py-1 text-xs font-medium",
          active ? "bg-sage-wash text-matcha-deep" : "bg-line-soft text-ink-muted"
        )}>
          {active ? "Activated" : "Deactivated"}
        </span>
      </div>
      <button
        type="submit"
        role="switch"
        aria-checked={active}
        aria-label={active ? "Deactivate member" : "Activate member"}
        className={clsx(
          "relative h-8 w-14 shrink-0 rounded-pill border transition-colors duration-fast ease-out-soft focus:outline-none focus:shadow-focus",
          active ? "border-matcha-deep bg-matcha-deep" : "border-line bg-line-soft"
        )}
      >
        <span
          className={clsx(
            "absolute top-1 h-6 w-6 rounded-pill bg-cream shadow-sm transition-transform duration-fast ease-out-soft",
            active ? "translate-x-7" : "translate-x-1"
          )}
        />
      </button>
    </ToastActionForm>
  );
}
