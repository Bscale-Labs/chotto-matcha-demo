"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import { Modal } from "@/components/shared/modal";
import { Tooltip } from "@/components/shared/tooltip";
import { NotificationList } from "@/components/customer/notification-list";
import type { CustomerNotification } from "@/lib/notifications";

/**
 * The header bell — opens the notification feed in a popup instead of routing to
 * a dedicated page. Data is fetched server-side (in CustomerShell) and handed in.
 */
export function NotificationBell({
  notifications,
  unread
}: {
  notifications: CustomerNotification[];
  unread: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Tooltip label="Notifications" side="bottom" align="end">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-label={unread > 0 ? `Notifications, ${unread} unread` : "Notifications"}
          className="gloss relative grid h-11 w-11 place-items-center rounded-pill border border-line-soft bg-milk text-charcoal transition-colors duration-fast ease-out-soft hover:border-matcha-deep hover:text-matcha-deep"
        >
          <Bell className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
          {unread > 0 ? (
            <span
              className="counter absolute -right-1 -top-1 grid h-[18px] min-w-[18px] place-items-center rounded-pill border-2 border-cream bg-matcha-deep px-1 text-[10px] font-semibold leading-none text-cream"
              aria-hidden="true"
            >
              {unread > 9 ? "9+" : unread}
            </span>
          ) : null}
        </button>
      </Tooltip>

      <Modal open={open} onClose={() => setOpen(false)} title="Notifications">
        <NotificationList notifications={notifications} onNavigate={() => setOpen(false)} />
      </Modal>
    </>
  );
}
