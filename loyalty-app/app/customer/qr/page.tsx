import { CustomerShell } from "@/components/customer/customer-shell";
import { SendQrButton } from "@/components/customer/send-qr-button";
import { requireCustomerSession } from "@/lib/auth/session";
import { formatPoints } from "@/lib/formatters";

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
  const cells = buildPattern(customer.id);

  return (
    <CustomerShell surfaceClassName="scan-surface" inverseHeader>
      <section>
        <h1 className="font-display text-[40px] font-medium leading-[44px] text-cream">
          Show this at the bar
        </h1>
      </section>

      <div className="surface-glass-strong mt-7 rounded-xl p-6 text-center">
        <p className="font-medium text-charcoal">
          {customer.name.split(" ")[0]} · {formatPoints(customer.pointsBalance)} points
        </p>
        <div
          className="mx-auto mt-5 grid aspect-square w-full max-w-[18rem] gap-px"
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
        <SendQrButton name={customer.name.split(" ")[0]} />
      </div>
    </CustomerShell>
  );
}
