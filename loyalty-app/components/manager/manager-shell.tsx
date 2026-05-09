import Link from "next/link";
import { BarChart3, Building2, Gift, ReceiptText, Settings, UsersRound } from "lucide-react";
import { Brand } from "@/components/shared/brand";

const nav = [
  { href: "/manager", label: "Dashboard", icon: BarChart3 },
  { href: "/manager/rewards", label: "Rewards", icon: Gift },
  { href: "/manager/branches", label: "Branches", icon: Building2 },
  { href: "/manager/staff", label: "Staff", icon: UsersRound },
  { href: "/manager/customers", label: "Customers", icon: UsersRound },
  { href: "/manager/transactions", label: "Transactions", icon: ReceiptText },
  { href: "/manager/settings", label: "Settings", icon: Settings }
];

export function ManagerShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="grain min-h-screen px-5 py-5">
      <div className="relative mx-auto max-w-7xl">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <Brand href="/manager" />
          <div className="rounded-full border border-moss/15 bg-white/70 px-4 py-2 text-sm font-bold text-moss">
            Manager / Aya Santos
          </div>
        </header>
        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
          <aside className="matcha-card rounded-[8px] p-3 lg:min-h-[calc(100vh-8rem)]">
            <nav className="grid gap-1">
              {nav.map((item) => (
                <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-[8px] px-4 py-3 text-sm font-bold text-ink hover:bg-matcha/10">
                  <item.icon className="h-4 w-4 text-moss" aria-hidden="true" />
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
