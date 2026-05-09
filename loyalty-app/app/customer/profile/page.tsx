import { CustomerShell } from "@/components/customer/customer-shell";
import { getCustomer } from "@/lib/mock-data";
import { initials } from "@/lib/formatters";

export default function CustomerProfilePage() {
  const customer = getCustomer();

  return (
    <CustomerShell>
      <section className="matcha-card rounded-[8px] p-6 text-center">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-matcha text-2xl font-bold text-paper">
          {initials(customer.name)}
        </div>
        <h1 className="mt-4 font-display text-4xl text-ink">{customer.name}</h1>
        <div className="mt-6 grid gap-3 text-left">
          <p className="rounded-[8px] bg-white/60 p-4 text-sm text-ink/70">
            <span className="block text-xs font-bold uppercase tracking-[0.16em] text-moss">Email</span>
            {customer.email}
          </p>
          <p className="rounded-[8px] bg-white/60 p-4 text-sm text-ink/70">
            <span className="block text-xs font-bold uppercase tracking-[0.16em] text-moss">Phone</span>
            {customer.phone}
          </p>
        </div>
      </section>
    </CustomerShell>
  );
}
