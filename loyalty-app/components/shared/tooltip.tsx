import type { ReactNode } from "react";
import { clsx } from "clsx";

type TooltipSide = "top" | "bottom";
type TooltipAlign = "start" | "center" | "end";

const sideClasses: Record<TooltipSide, string> = {
  top: "bottom-full mb-2",
  bottom: "top-full mt-2"
};

const alignClasses: Record<TooltipAlign, string> = {
  start: "left-0",
  center: "left-1/2 -translate-x-1/2",
  end: "right-0"
};

export function Tooltip({
  label,
  children,
  side = "top",
  align = "center",
  className,
  contentClassName,
  disabled
}: {
  label: ReactNode;
  children: ReactNode;
  side?: TooltipSide;
  align?: TooltipAlign;
  className?: string;
  contentClassName?: string;
  disabled?: boolean;
}) {
  if (disabled || !label) return <>{children}</>;

  return (
    <span className={clsx("group/tooltip relative inline-flex w-fit", className)}>
      {children}
      <span
        role="tooltip"
        className={clsx(
          "pointer-events-none absolute z-50 max-w-[220px] whitespace-nowrap rounded-md border border-line-soft bg-charcoal px-2.5 py-1.5 text-xs font-medium leading-4 text-cream opacity-0 shadow-md transition duration-fast ease-out-soft group-hover/tooltip:opacity-100 group-focus-within/tooltip:opacity-100",
          sideClasses[side],
          alignClasses[align],
          contentClassName
        )}
      >
        {label}
      </span>
    </span>
  );
}
