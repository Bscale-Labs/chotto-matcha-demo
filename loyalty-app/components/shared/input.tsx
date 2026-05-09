import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { clsx } from "clsx";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: ReactNode;
  error?: ReactNode;
  leadingIcon?: ReactNode;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, leadingIcon, className, id, ...rest },
  ref
) {
  const inputId = id ?? `input-${label.toLowerCase().replace(/\s+/g, "-")}`;
  const hintId = `${inputId}-hint`;

  return (
    <label htmlFor={inputId} className="grid gap-2">
      <span className="text-sm font-medium text-charcoal">{label}</span>
      <span
        className={clsx(
          "flex items-center gap-2 rounded-md border bg-cream px-4 py-3.5 transition-colors duration-fast ease-out-soft",
          error
            ? "border-error-border focus-within:shadow-focus"
            : "border-line focus-within:border-matcha-deep focus-within:shadow-focus"
        )}
      >
        {leadingIcon ? <span className="text-ink-faint">{leadingIcon}</span> : null}
        <input
          ref={ref}
          id={inputId}
          aria-describedby={hint || error ? hintId : undefined}
          aria-invalid={error ? true : undefined}
          className={clsx(
            "min-w-0 flex-1 bg-transparent text-base leading-6 text-charcoal placeholder:text-ink-faint focus:outline-none",
            className
          )}
          {...rest}
        />
      </span>
      {error ? (
        <span id={hintId} className="text-xs leading-[18px] text-error-text">
          {error}
        </span>
      ) : hint ? (
        <span id={hintId} className="text-xs leading-[18px] text-ink-muted">
          {hint}
        </span>
      ) : null}
    </label>
  );
});
