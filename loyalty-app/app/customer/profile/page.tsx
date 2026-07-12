import { ChevronRight, LogOut, Mail, Phone } from "lucide-react";
import { CustomerShell } from "@/components/customer/customer-shell";
import { requireCustomerSession } from "@/lib/auth/session";
import { initials } from "@/lib/formatters";

export default async function CustomerProfilePage() {
  const { customer } = await requireCustomerSession();

  return (
    <CustomerShell>
      <section className="surface-paper rounded-xl p-6 text-center">
        <span className="mx-auto grid h-20 w-20 place-items-center rounded-pill bg-matcha-deep font-display text-2xl font-semibold text-cream">
          {initials(customer.name)}
        </span>
        <h1 className="mt-4 font-display text-[32px] font-medium leading-[38px] text-charcoal">
          {customer.name}
        </h1>
      </section>

      <section className="mt-5 grid gap-2">
        <div className="surface-paper flex items-center gap-3 rounded-md p-4">
          <span className="grid h-10 w-10 place-items-center rounded-pill bg-sage-wash text-matcha-deep">
            <Mail className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs uppercase tracking-eyebrow text-ink-muted">Email</p>
            <p className="truncate text-sm text-charcoal">{customer.email}</p>
          </div>
        </div>
        <div className="surface-paper flex items-center gap-3 rounded-md p-4">
          <span className="grid h-10 w-10 place-items-center rounded-pill bg-sage-wash text-matcha-deep">
            <Phone className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <label
              htmlFor="phone"
              className="text-xs uppercase tracking-eyebrow text-ink-muted"
            >
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              defaultValue={customer.phone}
              className="mt-1 h-10 w-full min-w-0 rounded-md border border-line bg-cream px-3 text-sm text-charcoal focus:border-matcha-deep focus:outline-none focus:shadow-focus"
            />
          </div>
        </div>
      </section>

      <section className="mt-7 grid gap-2">
        <form action="/customer/logout" method="post">
          <button
            type="submit"
            className="gloss flex min-h-[64px] w-full items-center gap-3 rounded-lg border border-line-soft bg-milk p-4 text-left transition-colors duration-fast ease-out-soft hover:border-matcha-deep hover:bg-sage-wash active:bg-sage-tint"
          >
            <span className="grid h-11 w-11 place-items-center rounded-pill bg-sage-wash text-matcha-deep">
              <LogOut className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-medium text-charcoal">Sign out</span>
              <span className="block text-xs text-ink-muted">Step away for now</span>
            </span>
            <ChevronRight className="h-4 w-4 text-ink-faint" strokeWidth={1.5} aria-hidden="true" />
          </button>
        </form>
      </section>
    </CustomerShell>
  );
}
