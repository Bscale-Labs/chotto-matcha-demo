"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, Delete } from "lucide-react";
import { awardCustomerPoints } from "@/app/cashier/actions";
import { Button } from "@/components/shared/button";
import { TeaStillLife } from "@/components/cashier/cashier-visuals";
import { calculateEarnedPoints } from "@/lib/points";
import { formatPeso, formatPoints } from "@/lib/formatters";

type AwardPointsFormProps = {
  customerId: string;
  earnRate: number;
  initialBillTotal?: number;
  showBillError?: boolean;
};

export function AwardPointsForm({
  customerId,
  earnRate,
  initialBillTotal = 420,
  showBillError = false
}: AwardPointsFormProps) {
  const [billTotal, setBillTotal] = useState(initialBillTotal.toString());
  const numericBillTotal = Number(billTotal);
  const safeBillTotal = Number.isFinite(numericBillTotal) && numericBillTotal > 0 ? numericBillTotal : 0;
  const points = useMemo(() => calculateEarnedPoints(safeBillTotal, earnRate), [earnRate, safeBillTotal]);
  const digits = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

  function appendDigit(digit: string) {
    setBillTotal((current) => {
      const normalized = current === "0" ? "" : current;
      return `${normalized}${digit}`.slice(0, 7);
    });
  }

  return (
    <form action={awardCustomerPoints} className="mt-6">
        <input type="hidden" name="customerId" value={customerId} />
      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <div className="surface-paper rounded-md p-4">
          <label className="grid gap-2 text-xs font-semibold uppercase tracking-eyebrow text-ink-muted">
            Bill total
            <input
              name="billTotal"
              type="number"
              min="1"
              step="0.01"
              value={billTotal}
              onChange={(event) => setBillTotal(event.target.value)}
              className="h-14 w-full min-w-0 rounded-md border border-line bg-cream px-4 text-[28px] font-medium tracking-tight text-charcoal focus:border-matcha-deep focus:outline-none focus:shadow-focus"
            />
          </label>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {digits.map((digit) => (
              <button
                key={digit}
                type="button"
                onClick={() => appendDigit(digit)}
                className="grid h-12 place-items-center rounded-sm border border-line bg-cream font-medium text-charcoal transition-colors hover:border-matcha-deep hover:bg-sage-wash"
              >
                {digit}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setBillTotal("")}
              className="grid h-12 place-items-center rounded-sm border border-line bg-cream font-medium text-charcoal transition-colors hover:border-matcha-deep hover:bg-sage-wash"
            >
              C
            </button>
            <button
              type="button"
              onClick={() => appendDigit("0")}
              className="grid h-12 place-items-center rounded-sm border border-line bg-cream font-medium text-charcoal transition-colors hover:border-matcha-deep hover:bg-sage-wash"
            >
              0
            </button>
            <button
              type="button"
              onClick={() => setBillTotal((current) => current.slice(0, -1))}
              className="grid h-12 place-items-center rounded-sm border border-line bg-cream text-charcoal transition-colors hover:border-matcha-deep hover:bg-sage-wash"
            >
              <Delete className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="surface-paper rounded-md p-5">
              <p className="eyebrow text-ink-muted">Bill total</p>
              <p className="counter mt-4 text-[40px] font-semibold leading-none tracking-tight text-charcoal">
                {formatPeso(safeBillTotal)}
              </p>
            </div>
            <div className="cashier-points-panel rounded-md p-5">
              <p className="eyebrow relative text-cream/85">Points to award</p>
              <p className="counter relative mt-4 text-[40px] font-semibold leading-none tracking-tight">
                +{formatPoints(points)}
              </p>
              <p className="relative mt-2 text-sm text-cream/85">1 point per {formatPeso(1 / earnRate)}</p>
              <TeaStillLife className="pointer-events-none absolute bottom-0 right-0 h-full w-[46%] opacity-65 [mask-image:linear-gradient(90deg,transparent,black_34%)]" />
            </div>
          </div>

          <div className="surface-paper rounded-md p-5">
            <dl className="grid gap-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-ink-muted">Bill total</dt>
                <dd className="counter font-medium text-charcoal">{formatPeso(safeBillTotal)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-muted">Points rate</dt>
                <dd className="counter font-medium text-charcoal">{earnRate} pt per ₱1</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-muted">Points to award</dt>
                <dd className="counter font-semibold text-matcha-deep">+{formatPoints(points)} pts</dd>
              </div>
            </dl>
          </div>

          <div className="sticky bottom-4 z-20">
            <div className="surface-glass grid gap-3 rounded-pill p-1.5 sm:grid-cols-[1fr_180px]">
              <Button type="submit" size="lg" icon={CheckCircle2} disabled={safeBillTotal <= 0}>
                Confirm award
              </Button>
              <Button href={`/cashier/customer/${customerId}`} variant="secondary" size="lg" icon={ArrowLeft}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
        {showBillError ? (
          <p className="text-sm text-error-text lg:col-span-2">Enter a bill total greater than zero.</p>
        ) : null}
      </div>
    </form>
  );
}
