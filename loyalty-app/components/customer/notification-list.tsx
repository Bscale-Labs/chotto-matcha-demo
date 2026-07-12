"use client";

import { useState } from "react";
import Link from "next/link";
import { clsx } from "clsx";
import { Bell, Gift, Leaf, PackageCheck, Settings2, Sparkles } from "lucide-react";
import type { LucideProps } from "lucide-react";
import type { ComponentType } from "react";
import type { CustomerNotification, NotificationKind } from "@/lib/notifications";

type Tone = "matcha" | "honey" | "gold" | "neutral";

const kindMeta: Record<NotificationKind, { icon: ComponentType<LucideProps>; label: string; tone: Tone }> = {
  ready: { icon: Sparkles, label: "Ready to redeem", tone: "matcha" },
  restock: { icon: PackageCheck, label: "Back in stock", tone: "gold" },
  earn: { icon: Leaf, label: "Points earned", tone: "matcha" },
  redeem: { icon: Gift, label: "Redeemed", tone: "honey" },
  adjustment: { icon: Settings2, label: "Balance update", tone: "neutral" }
};

const toneClasses: Record<Tone, string> = {
  matcha: "bg-sage-wash text-matcha-deep",
  honey: "bg-honey-wash text-honey",
  gold: "bg-gold-wash text-gold-deep",
  neutral: "bg-line-soft text-ink-muted"
};

export function NotificationList({
  notifications,
  onNavigate
}: {
  notifications: CustomerNotification[];
  /** Called when a row is tapped — lets the popup close as it navigates away. */
  onNavigate?: () => void;
}) {
  // No read-state persistence layer exists, so "read" is tracked locally for the
  // session — Mark all as read clears the unread treatment in place.
  const [readIds, setReadIds] = useState<ReadonlySet<string>>(new Set());

  if (notifications.length === 0) {
    return <EmptyState />;
  }

  const isUnread = (notification: CustomerNotification) =>
    notification.unread && !readIds.has(notification.id);
  const unread = notifications.filter(isUnread);
  const earlier = notifications.filter((notification) => !isUnread(notification));
  const unreadCount = unread.length;

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-ink-muted">
          {unreadCount > 0
            ? `${unreadCount} new ${unreadCount === 1 ? "update" : "updates"}`
            : "You're all caught up"}
        </p>
        {unreadCount > 0 ? (
          <button
            type="button"
            onClick={() => setReadIds(new Set(notifications.map((notification) => notification.id)))}
            className="inline-flex min-h-tap items-center rounded-pill px-1 text-sm font-medium text-matcha-deep transition-colors duration-fast ease-out-soft hover:text-forest"
          >
            Mark all as read
          </button>
        ) : null}
      </div>

      <div className="-mr-2 mt-4 max-h-[58vh] overflow-y-auto overscroll-contain pr-2">
        {unread.length > 0 ? (
          <NotificationSection title="New">
            {unread.map((notification) => (
              <NotificationRow
                key={notification.id}
                notification={notification}
                unread
                onNavigate={onNavigate}
              />
            ))}
          </NotificationSection>
        ) : null}

        {earlier.length > 0 ? (
          <NotificationSection title="Earlier">
            {earlier.map((notification) => (
              <NotificationRow
                key={notification.id}
                notification={notification}
                unread={false}
                onNavigate={onNavigate}
              />
            ))}
          </NotificationSection>
        ) : null}
      </div>
    </div>
  );
}

function NotificationSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-5 first:mt-0">
      <p className="eyebrow text-ink-muted">{title}</p>
      <ul className="mt-2 grid gap-2">{children}</ul>
    </section>
  );
}

function NotificationRow({
  notification,
  unread,
  onNavigate
}: {
  notification: CustomerNotification;
  unread: boolean;
  onNavigate?: () => void;
}) {
  const meta = kindMeta[notification.kind];
  const Icon = meta.icon;

  return (
    <li>
      <Link
        href={notification.href}
        onClick={onNavigate}
        className={clsx(
          "flex items-start gap-3 rounded-md p-4 transition-colors duration-fast ease-out-soft",
          unread
            ? "border border-sage-tint bg-sage-wash/60 hover:bg-sage-wash"
            : "surface-paper hover:border-line"
        )}
      >
        <span
          className={clsx("grid h-10 w-10 shrink-0 place-items-center rounded-pill", toneClasses[meta.tone])}
          aria-hidden="true"
        >
          <Icon className="h-4 w-4" strokeWidth={1.75} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <p
              className={clsx(
                "min-w-0 text-sm text-charcoal",
                unread ? "font-semibold" : "font-medium"
              )}
            >
              {notification.title}
            </p>
            <span className="shrink-0 whitespace-nowrap text-xs leading-5 text-ink-faint">
              {notification.timeLabel}
            </span>
          </div>
          <p className="mt-0.5 text-xs leading-[17px] text-ink-muted">{notification.body}</p>
          <p className="eyebrow mt-1.5 text-[10px] text-ink-faint">{meta.label}</p>
        </div>
        {unread ? (
          <span
            className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-matcha-deep"
            aria-label="Unread"
          />
        ) : null}
      </Link>
    </li>
  );
}

function EmptyState() {
  return (
    <div className="grid place-items-center py-6 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-pill bg-sage-wash text-matcha-deep">
        <Bell className="h-6 w-6" strokeWidth={1.5} aria-hidden="true" />
      </span>
      <p className="mt-4 font-display text-[20px] font-medium leading-7 text-charcoal">
        You&apos;re all caught up
      </p>
      <p className="mt-1 max-w-[15rem] text-sm leading-5 text-ink-muted">
        New rewards, restocks, and points activity will land here.
      </p>
    </div>
  );
}
