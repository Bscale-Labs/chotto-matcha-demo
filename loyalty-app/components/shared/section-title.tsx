import { clsx } from "clsx";
import type { ReactNode } from "react";

export function SectionTitle({
  eyebrow,
  title,
  children,
  align = "start",
  className
}: {
  eyebrow?: string;
  title: ReactNode;
  children?: ReactNode;
  align?: "start" | "center";
  className?: string;
}) {
  return (
    <div className={clsx(align === "center" && "text-center", className)}>
      {eyebrow ? <p className="eyebrow text-matcha-deep">{eyebrow}</p> : null}
      <h1
        className={clsx(
          eyebrow && "mt-3",
          "font-display text-[32px] font-semibold leading-[38px] tracking-tight text-charcoal sm:text-[40px] sm:leading-[46px]"
        )}
      >
        {title}
      </h1>
      {children ? (
        <div className="mt-3 max-w-2xl text-base leading-6 text-ink-muted">{children}</div>
      ) : null}
    </div>
  );
}
