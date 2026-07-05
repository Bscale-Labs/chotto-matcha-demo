"use client";

import Link, { useLinkStatus } from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { clsx } from "clsx";
import {
  BadgeCheck,
  BarChart3,
  Building2,
  Gift,
  LoaderCircle,
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

function PendingIndicator({ active }: { active: boolean }) {
  const { pending } = useLinkStatus();

  return (
    <span
      className="ml-auto grid h-4 w-4 shrink-0 place-items-center"
      aria-live="polite"
      aria-atomic="true"
    >
      {pending ? (
        <>
          <LoaderCircle
            className={clsx("h-4 w-4 animate-spin", active ? "text-cream" : "text-matcha-deep")}
            strokeWidth={1.9}
            aria-hidden="true"
          />
          <span className="sr-only">Loading</span>
        </>
      ) : null}
    </span>
  );
}

export function ManagerNav({
  branches
}: {
  branches: Array<{ id: string; name: string }>;
}) {
  const pathname = usePathname() ?? "/manager";
  const searchParams = useSearchParams();
  const selectedRewardBranchId = searchParams.get("branchId");

  return (
    <nav className="grid gap-0.5">
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
                "flex min-h-[52px] items-center gap-3 rounded-lg px-4 py-3 text-[15px] font-medium transition-colors duration-fast ease-out-soft",
                isActive
                  ? "action-lacquer"
                  : "text-charcoal hover:bg-sage-wash hover:text-matcha-deep"
              )}
            >
              <span className="flex min-w-0 items-center gap-3">
                <Icon
                  className={clsx("h-5 w-5 shrink-0", isActive ? "text-cream" : "text-matcha-deep")}
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
                <span className="truncate">{item.label}</span>
              </span>
              <PendingIndicator active={isActive} />
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
                        "flex min-h-[46px] items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-fast ease-out-soft",
                        isBranchActive
                          ? "action-lacquer"
                          : "text-ink-muted hover:bg-sage-wash hover:text-matcha-deep"
                      )}
                    >
                      <span className="min-w-0 flex-1 truncate">{branch.name}</span>
                      <PendingIndicator active={isBranchActive} />
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
