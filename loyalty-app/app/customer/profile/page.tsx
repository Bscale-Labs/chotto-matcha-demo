import Link from "next/link";
import {
  Award,
  ChevronRight,
  Gift,
  Leaf,
  LogOut,
  Mail,
  MapPin,
  Phone,
  ReceiptText
} from "lucide-react";
import { CustomerShell } from "@/components/customer/customer-shell";
import { requireCustomerSession } from "@/lib/auth/session";
import { initials, formatPoints } from "@/lib/formatters";

export default async function CustomerProfilePage() {
  const { customer } = await requireCustomerSession();

  const menu = [
    { label: "Transaction History", icon: ReceiptText, href: "/customer/activity" },
    { label: "My Rewards", icon: Gift, href: "/customer/rewards" },
    { label: "My Milestones", icon: Award, href: "/customer/milestones" },
    { label: "Branch Visits", icon: MapPin, href: "/customer/passport" }
  ];

  return (
    <CustomerShell>
      <section className="flex items-center gap-4">
        <span className="grid h-16 w-16 shrink-0 place-items-center rounded-pill bg-matcha-deep font-display text-xl font-semibold text-cream">
          {initials(customer.name)}
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="truncate font-display text-[28px] font-medium leading-[34px] text-charcoal">
            {customer.name}
          </h1>
        </div>
        <Link
          href="/customer/profile/edit"
          className="inline-flex min-h-tap shrink-0 items-center text-sm font-medium text-matcha-deep transition-colors duration-fast ease-out-soft hover:text-forest"
        >
          Edit
        </Link>
      </section>

      <section className="surface-paper mt-5 rounded-lg p-4">
        <p className="eyebrow text-ink-muted">Your Leaves</p>
        <p className="counter mt-2 inline-flex items-center gap-1.5 font-display text-[28px] font-medium leading-none text-matcha-deep">
          {formatPoints(customer.pointsBalance)}
          <Leaf className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
        </p>
      </section>

      <section className="mt-4 grid gap-2">
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
            <p className="text-xs uppercase tracking-eyebrow text-ink-muted">Phone</p>
            <p className="truncate text-sm text-charcoal">{customer.phone}</p>
          </div>
        </div>
      </section>

      <nav className="mt-6 grid gap-2" aria-label="Account">
        {menu.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="gloss flex min-h-[56px] items-center gap-3 rounded-lg border border-line-soft bg-milk px-4 transition-colors duration-fast ease-out-soft hover:border-matcha-deep hover:bg-sage-wash active:bg-sage-tint"
          >
            <item.icon className="h-4 w-4 shrink-0 text-matcha-deep" strokeWidth={1.5} aria-hidden="true" />
            <span className="min-w-0 flex-1 font-medium text-charcoal">{item.label}</span>
            <ChevronRight className="h-4 w-4 text-ink-faint" strokeWidth={1.5} aria-hidden="true" />
          </Link>
        ))}
        <form action="/customer/logout" method="post">
          <button
            type="submit"
            className="gloss flex min-h-[56px] w-full items-center gap-3 rounded-lg border border-line-soft bg-milk px-4 text-left transition-colors duration-fast ease-out-soft hover:border-matcha-deep hover:bg-sage-wash active:bg-sage-tint"
          >
            <LogOut className="h-4 w-4 shrink-0 text-matcha-deep" strokeWidth={1.5} aria-hidden="true" />
            <span className="min-w-0 flex-1 font-medium text-charcoal">Sign out</span>
            <ChevronRight className="h-4 w-4 text-ink-faint" strokeWidth={1.5} aria-hidden="true" />
          </button>
        </form>
      </nav>
    </CustomerShell>
  );
}
