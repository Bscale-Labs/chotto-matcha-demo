import { clsx } from "clsx";
import type { Tier } from "@/lib/loyalty";

export function TierBadge({
  tier,
  size = "md",
  className
}: {
  tier: Tier;
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-2 rounded-pill bg-sage-wash text-matcha-deep",
        size === "sm" ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-sm",
        className
      )}
    >
      <span aria-hidden="true">{tier.glyph}</span>
      <span className="font-medium tracking-tight">{tier.name}</span>
    </span>
  );
}
