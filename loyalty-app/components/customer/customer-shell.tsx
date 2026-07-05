import Link from "next/link";
import { Bell } from "lucide-react";
import { Brand } from "@/components/shared/brand";
import { BottomNav } from "@/components/customer/bottom-nav";
import { Tooltip } from "@/components/shared/tooltip";

export function CustomerShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="customer-surface min-h-screen overflow-x-hidden pb-28 pt-5">
      <div className="mx-auto max-w-md px-6">
        <header className="mb-3 flex items-center justify-between">
          <Brand href="/customer" size="sm" />
          <Tooltip label="Notifications" side="bottom" align="end">
            <Link
              href="/customer/profile"
              aria-label="Notifications"
              className="gloss grid h-11 w-11 place-items-center rounded-pill border border-line-soft bg-milk text-charcoal transition-colors duration-fast ease-out-soft hover:border-matcha-deep hover:text-matcha-deep"
            >
              <Bell className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
            </Link>
          </Tooltip>
        </header>
        {children}
      </div>
      <BottomNav />
    </main>
  );
}
