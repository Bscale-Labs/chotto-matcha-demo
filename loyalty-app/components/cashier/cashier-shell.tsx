import Link from "next/link";
import { LogOut, ScanLine, Sparkles, UsersRound } from "lucide-react";
import { Brand } from "@/components/shared/brand";

const nav = [
  { href: "/cashier", label: "Roster", icon: UsersRound },
  { href: "/cashier/identify", label: "Identify", icon: ScanLine }
];

export function CashierShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-stone py-6">
      <div className="mx-auto max-w-6xl px-5">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Brand href="/cashier" size="sm" />
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-pill border border-line-soft bg-cream px-3 py-1.5 text-sm text-charcoal">
              <Sparkles className="h-3.5 w-3.5 text-matcha-deep" strokeWidth={1.5} aria-hidden="true" />
              BGC Matcha Bar · Mika
            </span>
            <Link
              href="/"
              className="inline-flex min-h-tap items-center gap-2 rounded-pill border border-line bg-cream px-4 text-sm font-medium text-charcoal transition-colors duration-fast ease-out-soft hover:border-matcha-deep hover:text-matcha-deep"
            >
              <LogOut className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
              End shift
            </Link>
          </div>
        </header>
        <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
          <aside className="rounded-lg border border-line-soft bg-cream p-2 lg:min-h-[calc(100vh-8rem)]">
            <nav className="grid gap-1">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium text-charcoal transition-colors duration-fast ease-out-soft hover:bg-sage-wash hover:text-matcha-deep"
                >
                  <item.icon className="h-4 w-4 text-matcha-deep" strokeWidth={1.5} aria-hidden="true" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>
          <section>{children}</section>
        </div>
      </div>
    </main>
  );
}
