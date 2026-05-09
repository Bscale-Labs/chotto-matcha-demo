import { ArrowRight, BadgeCheck, Coffee, MonitorCog } from "lucide-react";
import { ActionLink } from "@/components/shared/action-link";
import { Brand } from "@/components/shared/brand";

const surfaces = [
  {
    href: "/customer",
    icon: Coffee,
    title: "Customer PWA",
    detail: "Points, QR, rewards, and profile."
  },
  {
    href: "/cashier",
    icon: BadgeCheck,
    title: "Cashier Tablet",
    detail: "Scan, award points, and redeem rewards."
  },
  {
    href: "/manager",
    icon: MonitorCog,
    title: "Manager Console",
    detail: "Catalog, branches, staff, customers, and reporting."
  }
];

export default function Home() {
  return (
    <main className="grain min-h-screen px-5 py-6">
      <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl flex-col">
        <header className="flex items-center justify-between">
          <Brand />
          <span className="rounded-full border border-moss/20 bg-white/60 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-moss">
            Demo scaffold
          </span>
        </header>

        <section className="grid flex-1 items-center gap-10 py-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-matcha">One app. Three counters.</p>
            <h1 className="mt-4 max-w-xl font-display text-5xl leading-[0.96] text-ink md:text-7xl">
              Loyalty ops for a small matcha bar.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-ink/68">
              A clickable first pass with the same route boundaries the Railway-backed app will use.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ActionLink href="/customer" icon={ArrowRight}>Open customer app</ActionLink>
              <ActionLink href="/manager" variant="secondary">Manager console</ActionLink>
            </div>
          </div>

          <div className="grid gap-4">
            {surfaces.map((surface) => (
              <a
                key={surface.href}
                href={surface.href}
                className="matcha-card group flex items-center justify-between rounded-[8px] p-5 transition hover:-translate-y-1"
              >
                <span className="flex items-center gap-4">
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-matcha/12 text-moss">
                    <surface.icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-lg font-bold text-ink">{surface.title}</span>
                    <span className="mt-1 block text-sm text-ink/60">{surface.detail}</span>
                  </span>
                </span>
                <ArrowRight className="h-5 w-5 text-moss transition group-hover:translate-x-1" aria-hidden="true" />
              </a>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
