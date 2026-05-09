import { clsx } from "clsx";
import type { ElementType, ReactNode } from "react";

type HeadingLevel = "display" | "h1" | "h2" | "h3";

const levelStyles: Record<HeadingLevel, string> = {
  display:
    "font-display font-medium text-[88px] leading-[96px] tracking-display text-charcoal",
  h1: "font-display font-bold text-[48px] leading-[52px] text-charcoal",
  h2: "font-display font-semibold text-[32px] leading-[38px] text-charcoal",
  h3: "font-display font-medium text-[24px] leading-[30px] text-charcoal"
};

const levelElement: Record<HeadingLevel, ElementType> = {
  display: "h1",
  h1: "h1",
  h2: "h2",
  h3: "h3"
};

export function Heading({
  level = "h1",
  as,
  children,
  className
}: {
  level?: HeadingLevel;
  as?: ElementType;
  children: ReactNode;
  className?: string;
}) {
  const Component = as ?? levelElement[level];
  return <Component className={clsx(levelStyles[level], className)}>{children}</Component>;
}
