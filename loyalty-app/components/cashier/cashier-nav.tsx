"use client";

import Link, { useLinkStatus } from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { LayoutDashboard, LoaderCircle, ScanLine, Settings } from "lucide-react";
import type { ComponentType } from "react";
import type { LucideProps } from "lucide-react";

type NavItem = {
  href: string;
  label: string;
  icon: ComponentType<LucideProps>;
};

const items: NavItem[] = [
  { href: "/cashier", label: "Dashboard", icon: LayoutDashboard },
  { href: "/cashier/identify", label: "Identify", icon: ScanLine }
];

function PendingIndicator({ active }: { active: boolean }) {
  const { pending } = useLinkStatus();

  return (
    <span className="grid h-4 w-4 place-items-center" aria-live="polite" aria-atomic="true">
      {pending ? (
        <>
          <LoaderCircle
            className={clsx("h-4 w-4 animate-spin", active ? "text-matcha-deep" : "text-cream")}
            strokeWidth={1.9}
            aria-hidden="true"
          />
          <span className="sr-only">Loading</span>
        </>
      ) : null}
    </span>
  );
}

export function CashierNav() {
  const pathname = usePathname() ?? "/cashier";

  return (
    <nav className="relative z-10 flex h-full flex-col">
      <div className="grid gap-2">
        {items.map((item) => {
          const isActive =
            item.href === "/cashier"
              ? pathname === "/cashier"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={clsx(
                "grid min-h-[80px] place-items-center gap-1 rounded-lg px-2 py-3 text-center text-xs font-semibold transition-colors duration-fast ease-out-soft",
                isActive
                  ? "gloss bg-cream text-matcha-deep"
                  : "text-cream/90 hover:bg-white/10 hover:text-cream"
              )}
            >
              <Icon
                className={clsx("h-6 w-6", isActive ? "text-matcha-deep" : "text-cream")}
                strokeWidth={1.75}
                aria-hidden="true"
              />
              {item.label}
              <PendingIndicator active={isActive} />
            </Link>
          );
        })}
      </div>
      <div className="mt-auto grid min-h-[80px] place-items-center gap-1.5 rounded-lg px-2 py-3 text-center text-xs font-semibold text-cream/80">
        <Settings className="h-6 w-6 text-cream/90" strokeWidth={1.75} aria-hidden="true" />
        Settings
      </div>
    </nav>
  );
}
