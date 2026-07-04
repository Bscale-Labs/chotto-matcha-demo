"use client";

import { useState } from "react";
import { ArrowRight, Delete, KeyRound } from "lucide-react";
import { startCashierShift } from "@/app/cashier/actions";
import { Button } from "@/components/shared/button";
import { CustomerAvatar } from "@/components/cashier/cashier-visuals";

type CashierOption = {
  profile: {
    id: string;
    name: string;
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
  const digits = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

  function chooseCashier(profileId: string) {
    setSelectedCashierId(profileId);
    setPin("");
  }

  function appendDigit(digit: string) {
    setPin((current) => (current.length >= 6 ? current : `${current}${digit}`));
  }

  return (
    <form action={startCashierShift} className="mt-7 grid gap-5 lg:grid-cols-[1fr_184px]">
      <div className="grid gap-3">
        {orderedCashiers.map(({ profile, branch }) => {
          const selected = selectedCashierId === profile.id;
          return (
            <label
              key={profile.id}
              className="gloss flex min-h-[84px] cursor-pointer items-center gap-4 rounded-lg border border-line-soft bg-milk p-4 transition-colors duration-fast ease-out-soft hover:border-matcha-deep has-[:checked]:border-matcha-deep has-[:checked]:bg-sage-wash"
            >
              <CustomerAvatar name={profile.name} className="h-12 w-12" />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium text-charcoal">{profile.name}</span>
                <span className="mt-1 block truncate text-xs text-ink-muted">{branch.name}</span>
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

      <div className="rounded-md border border-line-soft bg-milk p-3.5 shadow-sm">
        <label className="grid gap-2 text-xs font-semibold uppercase tracking-eyebrow text-ink-muted">
          Enter PIN
          <input
            name="pin"
            type="password"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="off"
            autoFocus
            value={pin}
            onChange={(event) => setPin(event.target.value.replace(/\D/g, "").slice(0, 6))}
            className="h-12 w-full min-w-0 rounded-md border border-line bg-cream px-4 text-center text-lg tracking-[0.4em] text-charcoal focus:border-matcha-deep focus:outline-none focus:shadow-focus"
            placeholder="••••"
          />
        </label>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {digits.map((digit) => (
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
          disabled={!selectedCashier || pin.length === 0}
          className="mt-3 w-full px-4"
        >
          Enter
        </Button>
      </div>

      {cashiers.length === 0 ? <p className="text-sm text-error-text">No active cashier accounts are available.</p> : null}
      {showPinError ? <p className="text-sm text-error-text lg:col-span-2">Select a cashier and enter a valid PIN.</p> : null}
    </form>
  );
}
