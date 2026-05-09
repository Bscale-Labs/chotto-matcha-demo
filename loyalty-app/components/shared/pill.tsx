import type { ComponentType, ReactNode } from "react";
import type { LucideProps } from "lucide-react";
import { clsx } from "clsx";

type PillTone = "default" | "inverse" | "soft" | "muted" | "warn";

const tones: Record<PillTone, string> = {
  default: "bg-sage-wash text-matcha-deep",
  inverse: "bg-matcha-deep text-cream",
  soft: "bg-stone text-charcoal",
  muted: "bg-line-soft text-ink-muted",
  warn: "bg-[#F5E2DA] text-[#8C3D2A]"
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
      {Icon ? <Icon className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" /> : null}
      {children}
    </span>
  );
}
