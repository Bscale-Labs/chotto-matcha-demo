import { CheckCircle2 } from "lucide-react";
import { CashierShell } from "@/components/cashier/cashier-shell";
import { ActionLink } from "@/components/shared/action-link";
import { getCustomer, rewards } from "@/lib/mock-data";
import { canRedeem } from "@/lib/points";
import { formatPoints } from "@/lib/formatters";

export default function CashierRedeemPage() {
  const customer = getCustomer();

  return (
    <CashierShell>
      <section className="matcha-card rounded-[8px] p-6">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-matcha">Redeem reward</p>
        <h1 className="mt-2 font-display text-5xl text-ink">{customer.name}</h1>
        <div className="mt-6 grid gap-3">
          {rewards.map((reward) => {
            const available = canRedeem(customer, reward);
            return (
              <div key={reward.id} className="flex flex-wrap items-center justify-between gap-4 rounded-[8px] bg-white/65 p-4">
                <div>
                  <p className="font-bold text-ink">{reward.name}</p>
                  <p className="mt-1 text-sm text-ink/55">
                    {formatPoints(reward.pointCost)} pts / {reward.stockCount === null ? "Unlimited" : `${reward.stockCount} left`}
                  </p>
                </div>
                <span className={available ? "rounded-full bg-matcha px-3 py-1 text-xs font-bold text-paper" : "rounded-full bg-oat px-3 py-1 text-xs font-bold text-ink/55"}>
                  {available ? "Available" : "Blocked"}
                </span>
              </div>
            );
          })}
        </div>
        <ActionLink href="/cashier/identify" icon={CheckCircle2} className="mt-6">Confirm selected reward</ActionLink>
      </section>
    </CashierShell>
  );
}
