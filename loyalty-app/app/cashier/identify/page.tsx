import Link from "next/link";
import { Camera, Search } from "lucide-react";
import { CashierShell } from "@/components/cashier/cashier-shell";
import { Eyebrow } from "@/components/shared/eyebrow";
import { customers } from "@/lib/mock-data";
import { formatPoints } from "@/lib/formatters";

export default function CashierIdentifyPage() {
  return (
    <CashierShell>
      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <section className="grid min-h-[480px] place-items-center rounded-lg border border-line-soft bg-cream p-8 text-center">
          <div>
            <div className="mx-auto grid h-24 w-24 place-items-center rounded-pill bg-matcha-deep text-cream shadow-md">
              <Camera className="h-9 w-9" strokeWidth={1.5} aria-hidden="true" />
            </div>
            <h1 className="mt-6 font-display text-[40px] font-medium leading-[44px] text-charcoal">
              Scan a member&apos;s code
            </h1>
            <p className="mx-auto mt-3 max-w-md text-base leading-6 text-ink-muted">
              Camera wiring lands in the device pass. For the demo, pick a member from the lookup.
            </p>
          </div>
        </section>
        <aside className="rounded-lg border border-line-soft bg-cream p-5">
          <Eyebrow className="text-matcha-deep">Lookup</Eyebrow>
          <label className="mt-3 flex items-center gap-2 rounded-md border border-line bg-cream px-4 py-3 text-sm text-ink-muted focus-within:border-matcha-deep focus-within:shadow-focus">
            <Search className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
            <input
              placeholder="Search phone or name"
              className="flex-1 bg-transparent placeholder:text-ink-faint focus:outline-none"
            />
          </label>
          <div className="mt-4 grid gap-2">
            {customers.map((customer) => (
              <Link
                key={customer.id}
                href={`/cashier/customer/${customer.id}`}
                className="rounded-md border border-line-soft bg-stone/30 p-4 transition-colors duration-fast ease-out-soft hover:border-matcha-deep hover:bg-sage-wash"
              >
                <span className="block font-medium text-charcoal">{customer.name}</span>
                <span className="mt-1 block text-xs text-ink-muted">{customer.phone}</span>
                <span className="counter mt-2 inline-flex items-center rounded-pill bg-sage-wash px-2.5 py-1 text-xs font-medium text-matcha-deep">
                  {formatPoints(customer.pointsBalance)} leaves
                </span>
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </CashierShell>
  );
}
