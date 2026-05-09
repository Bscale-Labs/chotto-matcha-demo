import Link from "next/link";
import { BarChart3, Building2, Gift, ReceiptText, Settings, UsersRound } from "lucide-react";
import { Brand } from "@/components/shared/brand";
import { requireManagerSession } from "@/lib/auth/session";

const nav = [
  { href: "/manager", label: "Dashboard", icon: BarChart3 },
  { href: "/manager/rewards", label: "Rewards", icon: Gift },
  { href: "/manager/branches", label: "Branches", icon: Building2 },
  { href: "/manager/staff", label: "Staff", icon: UsersRound },
  { href: "/manager/customers", label: "Customers", icon: UsersRound },
  { href: "/manager/transactions", label: "Transactions", icon: ReceiptText },
  { href: "/manager/settings", label: "Settings", icon: Settings }
];

export async function ManagerShell({ children }: { children: React.ReactNode }) {
  const { user } = await requireManagerSession();

  return (
    <main className="min-h-screen bg-stone py-6">
      <div className="mx-auto max-w-7xl px-5">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Brand href="/manager" size="sm" />
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-pill border border-line-soft bg-cream px-3 py-1.5 text-sm text-charcoal">
              <span className="grid h-5 w-5 place-items-center rounded-pill bg-sage-wash text-[10px] font-medium text-matcha-deep">
                {user.name.slice(0, 1).toUpperCase()}
              </span>
              {user.name}
            </span>
            <form action="/manager/logout" method="post">
              <button
                type="submit"
                className="inline-flex min-h-tap items-center gap-2 rounded-pill border border-line bg-cream px-4 text-sm font-medium text-charcoal transition-colors duration-fast ease-out-soft hover:border-matcha-deep hover:text-matcha-deep"
              >
                Sign out
              </button>
            </form>
          </div>
        </header>
        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
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
