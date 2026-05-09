"use client";

import { useEffect, type ReactNode } from "react";
import { clsx } from "clsx";

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  className
}: {
  open: boolean;
  onClose?: () => void;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 grid place-items-center px-5"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-charcoal/30 backdrop-blur-[2px]"
      />
      <div
        className={clsx(
          "relative w-full max-w-[360px] rounded-lg bg-cream p-6 shadow-lg",
          className
        )}
      >
        <h2 className="font-display text-[22px] leading-7 text-charcoal">{title}</h2>
        {description ? (
          <p className="mt-2 text-sm leading-6 text-ink-muted">{description}</p>
        ) : null}
        {children ? <div className="mt-6">{children}</div> : null}
      </div>
    </div>
  );
}
