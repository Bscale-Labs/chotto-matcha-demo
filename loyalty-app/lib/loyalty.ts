import { Award, Sparkles, Sprout } from "lucide-react";
import type { ComponentType } from "react";
import type { LucideProps } from "lucide-react";

export type Tier = {
  id: string;
  name: string;
  icon: ComponentType<LucideProps>;
  min: number;
  max: number | null;
  vibe: string;
};

export const tiers: Tier[] = [
  { id: "seedling", name: "Seedling", icon: Sprout, min: 0, max: 149, vibe: "Just starting the ritual" },
  { id: "whisk", name: "Whisk", icon: Sparkles, min: 150, max: 499, vibe: "Practiced, regular, deepening the habit" },
  { id: "ceremony", name: "Ceremony", icon: Award, min: 500, max: null, vibe: "A devoted member of the community" }
];

const iconsById: Record<string, ComponentType<LucideProps>> = {
  ceremony: Award,
  seedling: Sprout,
  whisk: Sparkles
};

const iconsByOrder = [Sprout, Sparkles, Award];

export function tierIcon(id: string, index: number) {
  return iconsById[id] ?? iconsByOrder[index] ?? Award;
}

export function normalizeTiers(
  rows: Array<{
    id: string;
    name: string;
    description: string;
    minPoints: number;
    sortOrder: number;
  }>
): Tier[] {
  const sorted = [...rows].sort((left, right) => {
    if (left.sortOrder !== right.sortOrder) return left.sortOrder - right.sortOrder;
    return left.minPoints - right.minPoints;
  });

  return sorted.map((row, index) => {
    const next = sorted[index + 1];
    return {
      id: row.id,
      name: row.name,
      icon: tierIcon(row.id, index),
      min: row.minPoints,
      max: next ? Math.max(row.minPoints, next.minPoints - 1) : null,
      vibe: row.description
    };
  });
}

export function getTier(points: number, tierList: Tier[] = tiers): Tier {
  return (
    tierList.find((tier) => points >= tier.min && (tier.max === null || points <= tier.max)) ?? tierList[0] ?? tiers[0]
  );
}

export function getNextTier(points: number, tierList: Tier[] = tiers): Tier | null {
  const current = getTier(points, tierList);
  const index = tierList.findIndex((tier) => tier.id === current.id);
  return tierList[index + 1] ?? null;
}

export function pointsToNextTier(points: number, tierList: Tier[] = tiers): number {
  const next = getNextTier(points, tierList);
  if (!next) return 0;
  return Math.max(0, next.min - points);
}

export function tierProgress(points: number, tierList: Tier[] = tiers): number {
  const current = getTier(points, tierList);
  const next = getNextTier(points, tierList);
  if (!next) return 1;
  const span = next.min - current.min;
  if (span <= 0) return 1;
  return Math.min(1, Math.max(0, (points - current.min) / span));
}
