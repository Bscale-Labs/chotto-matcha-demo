import { CheckCircle2, Leaf } from "lucide-react";
import { notFound } from "next/navigation";
import { Button } from "@/components/shared/button";
import { Eyebrow } from "@/components/shared/eyebrow";
import { CashierShell } from "@/components/cashier/cashier-shell";
import { awardCustomerPoints } from "@/app/cashier/actions";
import { calculateEarnedPoints } from "@/lib/points";
import { formatPeso, formatPoints } from "@/lib/formatters";
import { requireCashierShiftSession } from "@/lib/auth/session";
import { getCustomerById } from "@/lib/data/customers";
import { getEarnRate } from "@/lib/data/org-config";

export default async function CashierAwardPage({
  searchParams
}: {
  searchParams: Promise<{ customerId?: string }>;
}) {
  const { profile, branch } = await requireCashierShiftSession();
  const { customerId } = await searchParams;
  if (!customerId) notFound();
  const [customer, earnRate] = await Promise.all([getCustomerById(customerId), getEarnRate()]);
  if (!customer?.active) notFound();
  const billTotal = 420;
  const points = calculateEarnedPoints(billTotal, earnRate);

  return (
    <CashierShell sessionLabel={`${branch.name} · ${profile.name}`}>
      <section className="rounded-lg border border-line-soft bg-cream p-7">
        <Eyebrow className="text-matcha-deep">Award points</Eyebrow>
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
              className="pointer-events-none absolute -right-6 -top-3 h-32 w-32 text-cream/[0.08]"
              strokeWidth={1}
              fill="currentColor"
              aria-hidden="true"
            />
            <p className="eyebrow relative text-cream/70">Points to award</p>
            <p className="counter relative mt-3 font-display text-[40px] font-medium leading-none">
              +{formatPoints(points)}
            </p>
          </div>
        </div>
        <form action={awardCustomerPoints} className="mt-6 flex flex-wrap items-end gap-3">
          <input type="hidden" name="customerId" value={customer.id} />
          <label className="grid gap-2 text-sm font-medium text-charcoal">
            Bill total
            <input
              name="billTotal"
              type="number"
              min="1"
              step="0.01"
              defaultValue={billTotal}
              className="rounded-md border border-line bg-cream px-4 py-3 focus:border-matcha-deep focus:outline-none focus:shadow-focus"
            />
          </label>
          <Button type="submit" icon={CheckCircle2}>
            Confirm award
          </Button>
          <Button href={`/cashier/customer/${customer.id}`} variant="secondary">
            Back
          </Button>
        </form>
      </section>
    </CashierShell>
  );
}
