import { Gift, PlusCircle } from "lucide-react";
import { ActionLink } from "@/components/shared/action-link";
import { CashierShell } from "@/components/cashier/cashier-shell";
import { customers, getCustomer } from "@/lib/mock-data";
import { formatPoints } from "@/lib/formatters";

export function generateStaticParams() {
  return customers.map((customer) => ({ id: customer.id }));
}

export default async function CashierCustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const customer = getCustomer(id);

  return (
    <CashierShell>
      <section className="matcha-card rounded-[8px] p-6">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-matcha">Customer found</p>
        <h1 className="mt-2 font-display text-6xl text-ink">{customer.name}</h1>
        <p className="mt-3 text-ink/60">{customer.phone}</p>
        <div className="mt-8 rounded-[8px] bg-moss p-6 text-paper">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-paper/70">Current balance</p>
          <p className="mt-3 font-display text-7xl leading-none">{formatPoints(customer.pointsBalance)}</p>
          <p className="mt-2 text-paper/70">points</p>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <ActionLink href="/cashier/award" icon={PlusCircle}>Award points</ActionLink>
          <ActionLink href="/cashier/redeem" icon={Gift} variant="secondary">Redeem reward</ActionLink>
        </div>
      </section>
    </CashierShell>
  );
}
