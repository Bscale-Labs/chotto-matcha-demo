"use client";

import { useRouter } from "next/navigation";
import type { FormHTMLAttributes, ReactNode } from "react";
import { getToastErrorMessage, useToast } from "@/components/shared/toast-provider";

type ToastActionFormProps = Omit<FormHTMLAttributes<HTMLFormElement>, "action" | "children"> & {
  action: (formData: FormData) => Promise<unknown>;
  children: ReactNode;
  successTitle: ReactNode;
  successMessage?: ReactNode;
  errorTitle: ReactNode;
  onSuccess?: () => void;
};

export function ToastActionForm({
  action,
  children,
  successTitle,
  successMessage,
  errorTitle,
  onSuccess,
  ...props
}: ToastActionFormProps) {
  const router = useRouter();
  const { showSuccess, showError } = useToast();

  return (
    <form
      {...props}
      action={async (formData) => {
        try {
          await action(formData);
          router.refresh();
          showSuccess(successTitle, successMessage);
          onSuccess?.();
        } catch (error) {
          showError(errorTitle, getToastErrorMessage(error));
        }
      }}
    >
      {children}
    </form>
  );
}
