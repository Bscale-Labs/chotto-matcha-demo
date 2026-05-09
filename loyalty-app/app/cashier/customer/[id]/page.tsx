import { Gift, Leaf, PlusCircle } from "lucide-react";
import { Button } from "@/components/shared/button";
import { Eyebrow } from "@/components/shared/eyebrow";
import { CashierShell } from "@/components/cashier/cashier-shell";
import { TierBadge } from "@/components/customer/tier-badge";
import { customers, getCustomer } from "@/lib/mock-data";
import { formatPoints } from "@/lib/formatters";
import { getTier } from "@/lib/loyalty";

export function generateStaticParams() {
  return customers.map((customer) => ({ id: customer.id }));
}

export default async function CashierCustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const customer = getCustomer(id);
  const tier = getTier(customer.pointsBalance);

  return (
    <CashierShell>
      <section className="rounded-lg border border-line-soft bg-cream p-7">
        <Eyebrow className="text-matcha-deep">Member found</Eyebrow>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
          <h1 className="font-display text-[48px] font-medium leading-[52px] text-charcoal">
            {customer.name}
          </h1>
          <TierBadge tier={tier} />
        </div>
        <p className="mt-2 text-sm leading-6 text-ink-muted">{customer.phone}</p>

        <div className="relative mt-7 overflow-hidden rounded-lg bg-matcha-deep p-7 text-cream shadow-md">
          <Leaf
            className="pointer-events-none absolute -right-6 top-1/2 h-44 w-44 -translate-y-1/2 text-cream/15"
            strokeWidth={1.2}
            aria-hidden="true"
          />
          <p className="eyebrow relative text-cream/70">Current balance</p>
          <p className="counter relative mt-3 font-display text-[72px] font-medium leading-none">
            {formatPoints(customer.pointsBalance)}
          </p>
          <p className="relative mt-2 text-cream/75">leaves</p>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Button href="/cashier/award" icon={PlusCircle}>
            Award leaves
          </Button>
          <Button href="/cashier/redeem" variant="secondary" icon={Gift}>
            Redeem reward
          </Button>
        </div>
      </section>
    </CashierShell>
  );
}
