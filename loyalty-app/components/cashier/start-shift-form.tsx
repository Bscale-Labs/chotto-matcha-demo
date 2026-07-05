"use client";

import { useState } from "react";
import { ArrowRight, Delete, KeyRound } from "lucide-react";
import { startCashierShift } from "@/app/cashier/actions";
import { Button } from "@/components/shared/button";
import { CustomerAvatar } from "@/components/cashier/cashier-visuals";
import { PinInput } from "@/components/shared/pin-input";
import { staffRoleLabel } from "@/lib/roles/staff";

const DIGITS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

type CashierOption = {
  profile: {
    id: string;
    name: string;
  };
  detail: {
    role: string;
  };
  branch: {
    name: string;
  };
};

export function StartShiftForm({
  cashiers,
  showPinError = false
}: {
  cashiers: CashierOption[];
  showPinError?: boolean;
}) {
  const preferredCashier = cashiers.find(({ profile }) => profile.name === "Mika Reyes") ?? cashiers[0];
  const orderedCashiers = preferredCashier
    ? [preferredCashier, ...cashiers.filter(({ profile }) => profile.id !== preferredCashier.profile.id)]
    : cashiers;
  const [selectedCashierId, setSelectedCashierId] = useState(preferredCashier?.profile.id ?? "");
  const [pin, setPin] = useState("");
  const selectedCashier = cashiers.find(({ profile }) => profile.id === selectedCashierId);

  function chooseCashier(profileId: string) {
    setSelectedCashierId(profileId);
    setPin("");
  }

  function appendDigit(digit: string) {
    setPin((current) => (current.length >= 4 ? current : `${current}${digit}`));
  }

  return (
    <form action={startCashierShift} className="mt-7 grid gap-5 lg:grid-cols-[1fr_184px]">
      <div className="grid gap-3">
        {orderedCashiers.map(({ profile, detail, branch }) => {
          const selected = selectedCashierId === profile.id;
          return (
            <label
              key={profile.id}
              className="gloss flex min-h-[84px] cursor-pointer items-center gap-4 rounded-lg border border-line-soft bg-milk p-4 transition-colors duration-fast ease-out-soft hover:border-matcha-deep has-[:checked]:border-matcha-deep has-[:checked]:bg-sage-wash"
            >
              <CustomerAvatar name={profile.name} className="h-12 w-12" />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium text-charcoal">{profile.name}</span>
                <span className="mt-1 block truncate text-xs text-ink-muted">
                  {staffRoleLabel(detail.role)} · {branch.name}
                </span>
              </span>
              <input
                type="radio"
                name="staffProfileId"
                value={profile.id}
                checked={selected}
                onChange={() => chooseCashier(profile.id)}
                className="h-4 w-4 accent-[var(--matcha-deep)]"
              />
            </label>
          );
        })}
      </div>

      <div className="surface-paper rounded-md p-3.5">
        <PinInput
          name="pin"
          label="Enter PIN"
          hint="4 digits"
          value={pin}
          onValueChange={setPin}
          className="[&>span:first-of-type]:text-xs [&>span:first-of-type]:font-semibold [&>span:first-of-type]:uppercase [&>span:first-of-type]:tracking-eyebrow [&>span:first-of-type]:text-ink-muted"
        />
        <div className="mt-3 grid grid-cols-3 gap-2">
          {DIGITS.map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => appendDigit(digit)}
              className="grid h-11 place-items-center rounded-sm border border-line bg-cream text-sm font-medium text-charcoal transition-colors hover:border-matcha-deep hover:bg-sage-wash"
            >
              {digit}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPin("")}
            className="grid h-11 place-items-center rounded-sm border border-line bg-cream text-sm font-medium text-charcoal transition-colors hover:border-matcha-deep hover:bg-sage-wash"
          >
            C
          </button>
          <button
            type="button"
            onClick={() => appendDigit("0")}
            className="grid h-11 place-items-center rounded-sm border border-line bg-cream text-sm font-medium text-charcoal transition-colors hover:border-matcha-deep hover:bg-sage-wash"
          >
            0
          </button>
          <button
            type="button"
            onClick={() => setPin((current) => current.slice(0, -1))}
            className="grid h-11 place-items-center rounded-sm border border-line bg-cream text-charcoal transition-colors hover:border-matcha-deep hover:bg-sage-wash"
          >
            <Delete className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>
        <Button
          type="submit"
          icon={selectedCashier ? ArrowRight : KeyRound}
          disabled={!selectedCashier || pin.length !== 4}
          className="mt-3 w-full px-4"
        >
          Enter
        </Button>
      </div>

      {cashiers.length === 0 ? <p className="text-sm text-error-text">No active cashier accounts are available.</p> : null}
      {showPinError ? <p className="text-sm text-error-text lg:col-span-2">Select a cashier and enter a valid 4-digit PIN.</p> : null}
    </form>
  );
}
