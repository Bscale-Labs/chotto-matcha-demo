"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import {
  BadgeCheck,
  BarChart3,
  Building2,
  Gift,
  ReceiptText,
  Settings,
  UsersRound
} from "lucide-react";
import type { ComponentType } from "react";
import type { LucideProps } from "lucide-react";

type NavItem = {
  href: string;
  label: string;
  icon: ComponentType<LucideProps>;
};

const items: NavItem[] = [
  { href: "/manager", label: "Dashboard", icon: BarChart3 },
  { href: "/manager/rewards", label: "Rewards", icon: Gift },
  { href: "/manager/branches", label: "Branches", icon: Building2 },
  { href: "/manager/staff", label: "Staff", icon: BadgeCheck },
  { href: "/manager/customers", label: "Customers", icon: UsersRound },
  { href: "/manager/transactions", label: "Transactions", icon: ReceiptText },
  { href: "/manager/settings", label: "Settings", icon: Settings }
];

export function ManagerNav() {
  const pathname = usePathname() ?? "/manager";

  return (
    <nav className="grid gap-0.5">
      {items.map((item) => {
        const isActive =
          item.href === "/manager"
            ? pathname === "/manager"
            : pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={clsx(
              "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors duration-fast ease-out-soft",
              isActive
                ? "bg-matcha-deep text-cream"
                : "text-charcoal hover:bg-sage-wash hover:text-matcha-deep"
            )}
          >
            <Icon
              className={clsx("h-4 w-4", isActive ? "text-cream" : "text-matcha-deep")}
              strokeWidth={1.75}
              aria-hidden="true"
            />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
