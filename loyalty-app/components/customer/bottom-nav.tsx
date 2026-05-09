"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Gift, House, NotebookPen, QrCode, UserRound } from "lucide-react";
import type { LucideProps } from "lucide-react";
import type { ComponentType } from "react";
import { clsx } from "clsx";

type NavItem = {
  href: string;
  label: string;
  icon: ComponentType<LucideProps>;
  match?: (pathname: string) => boolean;
};

const items: NavItem[] = [
  { href: "/customer", label: "Home", icon: House, match: (p) => p === "/customer" },
  { href: "/customer/rewards", label: "Rewards", icon: Gift },
  { href: "/customer/qr", label: "Scan", icon: QrCode },
  { href: "/customer/activity", label: "Journal", icon: NotebookPen },
  { href: "/customer/profile", label: "Profile", icon: UserRound }
];

export function BottomNav() {
  const pathname = usePathname() ?? "/customer";

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-4 bottom-4 z-30 mx-auto flex max-w-md items-stretch justify-between rounded-pill border border-line-soft bg-cream/95 p-1.5 shadow-lg backdrop-blur"
    >
      {items.map((item) => {
        const isActive = item.match ? item.match(pathname) : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={clsx(
              "relative flex min-h-tap min-w-tap flex-1 flex-col items-center justify-center gap-0.5 rounded-pill px-2 py-2 transition-colors duration-fast ease-out-soft",
              isActive
                ? "bg-matcha-deep text-cream"
                : "text-ink-faint hover:bg-stone hover:text-matcha-deep"
            )}
          >
            <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
            <span className="text-[11px] font-medium leading-tight">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
