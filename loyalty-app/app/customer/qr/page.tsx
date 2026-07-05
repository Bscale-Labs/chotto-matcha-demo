import { Sparkles } from "lucide-react";
import { CustomerShell } from "@/components/customer/customer-shell";
import { TierBadge } from "@/components/customer/tier-badge";
import { requireCustomerSession } from "@/lib/auth/session";
import { listConfiguredRewardTiers } from "@/lib/data/reward-tiers";
import { formatPoints } from "@/lib/formatters";
import { getTier } from "@/lib/loyalty";

const SIZE = 25;

function isFinder(x: number, y: number) {
  const inTopLeft = x < 7 && y < 7;
  const inTopRight = x >= SIZE - 7 && y < 7;
  const inBottomLeft = x < 7 && y >= SIZE - 7;
  if (!inTopLeft && !inTopRight && !inBottomLeft) return null;
  const lx = inTopRight ? x - (SIZE - 7) : x;
  const ly = inBottomLeft ? y - (SIZE - 7) : y;
  const ringX = inTopRight ? lx : lx;
  const ringY = inBottomLeft ? ly : ly;
  const onOuter = ringX === 0 || ringX === 6 || ringY === 0 || ringY === 6;
  const inInner = ringX >= 2 && ringX <= 4 && ringY >= 2 && ringY <= 4;
  return onOuter || inInner;
}

function buildPattern(seed: string) {
  const cells: boolean[] = [];
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const finder = isFinder(x, y);
      if (finder !== null) {
        cells.push(finder);
        continue;
      }
      const c = seed.charCodeAt((x * 31 + y * 17) % seed.length);
      cells.push(((c + x * y) & 1) === 1);
    }
  }
  return cells;
}

export default async function CustomerQrPage() {
  const { customer } = await requireCustomerSession();
  const rewardTiers = await listConfiguredRewardTiers();
  const tier = getTier(customer.pointsBalance, rewardTiers);
  const cells = buildPattern(customer.code);

  return (
    <CustomerShell>
      <section>
        <p className="eyebrow text-matcha-deep">Counter scan</p>
        <h1 className="mt-2 font-display text-[40px] font-medium leading-[44px] text-charcoal">
          Show this at the bar
        </h1>
        <p className="mt-2 text-sm leading-5 text-ink-muted">
          Just a moment — the barista taps your code to add today&apos;s points.
        </p>
      </section>

      <div className="surface-glass-strong mt-7 rounded-xl p-6 text-center">
        <div className="mx-auto inline-flex items-center gap-2 rounded-pill bg-sage-wash px-3 py-1 text-xs font-medium text-matcha-deep">
          <Sparkles className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
          {customer.name.split(" ")[0]} · {formatPoints(customer.pointsBalance)} points
        </div>
        <div
          className="mx-auto mt-5 grid aspect-square w-full max-w-[18rem] gap-px rounded-lg border border-line-soft bg-cream p-4 shadow-sm"
          style={{ gridTemplateColumns: `repeat(${SIZE}, minmax(0, 1fr))` }}
          aria-label="QR placeholder"
          role="img"
        >
          {cells.map((filled, index) => (
            <span
              key={index}
              className={filled ? "bg-charcoal" : "bg-cream"}
            />
          ))}
        </div>
        <p className="mt-4 font-mono text-[11px] uppercase tracking-eyebrow text-ink-muted">
          {customer.code}
        </p>
      </div>

      <div className="surface-paper mt-6 flex items-center justify-between rounded-md p-4">
        <div>
          <p className="text-xs uppercase tracking-eyebrow text-ink-muted">Status</p>
          <p className="mt-1 font-medium text-charcoal">{tier.name}</p>
        </div>
        <TierBadge tier={tier} />
      </div>
    </CustomerShell>
  );
}
