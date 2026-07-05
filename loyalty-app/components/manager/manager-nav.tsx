"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { clsx } from "clsx";
import {
  BadgeCheck,
  BarChart3,
  Building2,
  Gift,
  Medal,
  ReceiptText,
  UsersRound
} from "lucide-react";
import type { ComponentType } from "react";
import type { LucideProps } from "lucide-react";

type NavItem = {
  href: string;
  label: string;
  icon: ComponentType<LucideProps>;
  children?: "rewardBranches";
};

const items: NavItem[] = [
  { href: "/manager", label: "Dashboard", icon: BarChart3 },
  { href: "/manager/rewards", label: "Rewards", icon: Gift, children: "rewardBranches" },
  { href: "/manager/reward-tiers", label: "Reward Tiers", icon: Medal },
  { href: "/manager/branches", label: "Branches", icon: Building2 },
  { href: "/manager/staff", label: "Staff", icon: BadgeCheck },
  { href: "/manager/customers", label: "Customers", icon: UsersRound },
  { href: "/manager/transactions", label: "Transactions", icon: ReceiptText }
];

export function ManagerNav({
  branches
}: {
  branches: Array<{ id: string; name: string }>;
}) {
  const pathname = usePathname() ?? "/manager";
  const searchParams = useSearchParams();
  const selectedRewardBranchId = searchParams.get("branchId");

  return (
    <nav className="grid gap-1">
      {items.map((item) => {
        const isRewardSection = pathname === "/manager/rewards" || pathname.startsWith("/manager/rewards/");
        const isRewardParent = item.href === "/manager/rewards";
        const isActive =
          item.href === "/manager"
            ? pathname === "/manager"
            : isRewardParent
              ? isRewardSection && !selectedRewardBranchId
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;
        return (
          <div key={item.href}>
            <Link
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={clsx(
                "flex min-h-[44px] items-center gap-2.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors duration-fast ease-out-soft",
                isActive
                  ? "action-lacquer"
                  : "text-charcoal hover:bg-sage-wash hover:text-matcha-deep"
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
            {item.children === "rewardBranches" && branches.length > 0 ? (
              <div className="ml-5 mt-1 grid gap-0.5 border-l border-line-soft pl-3">
                {branches.map((branch) => {
                  const isBranchActive = isRewardSection && selectedRewardBranchId === branch.id;
                  return (
                    <Link
                      key={branch.id}
                      href={`/manager/rewards?branchId=${branch.id}`}
                      aria-current={isBranchActive ? "page" : undefined}
                      className={clsx(
                        "flex min-h-[40px] items-center gap-2 rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors duration-fast ease-out-soft",
                        isBranchActive
                          ? "action-lacquer"
                          : "text-ink-muted hover:bg-sage-wash hover:text-matcha-deep"
                      )}
                    >
                      <span className="min-w-0 flex-1 truncate">{branch.name}</span>
                    </Link>
                  );
                })}
              </div>
            ) : null}
          </div>
        );
      })}
    </nav>
  );
}
