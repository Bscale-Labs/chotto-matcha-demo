import Image from "next/image";
import { ChevronDown, Leaf, MapPin } from "lucide-react";
import { CustomerShell } from "@/components/customer/customer-shell";
import { SendQrButton } from "@/components/customer/send-qr-button";
import { requireCustomerSession } from "@/lib/auth/session";
import { listActiveBranches } from "@/lib/data/branches";

const SIZE = 25;

function isFinder(x: number, y: number) {
  const inTopLeft = x < 7 && y < 7;
  const inTopRight = x >= SIZE - 7 && y < 7;
  const inBottomLeft = x < 7 && y >= SIZE - 7;
  if (!inTopLeft && !inTopRight && !inBottomLeft) return null;
  const lx = inTopRight ? x - (SIZE - 7) : x;
  const ly = inBottomLeft ? y - (SIZE - 7) : y;
  const onOuter = lx === 0 || lx === 6 || ly === 0 || ly === 6;
  const inInner = lx >= 2 && lx <= 4 && ly >= 2 && ly <= 4;
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
  const branches = await listActiveBranches();
  const cells = buildPattern(customer.id);

  return (
    <CustomerShell>
      <section className="relative h-64 overflow-hidden rounded-xl shadow-sm">
        <Image
          src="/cashier/matcha-still-life.png"
          alt="A bowl of whisked matcha"
          fill
          priority
          className="object-cover"
          sizes="(max-width: 28rem) 100vw, 28rem"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-cream/70 via-cream/10 to-cream" />
        <h1 className="absolute left-5 top-5 font-display text-[32px] font-medium leading-[36px] text-charcoal">
          Show this
          <br />
          at the bar
        </h1>
      </section>

      <div className="relative z-10 -mt-12 flex flex-col items-center">
        <div
          className="surface-glass-strong grid aspect-square w-56 gap-px rounded-pill border border-line-soft bg-cream p-6 shadow-lg"
          style={{ gridTemplateColumns: `repeat(${SIZE}, minmax(0, 1fr))` }}
          aria-label="Your member QR"
          role="img"
        >
          {cells.map((filled, index) => (
            <span key={index} className={filled ? "bg-charcoal" : "bg-cream"} />
          ))}
        </div>
        <p className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-matcha-deep">
          <Leaf className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
          Earn leaves with every purchase.
        </p>
        <div className="mt-4 w-full">
          <SendQrButton name={customer.name.split(" ")[0]} />
        </div>
      </div>

      <label className="surface-paper mt-6 flex items-center gap-3 rounded-lg p-4">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-pill bg-sage-wash text-matcha-deep">
          <MapPin className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-xs uppercase tracking-eyebrow text-ink-muted">My Branch</span>
          <select
            name="branch"
            defaultValue={branches[0]?.id}
            className="mt-0.5 w-full appearance-none bg-transparent text-sm font-medium text-charcoal"
          >
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
        </span>
        <ChevronDown className="h-4 w-4 shrink-0 text-ink-faint" strokeWidth={1.5} aria-hidden="true" />
      </label>
    </CustomerShell>
  );
}
