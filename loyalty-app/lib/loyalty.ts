import { Award, Sparkles, Sprout } from "lucide-react";
import type { ComponentType } from "react";
import type { LucideProps } from "lucide-react";

export type Tier = {
  id: "seedling" | "whisk" | "ceremony";
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

export function getTier(points: number): Tier {
  return (
    tiers.find((tier) => points >= tier.min && (tier.max === null || points <= tier.max)) ?? tiers[0]
  );
}

export function getNextTier(points: number): Tier | null {
  const current = getTier(points);
  const index = tiers.findIndex((tier) => tier.id === current.id);
  return tiers[index + 1] ?? null;
}

export function pointsToNextTier(points: number): number {
  const next = getNextTier(points);
  if (!next) return 0;
  return Math.max(0, next.min - points);
}

export function tierProgress(points: number): number {
  const current = getTier(points);
  const next = getNextTier(points);
  if (!next) return 1;
  const span = next.min - current.min;
  if (span <= 0) return 1;
  return Math.min(1, Math.max(0, (points - current.min) / span));
}
