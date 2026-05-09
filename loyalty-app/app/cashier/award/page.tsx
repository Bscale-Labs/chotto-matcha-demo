import { CheckCircle2 } from "lucide-react";
import { CashierShell } from "@/components/cashier/cashier-shell";
import { ActionLink } from "@/components/shared/action-link";
import { calculateEarnedPoints } from "@/lib/points";
import { formatPeso, formatPoints } from "@/lib/formatters";
import { getCustomer, orgConfig } from "@/lib/mock-data";

export default function CashierAwardPage() {
  const customer = getCustomer();
  const billTotal = 420;
  const points = calculateEarnedPoints(billTotal, orgConfig.earnRate);

  return (
    <CashierShell>
      <section className="matcha-card rounded-[8px] p-6">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-matcha">Award points</p>
        <h1 className="mt-2 font-display text-5xl text-ink">{customer.name}</h1>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-[8px] bg-white/65 p-5">
            <p className="text-sm font-bold text-moss">Bill total</p>
            <p className="mt-3 font-display text-5xl text-ink">{formatPeso(billTotal)}</p>
          </div>
          <div className="rounded-[8px] bg-matcha p-5 text-paper">
            <p className="text-sm font-bold text-paper/80">Points to award</p>
            <p className="mt-3 font-display text-5xl">{formatPoints(points)}</p>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <ActionLink href="/cashier/identify" icon={CheckCircle2}>Confirm award</ActionLink>
          <ActionLink href="/cashier/customer/cust-lia" variant="secondary">Back</ActionLink>
        </div>
      </section>
    </CashierShell>
  );
}
