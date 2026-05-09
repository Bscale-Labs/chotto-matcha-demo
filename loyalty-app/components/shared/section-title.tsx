export function SectionTitle({
  eyebrow,
  title,
  children
}: {
  eyebrow?: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div>
      {eyebrow ? <p className="text-xs font-bold uppercase tracking-[0.2em] text-matcha">{eyebrow}</p> : null}
      <h1 className="mt-2 font-display text-4xl leading-tight text-ink md:text-5xl">{title}</h1>
      {children ? <div className="mt-3 max-w-2xl text-sm leading-6 text-ink/65">{children}</div> : null}
    </div>
  );
}
