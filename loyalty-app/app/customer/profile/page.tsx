import { ChevronRight, LogOut, Mail, Phone, Settings2, Sparkles } from "lucide-react";
import { CustomerShell } from "@/components/customer/customer-shell";
import { TierBadge } from "@/components/customer/tier-badge";
import { getCustomer } from "@/lib/mock-data";
import { initials, formatPoints } from "@/lib/formatters";
import { getNextTier, getTier, leavesToNextTier, tiers } from "@/lib/loyalty";

const links = [
  { label: "Notifications", description: "Quiet pings only", icon: Sparkles, href: "#" },
  { label: "Preferences", description: "Drink, milk, sweetness", icon: Settings2, href: "#" },
  { label: "Sign out", description: "Step away for now", icon: LogOut, href: "/" }
];

export default function CustomerProfilePage() {
  const customer = getCustomer();
  const tier = getTier(customer.pointsBalance);
  const nextTier = getNextTier(customer.pointsBalance);
  const toNext = leavesToNextTier(customer.pointsBalance);

  return (
    <CustomerShell>
      <section className="rounded-xl border border-line-soft bg-cream p-6 text-center">
        <span className="mx-auto grid h-20 w-20 place-items-center rounded-pill bg-matcha-deep font-display text-2xl font-semibold text-cream">
          {initials(customer.name)}
        </span>
        <h1 className="mt-4 font-display text-[32px] font-medium leading-[38px] text-charcoal">
          {customer.name}
        </h1>
        <div className="mt-3 flex justify-center">
          <TierBadge tier={tier} />
        </div>
        <p className="mt-3 text-sm leading-5 text-ink-muted">
          {nextTier
            ? `${formatPoints(toNext)} leaves to ${nextTier.name}.`
            : "You’ve reached the deepest steep — thank you."}
        </p>
      </section>

      <section className="mt-5 grid gap-2">
        <div className="flex items-center gap-3 rounded-md border border-line-soft bg-cream p-4">
          <span className="grid h-10 w-10 place-items-center rounded-pill bg-sage-wash text-matcha-deep">
            <Mail className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs uppercase tracking-eyebrow text-ink-muted">Email</p>
            <p className="truncate text-sm text-charcoal">{customer.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-md border border-line-soft bg-cream p-4">
          <span className="grid h-10 w-10 place-items-center rounded-pill bg-sage-wash text-matcha-deep">
            <Phone className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs uppercase tracking-eyebrow text-ink-muted">Phone</p>
            <p className="truncate text-sm text-charcoal">{customer.phone}</p>
          </div>
        </div>
      </section>

      <section className="mt-7">
        <p className="eyebrow text-ink-muted">Tiers</p>
        <ul className="mt-3 grid gap-2">
          {tiers.map((row) => {
            const isCurrent = row.id === tier.id;
            return (
              <li
                key={row.id}
                className={
                  isCurrent
                    ? "flex items-center gap-3 rounded-md border border-matcha-deep/20 bg-sage-wash p-4"
                    : "flex items-center gap-3 rounded-md border border-line-soft bg-cream p-4"
                }
              >
                <span className="text-2xl" aria-hidden="true">{row.glyph}</span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-charcoal">{row.name}</p>
                  <p className="text-xs text-ink-muted">{row.vibe}</p>
                </div>
                <span className="counter text-xs text-ink-muted">
                  {row.max === null ? `${formatPoints(row.min)}+` : `${formatPoints(row.min)}–${formatPoints(row.max)}`}
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mt-7 grid gap-2">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="flex items-center gap-3 rounded-md border border-line-soft bg-cream p-4 transition-colors duration-fast ease-out-soft hover:bg-stone"
          >
            <span className="grid h-10 w-10 place-items-center rounded-pill bg-stone text-charcoal">
              <link.icon className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-medium text-charcoal">{link.label}</span>
              <span className="block text-xs text-ink-muted">{link.description}</span>
            </span>
            <ChevronRight className="h-4 w-4 text-ink-faint" strokeWidth={1.5} aria-hidden="true" />
          </a>
        ))}
      </section>
    </CustomerShell>
  );
}
