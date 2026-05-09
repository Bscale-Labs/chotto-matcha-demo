import { clsx } from "clsx";

export function StatCard({
  label,
  value,
  detail,
  className
}: {
  label: string;
  value: string;
  detail?: string;
  className?: string;
}) {
  return (
    <section className={clsx("matcha-card rounded-[8px] p-5", className)}>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-moss/60">{label}</p>
      <p className="mt-3 font-display text-4xl leading-none text-ink">{value}</p>
      {detail ? <p className="mt-3 text-sm text-ink/60">{detail}</p> : null}
    </section>
  );
}
