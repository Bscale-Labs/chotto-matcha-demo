import { Camera, Search } from "lucide-react";
import Link from "next/link";
import { CashierShell } from "@/components/cashier/cashier-shell";
import { customers } from "@/lib/mock-data";
import { formatPoints } from "@/lib/formatters";

export default function CashierIdentifyPage() {
  return (
    <CashierShell>
      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <section className="matcha-card grid min-h-[480px] place-items-center rounded-[8px] p-6 text-center">
          <div>
            <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-ink text-paper">
              <Camera className="h-10 w-10" aria-hidden="true" />
            </div>
            <h1 className="mt-6 font-display text-5xl text-ink">Scan customer QR</h1>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-ink/62">
              Camera wiring lands in the auth/device pass. For the demo, pick a customer from manual lookup.
            </p>
          </div>
        </section>
        <aside className="matcha-card rounded-[8px] p-5">
          <label className="flex items-center gap-3 rounded-full border border-moss/15 bg-white/70 px-4 py-3 text-sm text-ink/60">
            <Search className="h-4 w-4" aria-hidden="true" />
            <span>Search phone or name</span>
          </label>
          <div className="mt-4 grid gap-3">
            {customers.map((customer) => (
              <Link key={customer.id} href={`/cashier/customer/${customer.id}`} className="rounded-[8px] bg-white/60 p-4 transition hover:bg-matcha/10">
                <span className="block font-bold text-ink">{customer.name}</span>
                <span className="mt-1 block text-sm text-ink/55">{customer.phone}</span>
                <span className="mt-2 block text-sm font-bold text-moss">{formatPoints(customer.pointsBalance)} pts</span>
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </CashierShell>
  );
}
