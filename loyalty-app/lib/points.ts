import type { Customer, Reward } from "@/lib/types";

export function calculateEarnedPoints(billTotal: number, earnRate: number) {
  return Math.floor(billTotal * earnRate);
}

export function canRedeem(customer: Customer, reward: Reward) {
  const hasPoints = customer.pointsBalance >= reward.pointCost;
  const hasStock = reward.stockCount === null || reward.stockCount > 0;
  return hasPoints && hasStock && reward.active;
}

export function pointsNeeded(customer: Customer, reward: Reward) {
  return Math.max(0, reward.pointCost - customer.pointsBalance);
}
