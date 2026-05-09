import { Sparkles } from "lucide-react";
import { CustomerShell } from "@/components/customer/customer-shell";
import { TierBadge } from "@/components/customer/tier-badge";
import { getCustomer } from "@/lib/mock-data";
import { formatPoints } from "@/lib/formatters";
import { getTier } from "@/lib/loyalty";

const qrCells = Array.from(
  { length: 121 },
  (_, index) => index % 2 === 0 || index % 7 === 0 || [3, 9, 30, 58, 93].includes(index)
);

export default function CustomerQrPage() {
  const customer = getCustomer();
  const tier = getTier(customer.pointsBalance);

  return (
    <CustomerShell>
      <section>
        <p className="eyebrow text-matcha-deep">Counter scan</p>
        <h1 className="mt-2 font-display text-[40px] font-medium leading-[44px] text-charcoal">
          Show this at the bar
        </h1>
        <p className="mt-2 text-sm leading-5 text-ink-muted">
          Just a moment — the barista taps your code to add today&apos;s leaves.
        </p>
      </section>

      <div className="mt-7 rounded-xl bg-matcha-deep p-6 text-center text-cream shadow-md">
        <div className="mx-auto inline-flex items-center gap-2 rounded-pill bg-cream/15 px-3 py-1 text-xs font-medium text-cream">
          <Sparkles className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
          {customer.name.split(" ")[0]} · {formatPoints(customer.pointsBalance)} leaves
        </div>
        <div className="mx-auto mt-5 grid h-64 w-64 grid-cols-11 gap-1 rounded-lg bg-cream p-3">
          {qrCells.map((filled, index) => (
            <span
              key={index}
              className={filled ? "rounded-[2px] bg-charcoal" : "rounded-[2px] bg-cream"}
            />
          ))}
        </div>
        <p className="mt-4 font-mono text-[11px] uppercase tracking-eyebrow text-cream/70">
          {customer.id}
        </p>
      </div>

      <div className="mt-6 flex items-center justify-between rounded-md border border-line-soft bg-cream p-4">
        <div>
          <p className="text-xs uppercase tracking-eyebrow text-ink-muted">Status</p>
          <p className="mt-1 font-medium text-charcoal">{tier.name}</p>
        </div>
        <TierBadge tier={tier} />
      </div>
    </CustomerShell>
  );
}
