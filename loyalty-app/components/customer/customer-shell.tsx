import Link from "next/link";
import { Bell } from "lucide-react";
import { Brand } from "@/components/shared/brand";
import { BottomNav } from "@/components/customer/bottom-nav";

export function CustomerShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-cream pb-32 pt-6">
      <div className="mx-auto max-w-md px-5">
        <header className="mb-6 flex items-center justify-between">
          <Brand href="/customer" size="sm" />
          <Link
            href="/customer/profile"
            aria-label="Notifications"
            className="grid h-10 w-10 place-items-center rounded-pill border border-line-soft bg-cream text-charcoal shadow-sm transition-colors duration-fast ease-out-soft hover:border-matcha-deep hover:text-matcha-deep"
          >
            <Bell className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
          </Link>
        </header>
        {children}
      </div>
      <BottomNav />
    </main>
  );
}
