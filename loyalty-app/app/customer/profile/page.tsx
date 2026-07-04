import { ChevronRight, LogOut, Mail, Phone, Settings2, Sparkles } from "lucide-react";
import { CustomerShell } from "@/components/customer/customer-shell";
import { TierBadge } from "@/components/customer/tier-badge";
import { requireCustomerSession } from "@/lib/auth/session";
import { initials, formatPoints } from "@/lib/formatters";
import { getNextTier, getTier, pointsToNextTier, tiers } from "@/lib/loyalty";

const links = [
  { label: "Notifications", description: "Quiet pings only", icon: Sparkles, href: "#" },
  { label: "Preferences", description: "Drink, milk, sweetness", icon: Settings2, href: "#" }
];

export default async function CustomerProfilePage() {
  const { customer } = await requireCustomerSession();
  const tier = getTier(customer.pointsBalance);
  const nextTier = getNextTier(customer.pointsBalance);
  const toNext = pointsToNextTier(customer.pointsBalance);

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
            ? `${formatPoints(toNext)} points to ${nextTier.name}.`
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
            const TierIcon = row.icon;
            return (
              <li
                key={row.id}
                className={
                  isCurrent
                    ? "flex items-center gap-3 rounded-md border border-matcha-deep/20 bg-sage-wash p-4"
                    : "flex items-center gap-3 rounded-md border border-line-soft bg-cream p-4"
                }
              >
                <span
                  className={
                    isCurrent
                      ? "grid h-10 w-10 shrink-0 place-items-center rounded-pill bg-matcha-deep text-cream"
                      : "grid h-10 w-10 shrink-0 place-items-center rounded-pill bg-stone text-matcha-deep"
                  }
                  aria-hidden="true"
                >
                  <TierIcon className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                </span>
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
            className="gloss flex min-h-[64px] items-center gap-3 rounded-lg border border-line-soft bg-milk p-4 transition-colors duration-fast ease-out-soft hover:border-matcha-deep hover:bg-sage-wash active:bg-sage-tint"
          >
            <span className="grid h-11 w-11 place-items-center rounded-pill bg-sage-wash text-matcha-deep">
              <link.icon className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-medium text-charcoal">{link.label}</span>
              <span className="block text-xs text-ink-muted">{link.description}</span>
            </span>
            <ChevronRight className="h-4 w-4 text-ink-faint" strokeWidth={1.5} aria-hidden="true" />
          </a>
        ))}
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
