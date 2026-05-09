import type { ReactNode } from "react";
import { clsx } from "clsx";

export function StatCard({
  label,
  value,
  detail,
  className
}: {
  label: string;
  value: ReactNode;
  detail?: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={clsx(
        "rounded-lg border border-line-soft bg-cream p-5 shadow-sm transition-colors duration-fast ease-out-soft hover:border-line",
        className
      )}
    >
      <p className="eyebrow text-ink-muted">{label}</p>
      <p className="counter mt-3 font-display text-[36px] font-medium leading-none tracking-display text-charcoal">
        {value}
      </p>
      {detail ? <p className="mt-3 text-sm leading-5 text-ink-muted">{detail}</p> : null}
    </section>
  );
}
