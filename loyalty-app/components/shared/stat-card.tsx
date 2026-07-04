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
        "surface-paper rounded-lg p-5 transition-colors duration-fast ease-out-soft hover:border-line",
        className
      )}
    >
      <p className="eyebrow text-ink-muted">{label}</p>
      <p className="counter mt-3 text-[34px] font-semibold leading-none tracking-tight text-charcoal">
        {value}
      </p>
      {detail ? <p className="mt-3 text-sm leading-5 text-ink-muted">{detail}</p> : null}
    </section>
  );
}
