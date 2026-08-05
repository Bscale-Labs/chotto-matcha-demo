"use client";

import { useActionState } from "react";
import { updateCustomerProfile, type ProfileState } from "@/app/customer/actions";
import { Button } from "@/components/shared/button";
import { Input } from "@/components/shared/input";

const initialState: ProfileState = {};

export function ProfileEditForm({
  defaultName,
  defaultPhone,
  email
}: {
  defaultName: string;
  defaultPhone: string;
  email: string;
}) {
  const [state, formAction, pending] = useActionState(updateCustomerProfile, initialState);

  return (
    <form action={formAction} className="grid gap-4">
      <Input label="Name" name="name" autoComplete="name" defaultValue={defaultName} required />
      <Input label="Phone" name="phone" type="tel" autoComplete="tel" defaultValue={defaultPhone} required />
      <Input label="Email" name="email" type="email" defaultValue={email} disabled hint="Email can’t be changed yet" />
      {state.error ? <p className="text-xs leading-[18px] text-error-text">{state.error}</p> : null}
      <Button type="submit" disabled={pending} className="mt-2 w-full">
        {pending ? "Saving..." : "Save changes"}
      </Button>
    </form>
  );
}
