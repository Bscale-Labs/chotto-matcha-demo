import { CheckCircle2, Leaf } from "lucide-react";
import { Button } from "@/components/shared/button";
import { Eyebrow } from "@/components/shared/eyebrow";
import { CashierShell } from "@/components/cashier/cashier-shell";
import { calculateEarnedPoints } from "@/lib/points";
import { formatPeso, formatPoints } from "@/lib/formatters";
import { getCustomer, orgConfig } from "@/lib/mock-data";

export default function CashierAwardPage() {
  const customer = getCustomer();
  const billTotal = 420;
  const points = calculateEarnedPoints(billTotal, orgConfig.earnRate);

  return (
    <CashierShell>
      <section className="rounded-lg border border-line-soft bg-cream p-7">
        <Eyebrow className="text-matcha-deep">Award leaves</Eyebrow>
        <h1 className="mt-3 font-display text-[40px] font-medium leading-[44px] text-charcoal">
          {customer.name}
        </h1>
        <div className="mt-7 grid gap-4 md:grid-cols-2">
          <div className="rounded-md border border-line-soft bg-stone/40 p-5">
            <p className="eyebrow text-ink-muted">Bill total</p>
            <p className="mt-3 font-display text-[40px] font-medium leading-none text-charcoal">
              {formatPeso(billTotal)}
            </p>
          </div>
          <div className="relative overflow-hidden rounded-md bg-matcha-deep p-5 text-cream">
            <Leaf
              className="pointer-events-none absolute -right-4 top-1/2 h-32 w-32 -translate-y-1/2 text-cream/15"
              strokeWidth={1.2}
              aria-hidden="true"
            />
            <p className="eyebrow relative text-cream/70">Leaves to award</p>
            <p className="counter relative mt-3 font-display text-[40px] font-medium leading-none">
              +{formatPoints(points)}
            </p>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href="/cashier/identify" icon={CheckCircle2}>
            Confirm award
          </Button>
          <Button href="/cashier/customer/cust-lia" variant="secondary">
            Back
          </Button>
        </div>
      </section>
    </CashierShell>
  );
}
