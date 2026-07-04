"use client";

import {
  AlertTriangle,
  CheckCircle2,
  type LucideIcon
} from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode
} from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Toast } from "@/components/shared/toast";

type ToastIntent = "success" | "error";

type ToastRequest = {
  title: ReactNode;
  message?: ReactNode;
  intent?: ToastIntent;
  durationMs?: number;
};

type ToastItem = ToastRequest & {
  id: number;
  intent: ToastIntent;
};

type ToastContextValue = {
  showToast: (toast: ToastRequest) => void;
  showSuccess: (title: ReactNode, message?: ReactNode) => void;
  showError: (title: ReactNode, message?: ReactNode) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);
const defaultDurationMs = 4200;

function iconForIntent(intent: ToastIntent): LucideIcon {
  return intent === "error" ? AlertTriangle : CheckCircle2;
}

function messageFromError(error: unknown, fallback: string) {
  return error instanceof Error && error.message ? error.message : fallback;
}

export function getToastErrorMessage(error: unknown, fallback = "Something went wrong. Try again.") {
  return messageFromError(error, fallback);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(0);
  const timers = useRef(new Map<number, number>());

  const dismissToast = useCallback((id: number) => {
    const timer = timers.current.get(id);
    if (timer) window.clearTimeout(timer);
    timers.current.delete(id);
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((toast: ToastRequest) => {
    const id = nextId.current + 1;
    nextId.current = id;
    const item: ToastItem = {
      id,
      intent: toast.intent ?? "success",
      title: toast.title,
      message: toast.message,
      durationMs: toast.durationMs ?? defaultDurationMs
    };

    setToasts((current) => [...current, item].slice(-4));

    if (item.durationMs && item.durationMs > 0) {
      const timer = window.setTimeout(() => dismissToast(id), item.durationMs);
      timers.current.set(id, timer);
    }
  }, [dismissToast]);

  const value = useMemo<ToastContextValue>(() => ({
    showToast,
    showSuccess: (title, message) => showToast({ title, message, intent: "success" }),
    showError: (title, message) => showToast({ title, message, intent: "error", durationMs: 6500 })
  }), [showToast]);

  useEffect(() => () => {
    for (const timer of timers.current.values()) window.clearTimeout(timer);
    timers.current.clear();
  }, []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed left-4 right-4 top-4 z-[100] flex flex-col gap-3 sm:left-auto sm:right-6 sm:top-6 sm:w-full sm:max-w-sm">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            title={toast.title}
            message={toast.message}
            icon={iconForIntent(toast.intent)}
            tone={toast.intent === "error" ? "error" : "glass"}
            onDismiss={() => dismissToast(toast.id)}
            className="pointer-events-auto toast-enter"
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside ToastProvider");
  return context;
}

const urlToastMessages: Record<string, ToastRequest> = {
  "points-awarded": {
    title: "Points awarded",
    message: "The member balance and activity were updated."
  },
  "reward-redeemed": {
    title: "Reward redeemed",
    message: "The member balance and reward stock were updated."
  },
  "reward-created": { title: "Reward created" },
  "reward-updated": { title: "Reward saved" },
  "reward-activated": { title: "Reward activated" },
  "reward-deactivated": { title: "Reward deactivated" },
  "branch-created": { title: "Branch created" },
  "branch-updated": { title: "Branch saved" },
  "branch-opened": { title: "Branch opened" },
  "branch-closed": { title: "Branch closed" },
  "staff-updated": { title: "Staff saved" },
  "staff-activated": { title: "Staff activated" },
  "staff-deactivated": { title: "Staff deactivated" },
  "customer-updated": { title: "Customer saved" },
  "customer-activated": { title: "Customer reactivated" },
  "customer-deactivated": { title: "Customer deactivated" }
};

export function ToastUrlListener() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const lastToastKey = useRef<string | null>(null);

  useEffect(() => {
    const toastKey = searchParams.get("toast");
    if (!toastKey) {
      lastToastKey.current = null;
      return;
    }
    if (toastKey === lastToastKey.current) return;

    const toast = urlToastMessages[toastKey];
    if (toast) {
      lastToastKey.current = toastKey;
      showToast(toast);
    }

    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.delete("toast");
    const nextQuery = nextParams.toString();
    window.history.replaceState(null, "", `${pathname}${nextQuery ? `?${nextQuery}` : ""}`);
    window.setTimeout(() => {
      if (lastToastKey.current === toastKey) lastToastKey.current = null;
    }, 0);
  }, [pathname, searchParams, showToast]);

  return null;
}
