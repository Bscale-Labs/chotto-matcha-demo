"use client";

import { useState } from "react";
import { KeyRound } from "lucide-react";
import { startCashierShift } from "@/app/cashier/actions";
import { Button } from "@/components/shared/button";

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
  const [selectedCashierId, setSelectedCashierId] = useState("");
  const selectedCashier = cashiers.find(({ profile }) => profile.id === selectedCashierId);

  return (
    <form action={startCashierShift} className="mt-7 grid gap-5">
      <div className="grid gap-3">
        {cashiers.map(({ profile, branch }) => (
          <label
            key={profile.id}
            className="flex cursor-pointer items-center justify-between gap-4 rounded-md border border-line-soft bg-stone/35 p-4 transition-colors duration-fast ease-out-soft hover:border-matcha-deep has-[:checked]:border-matcha-deep has-[:checked]:bg-sage-wash"
          >
            <span>
              <span className="block font-medium text-charcoal">{profile.name}</span>
              <span className="mt-1 block text-xs text-ink-muted">{branch.name}</span>
            </span>
            <input
              type="radio"
              name="staffProfileId"
              value={profile.id}
              checked={selectedCashierId === profile.id}
              onChange={() => setSelectedCashierId(profile.id)}
              className="h-4 w-4 accent-[var(--matcha-deep)]"
            />
          </label>
        ))}
      </div>

      {selectedCashier ? (
        <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
          <label className="grid gap-2 text-sm font-medium text-charcoal">
            PIN for {selectedCashier.profile.name}
            <input
              name="pin"
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="off"
              autoFocus
              className="h-12 rounded-md border border-line bg-cream px-4 text-base focus:border-matcha-deep focus:outline-none focus:shadow-focus"
              placeholder="••••"
            />
          </label>
          <Button type="submit" icon={KeyRound}>
            Enter cashier
          </Button>
        </div>
      ) : null}

      {cashiers.length === 0 ? <p className="text-sm text-error-text">No active cashier accounts are available.</p> : null}
      {showPinError ? <p className="text-sm text-error-text">Select a cashier and enter a valid PIN.</p> : null}
    </form>
  );
}
