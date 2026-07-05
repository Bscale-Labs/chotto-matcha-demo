"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { LogOut, Settings } from "lucide-react";
import { initials } from "@/lib/formatters";

export function ManagerProfileMenu({ name }: { name: string }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <div ref={menuRef} className="relative">
      {open ? (
        <div
          style={{ position: "absolute", left: 0, right: 0, bottom: "100%" }}
          className="surface-glass-strong z-20 mb-2 rounded-lg p-1.5"
        >
          <Link
            href="/manager/settings"
            className="flex min-h-tap items-center gap-2 rounded-md px-3 text-sm font-medium text-charcoal transition-colors duration-fast ease-out-soft hover:bg-sage-wash hover:text-matcha-deep"
            onClick={() => setOpen(false)}
          >
            <Settings className="h-4 w-4 text-matcha-deep" strokeWidth={1.75} aria-hidden="true" />
            Settings
          </Link>
          <form action="/manager/logout" method="post">
            <button
              type="submit"
              className="flex min-h-tap w-full items-center gap-2 rounded-md px-3 text-left text-sm font-medium text-charcoal transition-colors duration-fast ease-out-soft hover:bg-sage-wash hover:text-matcha-deep"
            >
              <LogOut className="h-4 w-4 text-matcha-deep" strokeWidth={1.75} aria-hidden="true" />
              Sign out
            </button>
          </form>
        </div>
      ) : null}
      <button
        type="button"
        aria-expanded={open}
        className="gloss flex min-h-[56px] w-full items-center gap-3 rounded-lg border border-line-soft bg-milk p-2.5 text-left transition-colors duration-fast ease-out-soft hover:border-matcha-deep hover:bg-sage-wash"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-pill bg-matcha-deep text-sm font-semibold text-cream">
          {initials(name)}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium text-charcoal">{name}</span>
          <span className="mt-0.5 block text-xs text-ink-muted">Manager</span>
        </span>
      </button>
    </div>
  );
}
