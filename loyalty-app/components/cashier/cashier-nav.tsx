"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { LayoutDashboard, Package, ReceiptText, ScanLine, UserRound, UsersRound } from "lucide-react";
import type { ComponentType } from "react";
import type { LucideProps } from "lucide-react";

type NavItem = {
  href: string;
  label: string;
  icon: ComponentType<LucideProps>;
};

type CashierNavMode = "service" | "manager";

const serviceItems: NavItem[] = [
  { href: "/cashier/start", label: "Dashboard", icon: LayoutDashboard },
  { href: "/cashier/identify", label: "Identify", icon: ScanLine }
];

const managerItems: NavItem[] = [
  { href: "/cashier/ledger", label: "Ledger", icon: ReceiptText },
  { href: "/cashier/customers", label: "Customers", icon: UserRound },
  { href: "/cashier/stock", label: "Stock", icon: Package },
  { href: "/cashier/accounts", label: "Accounts", icon: UsersRound }
];

export function CashierNav({ mode = "service" }: { mode?: CashierNavMode }) {
  const pathname = usePathname() ?? "/cashier";
  const items = mode === "manager" ? managerItems : serviceItems;

  return (
    <nav className="grid gap-1">
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
              "flex min-h-[44px] items-center gap-2.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors duration-fast ease-out-soft",
              isActive ? "action-lacquer" : "text-charcoal hover:bg-sage-wash hover:text-matcha-deep"
            )}
          >
            <span className="flex min-w-0 items-center gap-2.5">
              <Icon
                className={clsx("h-[18px] w-[18px] shrink-0", isActive ? "text-cream" : "text-matcha-deep")}
                strokeWidth={1.75}
                aria-hidden="true"
              />
              <span className="truncate">{item.label}</span>
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
