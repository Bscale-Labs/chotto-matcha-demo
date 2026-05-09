import type { ElementType, ReactNode } from "react";
import { clsx } from "clsx";

export function Card({
  children,
  className,
  as: Component = "section",
  padded = true
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  padded?: boolean;
}) {
  return (
    <Component
      className={clsx(
        "rounded-lg border border-line-soft bg-cream",
        padded && "p-6",
        className
      )}
    >
      {children}
    </Component>
  );
}
