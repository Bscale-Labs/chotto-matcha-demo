"use client";

import { useActionState } from "react";
import { KeyRound, Mail } from "lucide-react";
import { createStaffAccount, type CreateAccountState } from "@/app/manager/actions";
import { Button } from "@/components/shared/button";
import { Input } from "@/components/shared/input";
import { Pill } from "@/components/shared/pill";
import { Select } from "@/components/shared/select";

const initialState: CreateAccountState = {};

export function StaffCreateForm({ branches }: { branches: { id: string; name: string }[] }) {
  const [state, formAction, pending] = useActionState(createStaffAccount, initialState);

  return (
    <form action={formAction} className="grid gap-4">
      <Input label="Name" name="name" required />
      <Input label="Email" name="email" type="email" required />
      <label className="grid gap-2 text-sm font-medium text-charcoal">
        Role
        <Select
          name="role"
          defaultValue="cashier"
          options={[
            { value: "cashier", label: "Cashier" },
            { value: "manager", label: "Manager" }
          ]}
        />
      </label>
      <label className="grid gap-2 text-sm font-medium text-charcoal">
        Branch
        <Select
          name="branchId"
          defaultValue=""
          options={[
            { value: "", label: "All branches / manager" },
            ...branches.map((branch) => ({ value: branch.id, label: branch.name }))
          ]}
        />
      </label>
      <Input label="Cashier PIN" name="pin" inputMode="numeric" pattern="[0-9]*" hint="Required for cashiers." />
      {state.error ? <p className="text-sm text-error-text">{state.error}</p> : null}
      {state.temporaryPassword ? (
        <div className="rounded-md border border-sage-tint bg-sage-wash p-4">
          <Pill icon={KeyRound}>Temporary password</Pill>
          <p className="mt-3 font-mono text-sm text-charcoal">{state.temporaryPassword}</p>
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
      <div className="flex justify-end gap-3">
        <Button href="/manager/staff" variant="secondary">Cancel</Button>
        <Button type="submit" disabled={pending}>
          {pending ? "Creating..." : "Create staff account"}
        </Button>
      </div>
    </form>
  );
}
