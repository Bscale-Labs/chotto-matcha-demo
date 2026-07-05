"use client";

import { useEffect, useRef, useState } from "react";
import Link, { useLinkStatus } from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { clsx } from "clsx";
import {
  BadgeCheck,
  BarChart3,
  Building2,
  ChevronDown,
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

const itemClass = (active: boolean) =>
  clsx(
    "flex items-center gap-2 whitespace-nowrap rounded-pill px-3 py-2 text-sm font-medium transition-colors duration-fast ease-out-soft",
    active ? "action-lacquer" : "text-charcoal hover:bg-sage-wash hover:text-matcha-deep"
  );

function PendingIndicator({ active }: { active: boolean }) {
  const { pending } = useLinkStatus();

  if (!pending) return null;

  return (
    <>
      <LoaderCircle
        className={clsx("h-3.5 w-3.5 animate-spin", active ? "text-cream" : "text-matcha-deep")}
        strokeWidth={1.9}
        aria-hidden="true"
      />
      <span className="sr-only">Loading</span>
    </>
  );
}

function RewardsNavItem({
  branches,
  isActive,
  isRewardSection,
  selectedBranchId
}: {
  branches: Array<{ id: string; name: string }>;
  isActive: boolean;
  isRewardSection: boolean;
  selectedBranchId: string | null;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const hasBranches = branches.length > 0;

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => hasBranches && setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <div
        className={clsx(
          "flex items-center rounded-pill transition-colors duration-fast ease-out-soft",
          isActive ? "action-lacquer" : "hover:bg-sage-wash"
        )}
      >
        <Link
          href="/manager/rewards"
          aria-current={isActive ? "page" : undefined}
          className={clsx(
            "flex items-center gap-2 whitespace-nowrap rounded-pill py-2 pl-3 text-sm font-medium transition-colors duration-fast ease-out-soft",
            hasBranches ? "pr-1" : "pr-3",
            isActive ? "text-cream" : "text-charcoal hover:text-matcha-deep"
          )}
        >
          <Gift
            className={clsx("h-4 w-4 shrink-0", isActive ? "text-cream" : "text-matcha-deep")}
            strokeWidth={1.75}
            aria-hidden="true"
          />
          <span>Rewards</span>
          <PendingIndicator active={isActive} />
        </Link>
        {hasBranches ? (
          <button
            type="button"
            aria-label="Toggle branch menu"
            aria-haspopup="menu"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className={clsx(
              "mr-1 grid h-7 w-7 shrink-0 place-items-center rounded-pill transition-colors duration-fast ease-out-soft",
              isActive ? "text-cream hover:bg-white/10" : "text-ink-muted hover:text-matcha-deep"
            )}
          >
            <ChevronDown
              className={clsx("h-4 w-4 transition-transform duration-fast", open && "rotate-180")}
              strokeWidth={2}
              aria-hidden="true"
            />
          </button>
        ) : null}
      </div>

      {open && hasBranches ? (
        <div
          role="menu"
          className="surface-glass-strong absolute left-0 top-full z-30 mt-1.5 min-w-[204px] rounded-lg p-1.5"
        >
          <Link
            href="/manager/rewards"
            role="menuitem"
            aria-current={isRewardSection && !selectedBranchId ? "page" : undefined}
            onClick={() => setOpen(false)}
            className={clsx(
              "flex min-h-[40px] items-center rounded-md px-3 text-sm font-medium transition-colors duration-fast ease-out-soft",
              isRewardSection && !selectedBranchId
                ? "action-lacquer text-cream"
                : "text-charcoal hover:bg-sage-wash hover:text-matcha-deep"
            )}
          >
            All branches
          </Link>
          {branches.map((branch) => {
            const branchActive = isRewardSection && selectedBranchId === branch.id;
            return (
              <Link
                key={branch.id}
                href={`/manager/rewards?branchId=${branch.id}`}
                role="menuitem"
                aria-current={branchActive ? "page" : undefined}
                onClick={() => setOpen(false)}
                className={clsx(
                  "flex min-h-[40px] items-center rounded-md px-3 text-sm font-medium transition-colors duration-fast ease-out-soft",
                  branchActive
                    ? "action-lacquer text-cream"
                    : "text-charcoal hover:bg-sage-wash hover:text-matcha-deep"
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
}

export function ManagerNav({
  branches
}: {
  branches: Array<{ id: string; name: string }>;
}) {
  const pathname = usePathname() ?? "/manager";
  const searchParams = useSearchParams();
  const selectedRewardBranchId = searchParams.get("branchId");
  const isRewardSection = pathname === "/manager/rewards" || pathname.startsWith("/manager/rewards/");

  return (
    <nav className="flex flex-wrap items-center gap-1">
      {items.map((item) => {
        if (item.href === "/manager/rewards") {
          return (
            <RewardsNavItem
              key={item.href}
              branches={branches}
              isActive={isRewardSection}
              isRewardSection={isRewardSection}
              selectedBranchId={selectedRewardBranchId}
            />
          );
        }

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
            className={itemClass(isActive)}
          >
            <Icon
              className={clsx("h-4 w-4 shrink-0", isActive ? "text-cream" : "text-matcha-deep")}
              strokeWidth={1.75}
              aria-hidden="true"
            />
            <span>{item.label}</span>
            <PendingIndicator active={isActive} />
          </Link>
        );
      })}
    </nav>
  );
}
