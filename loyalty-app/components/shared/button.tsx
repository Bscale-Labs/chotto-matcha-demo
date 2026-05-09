import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ComponentType, ReactNode } from "react";
import type { LucideProps } from "lucide-react";
import { clsx } from "clsx";

export type ButtonVariant = "primary" | "secondary" | "tertiary" | "icon";

const base =
  "inline-flex items-center justify-center gap-2 font-medium tracking-tight transition-colors duration-fast ease-out-soft select-none disabled:cursor-not-allowed";

const variants: Record<ButtonVariant, string> = {
  primary:
    "min-h-tap rounded-pill bg-matcha-deep px-6 py-[14px] text-cream hover:bg-forest active:bg-charcoal disabled:bg-sage disabled:text-cream/80 shadow-sm",
  secondary:
    "min-h-tap rounded-pill border border-line bg-cream px-6 py-[14px] text-charcoal hover:border-matcha-deep hover:text-matcha-deep active:bg-sage-wash disabled:text-ink-faint disabled:border-line-soft",
  tertiary:
    "min-h-tap rounded-sm px-2 py-1 text-matcha-deep hover:bg-sage-wash active:bg-sage-tint disabled:text-ink-faint",
  icon:
    "h-11 w-11 min-h-tap min-w-tap rounded-pill bg-matcha-deep text-cream hover:bg-forest active:bg-charcoal disabled:bg-sage disabled:text-cream/80 shadow-sm"
};

type CommonProps = {
  variant?: ButtonVariant;
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
  const { variant = "primary", icon: Icon, iconPosition = "leading", className, children, ...rest } = props;
  const classes = clsx(base, variants[variant], className);

  const inner = (
    <>
      {Icon && iconPosition === "leading" ? (
        <Icon className={variant === "icon" ? "h-5 w-5" : "h-4 w-4"} strokeWidth={1.5} aria-hidden="true" />
      ) : null}
      {children}
      {Icon && iconPosition === "trailing" ? (
        <Icon className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
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
