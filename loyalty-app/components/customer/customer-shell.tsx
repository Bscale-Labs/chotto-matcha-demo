import { clsx } from "clsx";
import { Brand } from "@/components/shared/brand";
import { BottomNav } from "@/components/customer/bottom-nav";
import { NotificationBell } from "@/components/customer/notification-bell";
import { requireCustomerSession } from "@/lib/auth/session";
import { countUnread, getCustomerNotifications } from "@/lib/notifications";

export async function CustomerShell({
  children,
  surfaceClassName = "customer-surface",
  inverseHeader = false,
}: {
  children: React.ReactNode;
  surfaceClassName?: string;
  inverseHeader?: boolean;
}) {
  const { customer } = await requireCustomerSession();
  const notifications = await getCustomerNotifications(customer.id);
  const unread = countUnread(notifications);

  return (
    <main className={clsx(surfaceClassName, "min-h-screen overflow-x-hidden pb-[calc(7rem+env(safe-area-inset-bottom))] pt-5")}>
      <div className="mx-auto max-w-md px-6">
        <header className="mb-3 flex items-center justify-between">
          <Brand href="/customer" size="sm" tone={inverseHeader ? "inverse" : "default"} />
          <NotificationBell notifications={notifications} unread={unread} />
        </header>
        {children}
      </div>
      <BottomNav />
    </main>
  );
}
