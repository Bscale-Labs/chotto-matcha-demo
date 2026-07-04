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
      className="surface-glass fixed inset-x-4 bottom-4 z-30 mx-auto grid max-w-md grid-cols-5 gap-1 rounded-[28px] px-2 py-1.5"
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
              "group flex min-h-[60px] min-w-tap flex-col items-center justify-center gap-1 rounded-[22px] px-1 text-[11px] font-semibold leading-none transition-colors duration-fast ease-out-soft",
              isActive ? "action-lacquer" : "text-ink-faint hover:text-matcha-deep"
            )}
          >
            <span
              className={clsx(
                "grid h-7 w-7 place-items-center transition-colors duration-fast ease-out-soft",
                isActive ? "text-cream" : "group-hover:text-matcha-deep"
              )}
            >
              <Icon
                className="h-[22px] w-[22px]"
                strokeWidth={1.75}
                fill={isActive ? "currentColor" : "none"}
                aria-hidden="true"
              />
            </span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
