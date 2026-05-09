import Link from "next/link";
import { BadgeCheck, LogOut, ScanLine, UsersRound } from "lucide-react";
import { Brand } from "@/components/shared/brand";

export function CashierShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="grain min-h-screen px-5 py-5">
      <div className="relative mx-auto max-w-6xl">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <Brand href="/cashier" />
          <div className="flex items-center gap-2 rounded-full border border-moss/15 bg-white/70 px-3 py-2 text-sm font-bold text-moss">
            <BadgeCheck className="h-4 w-4" aria-hidden="true" />
            BGC Matcha Bar / Mika
          </div>
        </header>
        <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
          <aside className="matcha-card rounded-[8px] p-3 lg:min-h-[calc(100vh-8rem)]">
            <nav className="grid gap-2">
              <Link href="/cashier" className="flex items-center gap-3 rounded-[8px] px-4 py-3 text-sm font-bold text-ink hover:bg-matcha/10">
                <UsersRound className="h-4 w-4" aria-hidden="true" />
                Roster
              </Link>
              <Link href="/cashier/identify" className="flex items-center gap-3 rounded-[8px] px-4 py-3 text-sm font-bold text-ink hover:bg-matcha/10">
                <ScanLine className="h-4 w-4" aria-hidden="true" />
                Identify
              </Link>
              <Link href="/" className="flex items-center gap-3 rounded-[8px] px-4 py-3 text-sm font-bold text-persimmon hover:bg-persimmon/10">
                <LogOut className="h-4 w-4" aria-hidden="true" />
                End shift
              </Link>
            </nav>
          </aside>
          <section>{children}</section>
        </div>
      </div>
    </main>
  );
}
