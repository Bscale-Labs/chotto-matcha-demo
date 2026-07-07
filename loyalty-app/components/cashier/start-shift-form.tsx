"use client";

import { useState } from "react";
import { ArrowRight, Delete, KeyRound } from "lucide-react";
import { startCashierShift } from "@/app/cashier/actions";
import { Button } from "@/components/shared/button";
import { CustomerAvatar } from "@/components/cashier/cashier-visuals";
import { Eyebrow } from "@/components/shared/eyebrow";
import { PinInput } from "@/components/shared/pin-input";

const DIGITS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

type CashierOption = {
  profile: {
    id: string;
    name: string;
  };
};

export function StartShiftForm({
  branchName,
  cashiers,
  showPinError = false
}: {
  branchName: string;
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
    <form action={startCashierShift} className="grid lg:min-h-[clamp(560px,72vh,660px)] lg:grid-cols-[minmax(0,1fr)_248px]">
      <div className="p-6 sm:p-8">
        <Eyebrow className="text-matcha-deep">Start shift</Eyebrow>
        <h1 className="mt-3 font-display text-[40px] font-medium leading-[44px] text-charcoal">
          {branchName}
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-6 text-ink-muted">
          Select assigned staff and enter a PIN to start serving.
        </p>

        <div className="mt-7 grid auto-rows-min content-start gap-3">
          {orderedCashiers.map(({ profile }) => {
            const selected = selectedCashierId === profile.id;
            return (
              <label
                key={profile.id}
                className="gloss flex min-h-[84px] cursor-pointer items-center gap-4 rounded-lg border border-line-soft bg-milk p-4 transition-colors duration-fast ease-out-soft hover:border-matcha-deep has-[:checked]:border-matcha-deep has-[:checked]:bg-sage-wash"
              >
                <CustomerAvatar name={profile.name} className="h-12 w-12" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium text-charcoal">{profile.name}</span>
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

        {cashiers.length === 0 ? <p className="mt-4 text-sm text-error-text">No active cashier accounts are available.</p> : null}
        {showPinError ? <p className="mt-4 text-sm text-error-text">Select a cashier and enter a valid 4-digit PIN.</p> : null}
      </div>

      <div className="flex min-h-[520px] flex-col border-t border-line-soft bg-cream p-4 lg:min-h-[clamp(560px,72vh,660px)] lg:border-l lg:border-t-0">
        <PinInput
          name="pin"
          label="Enter PIN"
          hint="4 digits"
          value={pin}
          onValueChange={setPin}
          className="[&>div]:max-w-none [&>span:first-of-type]:text-xs [&>span:first-of-type]:font-semibold [&>span:first-of-type]:uppercase [&>span:first-of-type]:tracking-eyebrow [&>span:first-of-type]:text-ink-muted [&_input]:h-14"
        />
        <div className="mt-5 grid grid-cols-3 gap-2.5">
          {DIGITS.map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => appendDigit(digit)}
              className="grid h-14 place-items-center rounded-sm border border-line bg-cream text-sm font-medium text-charcoal transition-colors hover:border-matcha-deep hover:bg-sage-wash"
            >
              {digit}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPin("")}
            className="grid h-14 place-items-center rounded-sm border border-line bg-cream text-sm font-medium text-charcoal transition-colors hover:border-matcha-deep hover:bg-sage-wash"
          >
            C
          </button>
          <button
            type="button"
            onClick={() => appendDigit("0")}
            className="grid h-14 place-items-center rounded-sm border border-line bg-cream text-sm font-medium text-charcoal transition-colors hover:border-matcha-deep hover:bg-sage-wash"
          >
            0
          </button>
          <button
            type="button"
            onClick={() => setPin((current) => current.slice(0, -1))}
            className="grid h-14 place-items-center rounded-sm border border-line bg-cream text-charcoal transition-colors hover:border-matcha-deep hover:bg-sage-wash"
          >
            <Delete className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>
        <Button
          type="submit"
          icon={selectedCashier ? ArrowRight : KeyRound}
          disabled={!selectedCashier || pin.length !== 4}
          size="lg"
          className="mt-auto w-full px-4"
        >
          Enter
        </Button>
      </div>
    </form>
  );
}
