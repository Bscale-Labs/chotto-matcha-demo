import { Leaf, X } from "lucide-react";
import type { ComponentType, ReactNode } from "react";
import type { LucideProps } from "lucide-react";
import { clsx } from "clsx";
import { Tooltip } from "@/components/shared/tooltip";

export type ToastTone = "sage" | "glass" | "error";

export function Toast({
  title,
  message,
  icon: Icon = Leaf,
  onDismiss,
  tone = "sage",
  className
}: {
  title: ReactNode;
  message?: ReactNode;
  icon?: ComponentType<LucideProps>;
  onDismiss?: () => void;
  tone?: ToastTone;
  className?: string;
}) {
  const isError = tone === "error";

  return (
    <div
      role={isError ? "alert" : "status"}
      className={clsx(
        "flex items-start gap-3 rounded-md p-4",
        // Feedback layer: quiet sage wash (default) or light glass when floating over content
        tone === "glass" && "surface-glass",
        tone === "sage" && "border border-sage-tint bg-sage-wash shadow-sm",
        isError && "border border-error-border bg-cream shadow-sm",
        className
      )}
    >
      <span
        className={clsx(
          "grid h-8 w-8 shrink-0 place-items-center rounded-pill bg-cream",
          isError ? "text-error-text" : "text-matcha-deep"
        )}
      >
        <Icon className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className={clsx("text-base font-semibold leading-6", isError ? "text-error-text" : "text-matcha-deep")}>
          {title}
        </p>
        {message ? (
          <p className="mt-1 text-xs leading-[18px] text-ink-muted">{message}</p>
        ) : null}
      </div>
      {onDismiss ? (
        <Tooltip label="Dismiss" align="end">
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss"
            className="-mr-1 -mt-1 grid h-8 w-8 place-items-center rounded-pill text-ink-muted transition-colors duration-fast ease-out-soft hover:bg-sage-tint hover:text-matcha-deep"
          >
            <X className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
          </button>
        </Tooltip>
      ) : null}
    </div>
  );
}
