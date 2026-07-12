import "server-only";

import { cache } from "react";
import { getCustomerById, getCustomerRecentTransactions } from "@/lib/data/customers";
import { listActiveRewardsWithBranches, listRewards } from "@/lib/data/rewards";
import { listBranches } from "@/lib/data/branches";
import { formatPoints, formatRelativeTime } from "@/lib/formatters";

export type NotificationCategory = "announcement" | "reward" | "activity";
export type NotificationKind = "restock" | "ready" | "earn" | "redeem" | "adjustment";

export type CustomerNotification = {
  id: string;
  category: NotificationCategory;
  kind: NotificationKind;
  title: string;
  body: string;
  /** ISO string — used for sorting and as a stable key. */
  timestamp: string;
  /** Pre-rendered "3h ago" label, computed server-side to avoid hydration drift. */
  timeLabel: string;
  unread: boolean;
  href: string;
};

/** "A", "A and B", or "A, B, and 2 more" — for listing branch names inline. */
function joinBranchNames(names: string[]) {
  if (names.length === 0) return "select branches";
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names[0]}, ${names[1]}, and ${names.length - 2} more`;
}

/**
 * Composes a customer's notification feed from live data — no separate events
 * table. Three kinds surface:
 *   • reward       — a reward they've just saved enough points to claim
 *   • announcement — merch that's back in stock
 *   • activity     — their real earn/redeem/adjustment ledger entries
 *
 * Derived (reward/announcement) items get plausible recent timestamps so the
 * feed feels live; activity keeps its real ledger time. Wrapped in `cache` so
 * the shell's unread badge and the notifications page share one computation.
 */
export const getCustomerNotifications = cache(
  async (customerId: string): Promise<CustomerNotification[]> => {
    const customer = await getCustomerById(customerId);
    if (!customer) return [];

    const [transactions, activeRewards, allRewards, branches] = await Promise.all([
      getCustomerRecentTransactions(customerId, 8),
      listActiveRewardsWithBranches(),
      listRewards(),
      listBranches()
    ]);

    const now = new Date();
    const minutesAgo = (n: number) => new Date(now.getTime() - n * 60_000);
    const rewardNameById = new Map(allRewards.map((reward) => [reward.id, reward.name]));
    const branchNameById = new Map(branches.map((branch) => [branch.id, branch.name]));

    const notifications: CustomerNotification[] = [];

    // "You can finally redeem this" — the biggest reward they've just crossed the
    // threshold for. Restricted to aspirational items (merch or 500+ pts) so an
    // everyday latte doesn't masquerade as a milestone.
    const ready = activeRewards
      .filter(
        (reward) =>
          reward.availableBranchNames.length > 0 &&
          customer.pointsBalance >= reward.pointCost &&
          (reward.type === "merch" || reward.pointCost >= 500)
      )
      .sort((left, right) => right.pointCost - left.pointCost)
      .slice(0, 2);
    const readyIds = new Set(ready.map((reward) => reward.id));

    ready.forEach((reward, index) => {
      const timestamp = minutesAgo(120 + index * 200);
      notifications.push({
        id: `ready-${reward.id}`,
        category: "reward",
        kind: "ready",
        title: `${reward.name} is yours to claim`,
        body: `You've saved up ${formatPoints(reward.pointCost)} points — redeem it at ${joinBranchNames(
          reward.availableBranchNames
        )}.`,
        timestamp: timestamp.toISOString(),
        timeLabel: formatRelativeTime(timestamp, now),
        unread: true,
        href: "/customer/rewards"
      });
    });

    // Restocks — merch that's back on shelves (skip anything already surfaced as
    // ready-to-redeem to avoid announcing the same item twice).
    const restock = activeRewards
      .filter(
        (reward) =>
          reward.type === "merch" &&
          reward.availableBranchNames.length > 0 &&
          !readyIds.has(reward.id)
      )
      .sort(
        (left, right) =>
          left.availableBranchNames.length - right.availableBranchNames.length ||
          right.pointCost - left.pointCost
      )
      .slice(0, 2);

    restock.forEach((reward, index) => {
      const timestamp = minutesAgo(27 * 60 + index * 20 * 60);
      notifications.push({
        id: `restock-${reward.id}`,
        category: "announcement",
        kind: "restock",
        title: `${reward.name} is back in stock`,
        body: `Freshly restocked at ${joinBranchNames(reward.availableBranchNames)}. Worth ${formatPoints(
          reward.pointCost
        )} points.`,
        timestamp: timestamp.toISOString(),
        timeLabel: formatRelativeTime(timestamp, now),
        unread: true,
        href: "/customer/rewards"
      });
    });

    // Activity — the real ledger, already sorted newest-first by the query.
    for (const transaction of transactions) {
      let kind: NotificationKind;
      let title: string;
      let body: string;

      if (transaction.type === "redeem") {
        kind = "redeem";
        const name = transaction.rewardId
          ? rewardNameById.get(transaction.rewardId) ?? "a reward"
          : "a reward";
        title = `You redeemed ${name}`;
        body = `${formatPoints(Math.abs(transaction.pointsDelta))} points spent. Enjoy — you earned it.`;
      } else if (transaction.type === "earn") {
        kind = "earn";
        const name = transaction.branchId
          ? branchNameById.get(transaction.branchId) ?? "your visit"
          : "your visit";
        title = `You earned ${formatPoints(transaction.pointsDelta)} points`;
        body = `Thanks for stopping by ${name}.`;
      } else {
        kind = "adjustment";
        title =
          transaction.pointsDelta >= 0
            ? `${formatPoints(transaction.pointsDelta)} points added`
            : `${formatPoints(transaction.pointsDelta)} points adjusted`;
        body = transaction.reason ?? "A manual adjustment to your balance.";
      }

      notifications.push({
        id: `txn-${transaction.id}`,
        category: "activity",
        kind,
        title,
        body,
        timestamp: new Date(transaction.createdAt).toISOString(),
        timeLabel: formatRelativeTime(transaction.createdAt, now),
        unread: false,
        href: "/customer/activity"
      });
    }

    notifications.sort(
      (left, right) => new Date(right.timestamp).getTime() - new Date(left.timestamp).getTime()
    );

    return notifications;
  }
);

export function countUnread(notifications: CustomerNotification[]) {
  return notifications.reduce((total, notification) => total + (notification.unread ? 1 : 0), 0);
}
