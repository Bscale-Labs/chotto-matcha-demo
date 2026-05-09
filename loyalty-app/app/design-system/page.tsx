import Link from "next/link";
import { ArrowUpRight, Check, Gift, Leaf, QrCode, Search, X } from "lucide-react";
import { Brand } from "@/components/shared/brand";
import { Button } from "@/components/shared/button";
import { Pill } from "@/components/shared/pill";
import { Input } from "@/components/shared/input";
import { Toast } from "@/components/shared/toast";
import { TierBadge } from "@/components/customer/tier-badge";
import { PointsBalanceCard } from "@/components/customer/points-balance-card";
import { RewardCard } from "@/components/customer/reward-card";
import { customers, rewards } from "@/lib/mock-data";
import { getNextTier, getTier, leavesToNextTier, tierProgress, tiers } from "@/lib/loyalty";

const colorTokens = [
  { token: "--matcha-deep", hex: "#2F4B2E", role: "Primary actions · headlines" },
  { token: "--forest", hex: "#3E5A36", role: "Hover · depth" },
  { token: "--sage", hex: "#A8B48A", role: "Accent · soft" },
  { token: "--sage-tint", hex: "#DCE3CD", role: "Pressed · badges" },
  { token: "--sage-wash", hex: "#EEF1E5", role: "Hover bg · toasts" },
  { token: "--stone", hex: "#F3F1EC", role: "Quiet surface" },
  { token: "--cream", hex: "#FAF7F2", role: "Page background" },
  { token: "--charcoal", hex: "#2B2B2B", role: "Body text" },
  { token: "--ink-muted", hex: "#6B6E66", role: "Captions" },
  { token: "--ink-faint", hex: "#9CA095", role: "Placeholders" },
  { token: "--line", hex: "#E4E1D9", role: "Borders" },
  { token: "--line-soft", hex: "#ECE9E2", role: "Dividers" }
];

const radiusTokens = [
  { token: "--r-sm", value: "8px", className: "rounded-sm" },
  { token: "--r-md", value: "12px", className: "rounded-md" },
  { token: "--r-lg", value: "16px", className: "rounded-lg" },
  { token: "--r-xl", value: "24px", className: "rounded-xl" },
  { token: "--r-pill", value: "999px", className: "rounded-pill" }
];

const spacingTokens = [
  { token: "--s-1", px: 4 },
  { token: "--s-2", px: 8 },
  { token: "--s-3", px: 12 },
  { token: "--s-4", px: 16 },
  { token: "--s-5", px: 24 },
  { token: "--s-6", px: 32 },
  { token: "--s-7", px: 40 },
  { token: "--s-8", px: 48 },
  { token: "--s-9", px: 64 }
];

const sections = [
  { id: "color", label: "Color" },
  { id: "type", label: "Typography" },
  { id: "spacing", label: "Spacing" },
  { id: "radius", label: "Radius" },
  { id: "elevation", label: "Elevation" },
  { id: "buttons", label: "Buttons" },
  { id: "pills", label: "Pills" },
  { id: "forms", label: "Forms" },
  { id: "components", label: "Components" },
  { id: "tiers", label: "Tiers" },
  { id: "voice", label: "Voice" }
];

export default function DesignSystemPage() {
  const customer = customers[0];
  const tier = getTier(customer.pointsBalance);
  const nextTier = getNextTier(customer.pointsBalance);
  const toNext = leavesToNextTier(customer.pointsBalance);
  const progress = tierProgress(customer.pointsBalance);

  return (
    <main className="min-h-screen bg-cream pb-24">
      <header className="border-b border-line-soft bg-cream">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Brand size="sm" />
          <Pill tone="default">v1.0 · May 2026</Pill>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-12 lg:grid-cols-[200px_1fr]">
        <aside className="lg:sticky lg:top-6 lg:h-fit">
          <p className="eyebrow text-ink-muted">Contents</p>
          <nav className="mt-3 grid gap-0.5">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="rounded-md px-3 py-2 text-sm text-charcoal transition-colors duration-fast ease-out-soft hover:bg-sage-wash hover:text-matcha-deep"
              >
                {section.label}
              </a>
            ))}
          </nav>
        </aside>

        <div className="space-y-16">
          <section>
            <p className="eyebrow text-matcha-deep">Foundation</p>
            <h1 className="mt-3 font-display text-[56px] font-medium leading-[60px] tracking-display text-charcoal">
              Chotto Matcha — Design System
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-ink-muted">
              Quiet, thoughtful, and made to bring a moment of calm. Tokens, components, and voice
              for the loyalty app — Seedling, Whisk, Ceremony.
            </p>
          </section>

          <section id="color" className="scroll-mt-6">
            <SectionHeader eyebrow="01" title="Color" />
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {colorTokens.map((color) => (
                <div
                  key={color.token}
                  className="flex items-center gap-4 rounded-md border border-line-soft bg-cream p-3"
                >
                  <span
                    className="h-14 w-14 shrink-0 rounded-md border border-line-soft"
                    style={{ background: color.hex }}
                    aria-hidden="true"
                  />
                  <div className="min-w-0">
                    <p className="font-mono text-xs text-charcoal">{color.token}</p>
                    <p className="counter mt-0.5 text-sm font-medium text-charcoal">{color.hex}</p>
                    <p className="text-xs text-ink-muted">{color.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section id="type" className="scroll-mt-6">
            <SectionHeader
              eyebrow="02"
              title="Typography"
              hint="Playfair Display for display & headings. Inter for everything below 18px."
            />
            <div className="mt-6 grid gap-6 rounded-lg border border-line-soft bg-cream p-7">
              <div>
                <p className="eyebrow text-ink-muted">Display 1 · Playfair 500 · 88/96</p>
                <p className="mt-2 font-display text-[88px] font-medium leading-[96px] tracking-display text-charcoal">
                  Quiet ritual.
                </p>
              </div>
              <div>
                <p className="eyebrow text-ink-muted">H1 · Playfair 700 · 48/52</p>
                <p className="mt-2 font-display text-[48px] font-bold leading-[52px] text-charcoal">
                  Welcome back, Haruka.
                </p>
              </div>
              <div>
                <p className="eyebrow text-ink-muted">H2 · Playfair 600 · 32/38</p>
                <p className="mt-2 font-display text-[32px] font-semibold leading-[38px] text-charcoal">
                  Today&apos;s moment
                </p>
              </div>
              <div>
                <p className="eyebrow text-ink-muted">H3 · Playfair 500 · 24/30</p>
                <p className="mt-2 font-display text-[24px] font-medium leading-[30px] text-charcoal">
                  Ready to redeem
                </p>
              </div>
              <div>
                <p className="eyebrow text-ink-muted">Body · Inter 400 · 16/24</p>
                <p className="mt-2 text-base leading-6 text-charcoal">
                  You earned 50 leaves. Keep going, matcha lover.
                </p>
              </div>
              <div>
                <p className="eyebrow text-ink-muted">Body Strong · Inter 600 · 16/24</p>
                <p className="mt-2 text-base font-semibold leading-6 text-charcoal">
                  Your next reward is 180 leaves away.
                </p>
              </div>
              <div>
                <p className="eyebrow text-ink-muted">Caption · Inter 400 · 12/18</p>
                <p className="mt-2 text-xs leading-[18px] text-ink-muted">
                  Just a moment — we&apos;re saving your reward.
                </p>
              </div>
              <div>
                <p className="eyebrow text-ink-muted">Eyebrow · Inter 600 · 11/16 · 0.16em</p>
                <p className="eyebrow mt-2 text-matcha-deep">Quiet ritual</p>
              </div>
            </div>
          </section>

          <section id="spacing" className="scroll-mt-6">
            <SectionHeader eyebrow="03" title="Spacing — 8pt grid" />
            <div className="mt-6 grid gap-2 rounded-lg border border-line-soft bg-cream p-7">
              {spacingTokens.map((token) => (
                <div key={token.token} className="flex items-center gap-4">
                  <span className="font-mono w-20 text-xs text-charcoal">{token.token}</span>
                  <span className="counter w-12 text-xs text-ink-muted">{token.px}px</span>
                  <span
                    className="h-3 rounded-pill bg-sage"
                    style={{ width: `${token.px * 4}px` }}
                    aria-hidden="true"
                  />
                </div>
              ))}
            </div>
          </section>

          <section id="radius" className="scroll-mt-6">
            <SectionHeader eyebrow="04" title="Radius" />
            <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {radiusTokens.map((r) => (
                <div
                  key={r.token}
                  className="grid place-items-center gap-2 rounded-md border border-line-soft bg-cream p-5"
                >
                  <span className={`h-16 w-16 bg-sage-wash ${r.className}`} aria-hidden="true" />
                  <p className="font-mono text-xs text-charcoal">{r.token}</p>
                  <p className="counter text-xs text-ink-muted">{r.value}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="elevation" className="scroll-mt-6">
            <SectionHeader eyebrow="05" title="Elevation" hint="Shadows are restraint, not decoration." />
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-md bg-cream p-6 shadow-sm">
                <p className="font-mono text-xs text-charcoal">--shadow-sm</p>
                <p className="mt-2 text-sm text-ink-muted">Subtle lift</p>
              </div>
              <div className="rounded-md bg-cream p-6 shadow-md">
                <p className="font-mono text-xs text-charcoal">--shadow-md</p>
                <p className="mt-2 text-sm text-ink-muted">Floating panel</p>
              </div>
              <div className="rounded-md bg-cream p-6 shadow-lg">
                <p className="font-mono text-xs text-charcoal">--shadow-lg</p>
                <p className="mt-2 text-sm text-ink-muted">Modal · sheet</p>
              </div>
            </div>
          </section>

          <section id="buttons" className="scroll-mt-6">
            <SectionHeader eyebrow="06" title="Buttons" hint="Pill-shaped. One Primary per screen." />
            <div className="mt-6 grid gap-6 rounded-lg border border-line-soft bg-cream p-7">
              <div className="flex flex-wrap items-center gap-3">
                <Button>Earn leaves</Button>
                <Button variant="secondary">Skip for now</Button>
                <Button variant="tertiary">See all</Button>
                <Button variant="icon" icon={QrCode} aria-label="Scan" />
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button icon={Check}>Confirm</Button>
                <Button variant="secondary" icon={Gift}>Choose reward</Button>
                <Button disabled>Disabled</Button>
                <Button variant="secondary" disabled>Disabled</Button>
              </div>
            </div>
          </section>

          <section id="pills" className="scroll-mt-6">
            <SectionHeader eyebrow="07" title="Pills & badges" />
            <div className="mt-6 flex flex-wrap items-center gap-3 rounded-lg border border-line-soft bg-cream p-7">
              <Pill tone="default">+50 Leaves</Pill>
              <Pill tone="inverse" icon={Leaf}>Live</Pill>
              <Pill tone="soft">Resting</Pill>
              <Pill tone="muted">Closed</Pill>
              <Pill tone="warn">Out of stock</Pill>
              <TierBadge tier={tiers[0]} />
              <TierBadge tier={tiers[1]} />
              <TierBadge tier={tiers[2]} />
            </div>
          </section>

          <section id="forms" className="scroll-mt-6">
            <SectionHeader eyebrow="08" title="Forms" />
            <div className="mt-6 grid gap-5 rounded-lg border border-line-soft bg-cream p-7 md:grid-cols-2">
              <Input
                label="Email"
                placeholder="you@chottomatcha.ph"
                hint="We&apos;ll send a quiet receipt after each visit."
              />
              <Input
                label="Search"
                placeholder="Search phone or name"
                leadingIcon={<Search className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />}
              />
              <Input label="Phone" placeholder="+63 9xx xxx xxxx" />
              <Input
                label="Password"
                type="password"
                defaultValue="hello"
                error="That doesn&apos;t look right — try again."
              />
            </div>
          </section>

          <section id="components" className="scroll-mt-6">
            <SectionHeader eyebrow="09" title="Components" />
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <PointsBalanceCard
                leaves={customer.pointsBalance}
                tier={tier}
                nextTier={nextTier}
                leavesToNext={toNext}
                progress={progress}
              />
              <RewardCard reward={rewards[0]} customer={customer} />
              <RewardCard reward={rewards[2]} customer={customer} />
              <Toast
                title="You earned 50 Leaves"
                message="Keep going, matcha lover."
                icon={Leaf}
              />
              <div className="rounded-lg border border-line-soft bg-cream p-6 shadow-md">
                <h3 className="font-display text-[22px] leading-7 text-charcoal">Redeem reward?</h3>
                <p className="mt-2 text-sm leading-6 text-ink-muted">
                  This will spend 350 leaves on an Iced Matcha Latte.
                </p>
                <div className="mt-6 flex gap-3">
                  <Button variant="secondary" className="flex-1">Cancel</Button>
                  <Button className="flex-1">Confirm</Button>
                </div>
              </div>
              <div className="rounded-pill border border-line-soft bg-cream p-1.5 shadow-md">
                <div className="flex items-stretch justify-between">
                  {[
                    { label: "Home", active: true },
                    { label: "Rewards", active: false },
                    { label: "Scan", active: false },
                    { label: "Journal", active: false },
                    { label: "Profile", active: false }
                  ].map((tab) => (
                    <span
                      key={tab.label}
                      className={
                        tab.active
                          ? "flex flex-1 items-center justify-center rounded-pill bg-sage-wash px-4 py-2 text-xs font-medium text-matcha-deep"
                          : "flex flex-1 items-center justify-center rounded-pill px-4 py-2 text-xs font-medium text-ink-faint"
                      }
                    >
                      {tab.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section id="tiers" className="scroll-mt-6">
            <SectionHeader eyebrow="10" title="Tiers" hint="Status grows with cumulative leaves earned." />
            <ul className="mt-6 grid gap-3 sm:grid-cols-3">
              {tiers.map((row) => (
                <li
                  key={row.id}
                  className="flex items-center gap-3 rounded-md border border-line-soft bg-cream p-5"
                >
                  <span className="text-3xl" aria-hidden="true">
                    {row.glyph}
                  </span>
                  <div>
                    <p className="font-display text-[20px] font-medium leading-7 text-charcoal">
                      {row.name}
                    </p>
                    <p className="counter text-xs text-ink-muted">
                      {row.max === null
                        ? `${row.min}+ leaves`
                        : `${row.min}–${row.max} leaves`}
                    </p>
                    <p className="mt-1 text-xs text-ink-muted">{row.vibe}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section id="voice" className="scroll-mt-6">
            <SectionHeader eyebrow="11" title="Voice" hint="Warm. Thoughtful. Quietly celebratory." />
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-md border border-sage-tint bg-sage-wash p-5">
                <p className="eyebrow text-matcha-deep">Do</p>
                <ul className="mt-3 space-y-2 text-sm text-charcoal">
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-matcha-deep" strokeWidth={1.5} />
                    <span>You earned 50 Leaves. Keep going, matcha lover.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-matcha-deep" strokeWidth={1.5} />
                    <span>Just a moment — we&apos;re saving your reward.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-matcha-deep" strokeWidth={1.5} />
                    <span>Welcome back, Haruka.</span>
                  </li>
                </ul>
              </div>
              <div className="rounded-md border border-line-soft bg-cream p-5">
                <p className="eyebrow text-ink-muted">Don&apos;t</p>
                <ul className="mt-3 space-y-2 text-sm text-ink-muted">
                  <li className="flex items-start gap-2">
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-ink-faint" strokeWidth={1.5} />
                    <span>BOOM! +50 LEAVES UNLOCKED!!!</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-ink-faint" strokeWidth={1.5} />
                    <span>Loading… please wait.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-ink-faint" strokeWidth={1.5} />
                    <span>Hi User1234! Login successful.</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <footer className="border-t border-line-soft pt-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-matcha-deep hover:text-forest"
            >
              Back to surfaces
              <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
            </Link>
            <p className="mt-3 text-xs text-ink-muted">Chotto Matcha · Design System v1.0 · May 2026</p>
          </footer>
        </div>
      </div>
    </main>
  );
}

function SectionHeader({
  eyebrow,
  title,
  hint
}: {
  eyebrow: string;
  title: string;
  hint?: string;
}) {
  return (
    <div className="border-b border-line-soft pb-4">
      <p className="eyebrow text-ink-muted">{eyebrow}</p>
      <h2 className="mt-2 font-display text-[32px] font-semibold leading-[38px] text-charcoal">
        {title}
      </h2>
      {hint ? <p className="mt-2 text-sm leading-6 text-ink-muted">{hint}</p> : null}
    </div>
  );
}
