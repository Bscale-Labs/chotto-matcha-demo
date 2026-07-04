"use client";

import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { Button, type ButtonSize, type ButtonVariant } from "@/components/shared/button";

/**
 * Submit button that reflects the enclosing <form>'s pending state.
 * Must be rendered inside the <form> (useFormStatus reads the nearest form),
 * and the form's `action` should be async so `pending` covers the round-trip
 * — including slow image uploads.
 */
export function SubmitButton({
  children,
  pendingLabel,
  variant,
  size,
  disabled,
  className
}: {
  children: ReactNode;
  /** Label shown while submitting; falls back to `children`. */
  pendingLabel?: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant={variant}
      size={size}
      className={className}
      disabled={disabled || pending}
      aria-busy={pending}
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          {pendingLabel ?? children}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
