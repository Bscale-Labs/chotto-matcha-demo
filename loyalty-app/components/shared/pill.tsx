import type { ComponentType, ReactNode } from "react";
import type { LucideProps } from "lucide-react";
import { clsx } from "clsx";

type PillTone = "default" | "inverse" | "soft" | "muted" | "warn" | "glass";

const tones: Record<PillTone, string> = {
  default: "bg-sage-wash text-matcha-deep",
  inverse: "bg-matcha-deep text-cream",
  soft: "bg-stone text-charcoal",
  muted: "bg-line-soft text-ink-muted",
  warn: "bg-warn-fill text-error-text",
  // Session / status pill floating on a surface — Control Glass
  glass: "surface-glass text-charcoal"
};

export function Pill({
  children,
  icon: Icon,
  tone = "default",
  className
}: {
  children: ReactNode;
  icon?: ComponentType<LucideProps>;
  tone?: PillTone;
  className?: string;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-pill px-3 py-1 text-xs font-medium",
        tones[tone],
        className
      )}
    >
      {Icon ? <Icon className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" /> : null}
      {children}
    </span>
  );
}
