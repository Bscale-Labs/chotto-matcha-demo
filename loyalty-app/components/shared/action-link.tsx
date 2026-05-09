import Link from "next/link";
import type { ComponentType } from "react";
import type { LucideProps } from "lucide-react";
import { clsx } from "clsx";

type ActionLinkProps = {
  href: string;
  children: React.ReactNode;
  icon?: ComponentType<LucideProps>;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
};

export function ActionLink({ href, children, icon: Icon, variant = "primary", className }: ActionLinkProps) {
  return (
    <Link
      href={href}
      className={clsx(
        "tap-target inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition hover:-translate-y-0.5",
        variant === "primary" && "bg-ink text-paper shadow-soft",
        variant === "secondary" && "border border-moss/20 bg-white/70 text-ink",
        variant === "ghost" && "text-moss hover:bg-moss/10",
        className
      )}
    >
      {Icon ? <Icon className="h-4 w-4" aria-hidden="true" /> : null}
      {children}
    </Link>
  );
}
