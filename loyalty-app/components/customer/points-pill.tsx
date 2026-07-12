import { clsx } from "clsx";
import { formatPoints } from "@/lib/formatters";

/**
 * The canonical "what this reward costs" chip. Two tones: `solid` (matcha) for
 * rewards the customer can redeem now, and `soft` (a lighter green) for ones
 * they're still saving up for. Pass `className` only for positioning.
 */
export function PointsPill({
  points,
  tone = "solid",
  className
}: {
  points: number;
  tone?: "solid" | "soft";
  className?: string;
}) {
  const solid = tone === "solid";
  return (
    <span
      className={clsx(
        "counter inline-flex shrink-0 items-center gap-1 rounded-pill border px-2.5 py-1 text-xs font-semibold leading-none shadow-sm",
        solid
          ? "border-cream/25 bg-matcha-deep text-cream"
          : "border-sage bg-sage-tint text-matcha-deep",
        className
      )}
    >
      {formatPoints(points)}
      <span className={clsx("text-[10px] font-medium", solid ? "text-cream/70" : "text-matcha-deep/55")}>
        pts
      </span>
    </span>
  );
}
