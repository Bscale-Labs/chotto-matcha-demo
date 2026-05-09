import Link from "next/link";
import { Leaf } from "lucide-react";
import { clsx } from "clsx";

export function Brand({
  href = "/",
  size = "md",
  tone = "default",
  className
}: {
  href?: string;
  size?: "sm" | "md" | "lg";
  tone?: "default" | "inverse";
  className?: string;
}) {
  const dimensions = size === "sm" ? "h-9 w-9" : size === "lg" ? "h-12 w-12" : "h-10 w-10";
  const wordmarkSize = size === "lg" ? "text-2xl" : size === "sm" ? "text-base" : "text-lg";
  const eyebrowSize = size === "lg" ? "text-[11px]" : "text-[10px]";
  const inverse = tone === "inverse";

  return (
    <Link href={href} className={clsx("inline-flex items-center gap-3", className)}>
      <span
        className={clsx(
          "grid place-items-center rounded-pill",
          dimensions,
          inverse ? "bg-cream text-matcha-deep" : "bg-matcha-deep text-cream"
        )}
      >
        <Leaf className="h-1/2 w-1/2" strokeWidth={1.5} aria-hidden="true" />
      </span>
      <span className="leading-none">
        <span
          className={clsx(
            "block font-display font-medium tracking-display",
            wordmarkSize,
            inverse ? "text-cream" : "text-charcoal"
          )}
        >
          Chotto Matcha
        </span>
        <span
          className={clsx(
            "mt-1 block font-medium uppercase tracking-eyebrow",
            eyebrowSize,
            inverse ? "text-cream/70" : "text-ink-muted"
          )}
        >
          Just a moment, with matcha
        </span>
      </span>
    </Link>
  );
}
