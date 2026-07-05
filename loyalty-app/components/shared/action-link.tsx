import Link from "next/link";
import type { ComponentType } from "react";
import type { LucideProps } from "lucide-react";
import { clsx } from "clsx";

type ActionLinkProps = {
  href: string;
  children: React.ReactNode;
  icon?: ComponentType<LucideProps>;
  iconPosition?: "leading" | "trailing";
  variant?: "primary" | "secondary" | "tertiary";
  className?: string;
};

const variants = {
  primary:
    "min-h-tap rounded-pill action-lacquer px-6 py-[14px]",
  secondary:
    "gloss min-h-tap rounded-pill border border-line bg-milk px-6 py-[14px] text-charcoal hover:border-matcha-deep hover:text-matcha-deep active:bg-sage-wash",
  tertiary:
    "min-h-tap rounded-sm px-2 py-1 text-matcha-deep hover:bg-sage-wash active:bg-sage-tint"
} as const;

export function ActionLink({
  href,
  children,
  icon: Icon,
  iconPosition = "leading",
  variant = "primary",
  className
}: ActionLinkProps) {
  return (
    <Link
      href={href}
      className={clsx(
        "inline-flex items-center justify-center gap-2 font-medium tracking-tight transition-colors duration-fast ease-out-soft",
        variants[variant],
        className
      )}
    >
      {Icon && iconPosition === "leading" ? <Icon className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" /> : null}
      {children}
      {Icon && iconPosition === "trailing" ? <Icon className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" /> : null}
    </Link>
  );
}
