import { ArrowUpRight, BadgeCheck, Coffee, MonitorCog, Palette } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/shared/button";
import { Brand } from "@/components/shared/brand";
import { Pill } from "@/components/shared/pill";

const surfaces = [
  {
    href: "/customer",
    icon: Coffee,
    eyebrow: "Member",
    title: "Customer app",
    detail: "Show your code, watch points grow, redeem quietly."
  },
  {
    href: "/cashier",
    icon: BadgeCheck,
    eyebrow: "Bar",
    title: "Cashier tablet",
    detail: "Scan a member, award points, hand over a reward."
  },
  {
    href: "/manager",
    icon: MonitorCog,
    eyebrow: "Studio",
    title: "Admin console",
    detail: "Tend the catalog, branches, staff, and ledger."
  }
];

export default function Home() {
  return (
    <main className="min-h-screen bg-cream py-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col px-6">
        <header className="flex items-center justify-between">
          <Brand size="md" />
          <Pill tone="default" icon={Palette}>
            <Link href="/design-system">Design system</Link>
          </Pill>
        </header>

        <section className="grid flex-1 items-center gap-12 py-12 lg:grid-cols-[1fr_1fr]">
          <div>
            <p className="eyebrow text-matcha-deep">A quiet loyalty ritual</p>
            <h1 className="mt-5 font-display text-[56px] font-medium leading-[60px] tracking-display text-charcoal sm:text-[72px] sm:leading-[78px]">
              Just a moment, with matcha.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-ink-muted">
              Three thoughtful surfaces — one for members, one for the bar, one for the studio — sharing the
              same calm palette, the same vocabulary, and the same points you earn one cup at a time.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/customer" icon={ArrowUpRight} iconPosition="trailing">
                Open the member app
              </Button>
              <Button href="/manager" variant="secondary">
                Admin console
              </Button>
            </div>
          </div>

          <div className="grid gap-3">
            {surfaces.map((surface) => (
              <Link
                key={surface.href}
                href={surface.href}
                className="surface-paper group flex items-center gap-5 rounded-lg p-5 transition-colors duration-fast ease-out-soft hover:border-matcha-deep"
              >
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-pill bg-sage-wash text-matcha-deep transition-colors duration-fast ease-out-soft group-hover:bg-matcha-deep group-hover:text-cream">
                  <surface.icon className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="eyebrow block text-ink-muted">{surface.eyebrow}</span>
                  <span className="mt-1 block font-display text-[22px] font-medium leading-7 text-charcoal">
                    {surface.title}
                  </span>
                  <span className="mt-1 block text-sm leading-5 text-ink-muted">
                    {surface.detail}
                  </span>
                </span>
                <ArrowUpRight
                  className="h-5 w-5 text-ink-faint transition-colors duration-fast ease-out-soft group-hover:text-matcha-deep"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
