import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ComponentType, ReactNode } from "react";
import type { LucideProps } from "lucide-react";
import { clsx } from "clsx";

export type ButtonVariant = "primary" | "secondary" | "tertiary" | "icon";
export type ButtonSize = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-medium tracking-tight transition-colors duration-fast ease-out-soft select-none disabled:cursor-not-allowed";

const variants: Record<ButtonVariant, string> = {
  // Primary = Matcha Lacquer (gloss via highlight + shadow, not transparency)
  primary:
    "min-h-tap rounded-pill action-lacquer px-6 py-[14px]",
  secondary:
    "gloss min-h-tap rounded-pill border border-line bg-milk px-6 py-[14px] text-charcoal hover:border-matcha-deep hover:text-matcha-deep active:bg-sage-wash disabled:text-ink-faint disabled:border-line-soft disabled:shadow-none",
  // Tertiary raised to a 44px tap target (was 36px)
  tertiary:
    "min-h-tap rounded-pill px-3 py-1.5 text-sm text-matcha-deep hover:bg-sage-wash active:bg-sage-tint disabled:text-ink-faint",
  icon:
    "h-11 w-11 min-h-tap min-w-tap rounded-pill action-lacquer"
};

// Larger targets for cashier-critical confirm actions (DESIGN.md allows > 44px)
const sizes: Partial<Record<ButtonVariant, Record<ButtonSize, string>>> = {
  primary: { md: "", lg: "min-h-[56px] px-8 py-4 text-base" },
  secondary: { md: "", lg: "min-h-[56px] px-8 py-4 text-base" }
};

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ComponentType<LucideProps>;
  iconPosition?: "leading" | "trailing";
  className?: string;
  children?: ReactNode;
};

type ButtonAsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> & {
    as?: "button";
    href?: never;
  };

type ButtonAsLink = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "href"> & {
    as?: "a";
    href: string;
  };

type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button(props: ButtonProps) {
  const { variant = "primary", size = "md", icon: Icon, iconPosition = "leading", className, children, ...rest } = props;
  const classes = clsx(base, variants[variant], sizes[variant]?.[size], className);
  const iconSize = variant === "icon" ? "h-5 w-5" : variant === "tertiary" ? "h-3.5 w-3.5" : "h-4 w-4";

  const inner = (
    <>
      {Icon && iconPosition === "leading" ? (
        <Icon className={iconSize} strokeWidth={1.75} aria-hidden="true" />
      ) : null}
      {children}
      {Icon && iconPosition === "trailing" ? (
        <Icon className={iconSize} strokeWidth={1.75} aria-hidden="true" />
      ) : null}
    </>
  );

  if ("href" in rest && rest.href) {
    const { href, ...anchorRest } = rest as ButtonAsLink;
    return (
      <Link href={href} className={classes} {...anchorRest}>
        {inner}
      </Link>
    );
  }

  return (
    <button className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {inner}
    </button>
  );
}
