export type Tier = {
  id: "seedling" | "whisk" | "ceremony";
  name: string;
  glyph: string;
  min: number;
  max: number | null;
  vibe: string;
};

export const tiers: Tier[] = [
  { id: "seedling", name: "Seedling", glyph: "🌱", min: 0, max: 149, vibe: "Just starting the ritual" },
  { id: "whisk", name: "Whisk", glyph: "🍵", min: 150, max: 499, vibe: "Practiced, regular, deepening the habit" },
  { id: "ceremony", name: "Ceremony", glyph: "🏛", min: 500, max: null, vibe: "A devoted member of the community" }
];

export function getTier(leaves: number): Tier {
  return (
    tiers.find((tier) => leaves >= tier.min && (tier.max === null || leaves <= tier.max)) ?? tiers[0]
  );
}

export function getNextTier(leaves: number): Tier | null {
  const current = getTier(leaves);
  const index = tiers.findIndex((tier) => tier.id === current.id);
  return tiers[index + 1] ?? null;
}

export function leavesToNextTier(leaves: number): number {
  const next = getNextTier(leaves);
  if (!next) return 0;
  return Math.max(0, next.min - leaves);
}

export function tierProgress(leaves: number): number {
  const current = getTier(leaves);
  const next = getNextTier(leaves);
  if (!next) return 1;
  const span = next.min - current.min;
  if (span <= 0) return 1;
  return Math.min(1, Math.max(0, (leaves - current.min) / span));
}
