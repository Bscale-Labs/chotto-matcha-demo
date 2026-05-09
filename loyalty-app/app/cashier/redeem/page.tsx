import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/shared/button";
import { Eyebrow } from "@/components/shared/eyebrow";
import { Pill } from "@/components/shared/pill";
import { CashierShell } from "@/components/cashier/cashier-shell";
import { getCustomer, rewards } from "@/lib/mock-data";
import { canRedeem } from "@/lib/points";
import { formatPoints } from "@/lib/formatters";

export default function CashierRedeemPage() {
  const customer = getCustomer();

  return (
    <CashierShell>
      <section className="rounded-lg border border-line-soft bg-cream p-7">
        <Eyebrow className="text-matcha-deep">Redeem reward</Eyebrow>
        <h1 className="mt-3 font-display text-[40px] font-medium leading-[44px] text-charcoal">
          {customer.name}
        </h1>
        <p className="mt-2 text-sm leading-6 text-ink-muted">
          {formatPoints(customer.pointsBalance)} leaves available.
        </p>

        <div className="mt-6 grid gap-3">
          {rewards.map((reward) => {
            const available = canRedeem(customer, reward);
            return (
              <label
                key={reward.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-line-soft bg-stone/30 p-4 transition-colors duration-fast ease-out-soft hover:border-matcha-deep"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="reward"
                    className="h-4 w-4 accent-[var(--matcha-deep)]"
                    disabled={!available}
                    defaultChecked={available && reward.id === rewards[0]?.id}
                  />
                  <div>
                    <p className="font-medium text-charcoal">{reward.name}</p>
                    <p className="counter mt-0.5 text-xs text-ink-muted">
                      {formatPoints(reward.pointCost)} leaves ·{" "}
                      {reward.stockCount === null ? "Always available" : `${reward.stockCount} left`}
                    </p>
                  </div>
                </div>
                <Pill tone={available ? "default" : "muted"}>
                  {available ? "Ready" : "Locked"}
                </Pill>
              </label>
            );
          })}
        </div>

        <Button href="/cashier/identify" icon={CheckCircle2} className="mt-6">
          Confirm reward
        </Button>
      </section>
    </CashierShell>
  );
}
