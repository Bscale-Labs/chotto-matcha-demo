"use client";

import { useActionState, useState, type FormEvent } from "react";
import { clsx } from "clsx";
import { KeyRound, Mail } from "lucide-react";
import {
  adjustBranchCustomerPoints,
  createBranchCustomerAccount,
  createBranchStaffAccount,
  setBranchCustomerActive,
  setBranchStaffActive,
  type CreateAccountState
} from "@/app/cashier/actions";
import { Button } from "@/components/shared/button";
import {
  DirtyForm,
  DirtySaveButton,
  TrackedInput,
  TrackedPinInput,
  TrackedSelect
} from "@/components/shared/dirty-form";
import { Input } from "@/components/shared/input";
import { Pill } from "@/components/shared/pill";
import { PinInput } from "@/components/shared/pin-input";
import { Select } from "@/components/shared/select";
import { ToastActionForm } from "@/components/shared/toast-action-form";
import { staffRoleLabel, type BranchShiftRole } from "@/lib/roles/staff";

const initialState: CreateAccountState = {};
const branchRoleOptions = [
  { value: "branch_manager", label: staffRoleLabel("branch_manager") },
  { value: "cashier", label: staffRoleLabel("cashier") }
];
const inputClass =
  "rounded-md border border-line bg-cream px-4 py-3 focus:border-matcha-deep focus:outline-none focus:shadow-focus";
const lockedInputClass =
  "cursor-not-allowed rounded-md border border-line bg-stone px-4 py-3 text-ink-muted focus:outline-none";

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

function AccountCreateResult({ state }: { state: CreateAccountState }) {
  return (
    <>
      {state.error ? <p className="text-sm text-error-text">{state.error}</p> : null}
      {state.temporaryPassword ? (
        <div className="rounded-md border border-sage-tint bg-sage-wash p-4">
          <Pill icon={KeyRound}>Temporary password</Pill>
          <p className="mt-3 font-mono text-sm text-charcoal">{state.temporaryPassword}</p>
          {state.customerCode ? (
            <p className="mt-2 font-mono text-sm uppercase tracking-[0.08em] text-matcha-deep">
              {state.customerCode}
            </p>
          ) : null}
          <p className="mt-2 text-xs text-ink-muted">{state.email} can sign in with this password.</p>
        </div>
      ) : null}
      {state.invitationSent ? (
        <div className="rounded-md border border-sage-tint bg-sage-wash p-4">
          <Pill icon={Mail}>Invitation email sent</Pill>
          <p className="mt-3 text-sm text-charcoal">{state.email} can sign in with the secure link.</p>
        </div>
      ) : null}
      {state.invitationFailed ? (
        <div className="rounded-md border border-error-border bg-cream p-4">
          <Pill tone="warn">Account created</Pill>
          <p className="mt-3 text-sm text-charcoal">
            {state.email} was created, but the invitation email could not be sent.
          </p>
        </div>
      ) : null}
    </>
  );
}

export function BranchStaffCreateForm() {
  const [state, formAction, pending] = useActionState(createBranchStaffAccount, initialState);

  return (
    <form action={formAction} className="grid gap-4">
      <Input label="Name" name="name" required />
      <Input label="Email" name="email" type="email" required />
      <label htmlFor="branch-staff-role" className="grid gap-2 text-sm font-medium text-charcoal">
        Role
        <Select id="branch-staff-role" name="branchRole" defaultValue="cashier" options={branchRoleOptions} />
      </label>
      <PinInput label="Cashier / branch manager PIN" name="pin" hint="Enter exactly 4 digits." />
      <AccountCreateResult state={state} />
      <div className="flex justify-end gap-3">
        <Button href="/cashier/accounts" variant="secondary">Cancel</Button>
        <Button type="submit" disabled={pending}>
          {pending ? "Creating..." : "Create account"}
        </Button>
      </div>
    </form>
  );
}

export function BranchStaffEditFields({
  action,
  staff
}: {
  action: (formData: FormData) => void | Promise<void>;
  staff: {
    id: string;
    name: string;
    email: string;
    role: BranchShiftRole;
  };
}) {
  return (
    <DirtyForm mode="edit" action={action} className="surface-paper grid max-w-2xl gap-4 rounded-lg p-6">
      <input type="hidden" name="id" value={staff.id} />
      <label htmlFor="branch-staff-name" className="grid gap-2 text-sm font-medium text-charcoal">
        Name
        <TrackedInput id="branch-staff-name" name="name" required defaultValue={staff.name} className={inputClass} />
      </label>
      <label htmlFor="branch-staff-email" className="grid gap-2 text-sm font-medium text-charcoal">
        Email
        <TrackedInput
          id="branch-staff-email"
          name="email"
          readOnly
          type="email"
          defaultValue={staff.email}
          className={lockedInputClass}
          aria-describedby="branch-staff-email-lock"
        />
        <span id="branch-staff-email-lock" className="text-xs font-normal text-ink-muted">
          Bound to this staff member&apos;s login.
        </span>
      </label>
      <label htmlFor="branch-staff-role-edit" className="grid gap-2 text-sm font-medium text-charcoal">
        Role
        <TrackedSelect
          id="branch-staff-role-edit"
          name="branchRole"
          defaultValue={staff.role}
          options={branchRoleOptions}
        />
      </label>
      <TrackedPinInput
        id="branch-staff-pin"
        name="pin"
        label="Cashier / branch manager PIN"
        hint="Enter exactly 4 digits. Leave empty to keep current."
      />
      <div className="flex justify-end gap-3">
        <Button href="/cashier/accounts" variant="secondary">Cancel</Button>
        <DirtySaveButton pendingLabel="Saving...">Save account</DirtySaveButton>
      </div>
    </DirtyForm>
  );
}

export function BranchStaffStatusToggle({
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
      action={setBranchStaffActive}
      successTitle={nextActive ? "Staff activated" : "Staff deactivated"}
      errorTitle="Could not update staff status"
      onSuccess={() => setActive((current) => !current)}
      refreshOnSuccess={false}
      className="flex flex-wrap items-center justify-between gap-4"
    >
      <input type="hidden" name="id" value={staffProfileId} />
      <input type="hidden" name="active" value={String(nextActive)} />
      <div className="flex min-w-0 items-center gap-3">
        <h2 className="font-sans text-[17px] font-bold leading-6 tracking-tight text-charcoal">Status</h2>
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

export function BranchCustomerCreateForm() {
  const [state, formAction, pending] = useActionState(createBranchCustomerAccount, initialState);

  return (
    <form action={formAction} className="grid gap-4">
      <Input label="Name" name="name" required />
      <Input label="Email" name="email" type="email" required />
      <Input label="Phone" name="phone" type="tel" required />
      <AccountCreateResult state={state} />
      <div className="flex justify-end gap-3">
        <Button href="/cashier/customers" variant="secondary">Cancel</Button>
        <Button type="submit" disabled={pending}>
          {pending ? "Creating..." : "Create customer"}
        </Button>
      </div>
    </form>
  );
}

export function BranchCustomerEditFields({
  action,
  customer
}: {
  action: (formData: FormData) => void | Promise<void>;
  customer: {
    id: string;
    name: string;
    code: string;
    email: string;
    phone: string;
  };
}) {
  return (
    <DirtyForm mode="edit" action={action} className="surface-paper grid max-w-2xl gap-4 rounded-lg p-6">
      <input type="hidden" name="id" value={customer.id} />
      <label htmlFor="branch-customer-name" className="grid gap-2 text-sm font-medium text-charcoal">
        Name
        <TrackedInput
          id="branch-customer-name"
          name="name"
          required
          defaultValue={customer.name}
          className={inputClass}
        />
      </label>
      <label htmlFor="branch-customer-code" className="grid gap-2 text-sm font-medium text-charcoal">
        Customer code
        <TrackedInput
          id="branch-customer-code"
          name="code"
          readOnly
          defaultValue={customer.code}
          className={lockedInputClass}
          aria-describedby="branch-customer-code-lock"
        />
        <span id="branch-customer-code-lock" className="text-xs font-normal text-ink-muted">
          Used for QR scans and transaction search.
        </span>
      </label>
      <label htmlFor="branch-customer-email" className="grid gap-2 text-sm font-medium text-charcoal">
        Email
        <TrackedInput
          id="branch-customer-email"
          name="email"
          readOnly
          type="email"
          defaultValue={customer.email}
          className={lockedInputClass}
          aria-describedby="branch-customer-email-lock"
        />
        <span id="branch-customer-email-lock" className="text-xs font-normal text-ink-muted">
          Bound to this member&apos;s login.
        </span>
      </label>
      <label htmlFor="branch-customer-phone" className="grid gap-2 text-sm font-medium text-charcoal">
        Phone number
        <TrackedInput
          id="branch-customer-phone"
          name="phone"
          required
          type="tel"
          defaultValue={customer.phone}
          className={inputClass}
        />
      </label>
      <div className="flex justify-end gap-3">
        <Button href="/cashier/customers" variant="secondary">Cancel</Button>
        <DirtySaveButton pendingLabel="Saving...">Save customer</DirtySaveButton>
      </div>
    </DirtyForm>
  );
}

export function BranchCustomerPointsAdjuster({ customerId }: { customerId: string }) {
  const [pointsDelta, setPointsDelta] = useState("");
  const [reason, setReason] = useState("");
  const canSubmit = validPointDelta(pointsDelta) && reason.trim().length > 0;

  function preventInvalidSubmit(event: FormEvent<HTMLFormElement>) {
    if (!canSubmit) event.preventDefault();
  }

  return (
    <ToastActionForm
      action={adjustBranchCustomerPoints}
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

export function BranchCustomerStatusToggle({
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
      action={setBranchCustomerActive}
      successTitle={nextActive ? "Member activated" : "Member deactivated"}
      errorTitle="Could not update member status"
      onSuccess={() => setActive((current) => !current)}
      refreshOnSuccess={false}
      className="flex flex-wrap items-center justify-between gap-4"
    >
      <input type="hidden" name="id" value={customerId} />
      <input type="hidden" name="active" value={String(nextActive)} />
      <div className="flex min-w-0 items-center gap-3">
        <h2 className="font-sans text-[17px] font-bold leading-6 tracking-tight text-charcoal">Status</h2>
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
        aria-label={active ? "Deactivate member" : "Activate member"}
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
