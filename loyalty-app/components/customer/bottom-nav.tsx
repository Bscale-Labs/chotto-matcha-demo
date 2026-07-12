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
  feature?: boolean;
};

const items: NavItem[] = [
  { href: "/customer", label: "Home", icon: House, match: (p) => p === "/customer" },
  { href: "/customer/rewards", label: "Rewards", icon: Gift },
  { href: "/customer/qr", label: "Scan", icon: QrCode, feature: true },
  { href: "/customer/activity", label: "History", icon: NotebookPen },
  { href: "/customer/profile", label: "Profile", icon: UserRound }
];

export function BottomNav() {
  const pathname = usePathname() ?? "/customer";

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-md">
      {/* Glass bar sits on its own layer so the raised Scan leaf can overflow above it
          without being clipped by surface-glass's overflow:hidden. */}
      <div className="relative">
        {/* Opaque base keeps page content from showing through the bar while scrolling;
            the glass layer on top rides on solid milk instead of the live page. */}
        <div className="absolute inset-0 rounded-t-[28px] bg-milk" aria-hidden="true" />
        <div className="surface-glass absolute inset-0 rounded-t-[28px]" aria-hidden="true" />
        <nav
          aria-label="Primary"
          className="relative grid grid-cols-5 gap-1 px-2 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]"
        >
          {items.map((item) => {
            const isActive = item.match ? item.match(pathname) : pathname.startsWith(item.href);
            const Icon = item.icon;

            if (item.feature) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={clsx(
                    "group relative flex min-h-[60px] min-w-tap flex-col items-center justify-center gap-1 px-1 text-[11px] font-semibold leading-none",
                    isActive ? "text-matcha-deep" : "text-ink-faint"
                  )}
                >
                  {/* Raised, leaf-shaped scan action — the app's signature moment.
                      Cream wrapper forms the ring (a Tailwind ring would be overridden
                      by the lacquer's own box-shadow). Green while it's the active tab,
                      the same muted tone as the other resting icons otherwise, so it
                      never reads permanently-on. */}
                  <span
                    className={clsx(
                      "absolute left-1/2 top-0 grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[50%_14%_50%_14%] bg-milk p-[5px] transition-transform duration-fast ease-out-soft group-active:scale-95",
                      isActive
                        ? "shadow-[0_10px_24px_rgba(47,75,46,0.30)]"
                        : "shadow-[0_10px_24px_rgba(156,160,149,0.32)]"
                    )}
                    aria-hidden="true"
                  >
                    <span
                      className={clsx(
                        "grid h-12 w-12 place-items-center rounded-[50%_14%_50%_14%] transition-colors duration-base ease-out-soft",
                        isActive ? "action-lacquer" : "action-lacquer-mute"
                      )}
                    >
                      <QrCode className="h-6 w-6 text-cream" strokeWidth={1.75} aria-hidden="true" />
                    </span>
                  </span>
                  {/* Reserve the icon slot so the label lines up with the other tabs. */}
                  <span className="h-7 w-7" aria-hidden="true" />
                  <span>Scan</span>
                </Link>
              );
            }

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
      </div>
    </div>
  );
}
