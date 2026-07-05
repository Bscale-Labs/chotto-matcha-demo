"use client";

import { clsx } from "clsx";
import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
  type ReactNode,
  type TextareaHTMLAttributes
} from "react";
import type { ButtonSize } from "@/components/shared/button";
import { Select } from "@/components/shared/select";
import { SubmitButton } from "@/components/shared/submit-button";
import { getToastErrorMessage, useToast } from "@/components/shared/toast-provider";

/**
 * Shared "dirty form" primitives. Two behaviours, applied consistently across
 * every edit form:
 *   1. Save enables only once something differs from its saved value.
 *   2. Each changed field carries a matcha outline (`.field-changed`) that
 *      clears the moment the form is saved.
 *
 * A field is "changed" by comparing its live value to the baseline it mounted
 * with — so reverting a field clears its highlight and can re-disable Save. In
 * `create` mode there is no baseline, so nothing highlights and Save stays live.
 */

/** The class name that paints a field as edited-but-unsaved. */
export const FIELD_CHANGED_CLASS = "field-changed";

export type DirtyMode = "create" | "edit";

type DirtyContextValue = {
  mode: DirtyMode;
  isDirty: boolean;
  /** Report whether a given field currently differs from its baseline. */
  report: (id: string, changed: boolean) => void;
  /** Drop a field from tracking (on unmount). */
  release: (id: string) => void;
  /** Bumped after a successful save so fields re-baseline to the saved value. */
  resetSignal: number;
};

const DirtyFieldsContext = createContext<DirtyContextValue | null>(null);

function useDirtyContext(): DirtyContextValue {
  const ctx = useContext(DirtyFieldsContext);
  if (!ctx) {
    throw new Error("Tracked fields must be rendered inside a <DirtyForm> or <DirtyFieldsProvider>.");
  }
  return ctx;
}

function toComparable(value: unknown): string {
  if (value === undefined || value === null) return "";
  return String(value);
}

/**
 * Owns the dirty state for one form. Returns the context value to hand to a
 * provider plus `report`/`reset` for imperative callers (toggles, image
 * pickers) that live in the same component as the provider.
 */
export function useDirtyFields(mode: DirtyMode) {
  const [changedIds, setChangedIds] = useState<Record<string, true>>({});
  const [resetSignal, setResetSignal] = useState(0);

  const report = useCallback((id: string, changed: boolean) => {
    setChangedIds((prev) => {
      const has = Boolean(prev[id]);
      if (changed === has) return prev;
      if (changed) return { ...prev, [id]: true };
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const release = useCallback((id: string) => {
    setChangedIds((prev) => {
      if (!prev[id]) return prev;
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setChangedIds({});
    setResetSignal((signal) => signal + 1);
  }, []);

  const isDirty = mode === "create" ? true : Object.keys(changedIds).length > 0;

  const ctx = useMemo<DirtyContextValue>(
    () => ({ mode, isDirty, report, release, resetSignal }),
    [mode, isDirty, report, release, resetSignal]
  );

  return { ctx, isDirty, report, release, reset, resetSignal };
}

export function DirtyFieldsProvider({
  value,
  children
}: {
  value: DirtyContextValue;
  children: ReactNode;
}) {
  return <DirtyFieldsContext.Provider value={value}>{children}</DirtyFieldsContext.Provider>;
}

type DirtyFormProps = {
  mode: DirtyMode;
  action: (formData: FormData) => void | Promise<void>;
  children: ReactNode;
  className?: string;
  /**
   * Provide toast copy to run the action as a stay-on-page save (toast + refresh
   * + clear highlights). Omit it for actions that redirect on success — the page
   * navigates away, so there is nothing to reset.
   */
  successTitle?: ReactNode;
  successMessage?: ReactNode;
  errorTitle?: ReactNode;
};

/**
 * Convenience wrapper for straightforward edit forms: renders the `<form>`,
 * provides dirty context, and (in toast mode) clears every field highlight once
 * the save resolves.
 */
export function DirtyForm({
  mode,
  action,
  children,
  className,
  successTitle,
  successMessage,
  errorTitle
}: DirtyFormProps) {
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  const { ctx, reset } = useDirtyFields(mode);
  const isToast = successTitle !== undefined;

  const formAction = isToast
    ? async (formData: FormData) => {
        try {
          await action(formData);
          router.refresh();
          showSuccess(successTitle, successMessage);
          reset();
        } catch (error) {
          showError(errorTitle, getToastErrorMessage(error));
        }
      }
    : action;

  return (
    <DirtyFieldsProvider value={ctx}>
      <form className={className} action={formAction}>
        {children}
      </form>
    </DirtyFieldsProvider>
  );
}

/** Shared change-tracking behaviour for a single uncontrolled field. */
function useTrackedField(defaultValue: unknown, getCurrentValue: () => string) {
  const ctx = useDirtyContext();
  const fieldId = useId();
  const baselineRef = useRef(toComparable(defaultValue));
  const changedRef = useRef(false);
  const [changed, setChanged] = useState(false);

  // After a save, the field's live DOM value IS the new saved value — re-baseline
  // to it and drop the highlight.
  useEffect(() => {
    if (ctx.resetSignal === 0) return;
    baselineRef.current = getCurrentValue();
    changedRef.current = false;
    // Re-baseline to the just-saved value and drop the highlight. Fires once per
    // save (resetSignal change), not in a render loop.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setChanged(false);
    ctx.report(fieldId, false);
    // getCurrentValue reads a stable ref; only re-run when a save fires.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx.resetSignal]);

  useEffect(() => () => ctx.release(fieldId), [ctx, fieldId]);

  // Called from input event handlers (never during render), so reporting up to
  // the provider here is safe.
  const setValue = useCallback(
    (nextValue: string) => {
      const isChanged = nextValue !== baselineRef.current;
      if (isChanged === changedRef.current) return;
      changedRef.current = isChanged;
      setChanged(isChanged);
      ctx.report(fieldId, isChanged);
    },
    [ctx, fieldId]
  );

  const showChanged = ctx.mode === "edit" && changed;
  return { setValue, showChanged };
}

type TrackedInputProps = InputHTMLAttributes<HTMLInputElement> & {
  /** Normalize the value on input (e.g. strip non-digits) before it's compared. */
  sanitize?: (value: string) => string;
};

export function TrackedInput({ defaultValue, className, onChange, sanitize, ...rest }: TrackedInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { setValue, showChanged } = useTrackedField(defaultValue, () => toComparable(inputRef.current?.value ?? ""));

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    if (sanitize) event.target.value = sanitize(event.target.value);
    setValue(toComparable(event.target.value));
    onChange?.(event);
  }

  return (
    <input
      ref={inputRef}
      defaultValue={defaultValue}
      onChange={handleChange}
      className={clsx(className, showChanged && FIELD_CHANGED_CLASS)}
      {...rest}
    />
  );
}

type TrackedTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function TrackedTextarea({ defaultValue, className, onChange, ...rest }: TrackedTextareaProps) {
  const areaRef = useRef<HTMLTextAreaElement>(null);
  const { setValue, showChanged } = useTrackedField(defaultValue, () => toComparable(areaRef.current?.value ?? ""));

  function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setValue(toComparable(event.target.value));
    onChange?.(event);
  }

  return (
    <textarea
      ref={areaRef}
      defaultValue={defaultValue}
      onChange={handleChange}
      className={clsx(className, showChanged && FIELD_CHANGED_CLASS)}
      {...rest}
    />
  );
}

type TrackedSelectProps = {
  name: string;
  options: { value: string; label: string }[];
  defaultValue?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  "aria-label"?: string;
  onValueChange?: (value: string) => void;
};

export function TrackedSelect({ defaultValue, className, onValueChange, ...rest }: TrackedSelectProps) {
  const valueRef = useRef(toComparable(defaultValue));
  const { setValue, showChanged } = useTrackedField(defaultValue, () => valueRef.current);

  function handleValueChange(value: string) {
    valueRef.current = toComparable(value);
    setValue(valueRef.current);
    onValueChange?.(value);
  }

  return (
    <Select
      defaultValue={defaultValue}
      onValueChange={handleValueChange}
      className={clsx(className, showChanged && FIELD_CHANGED_CLASS)}
      {...rest}
    />
  );
}

/** Submit button gated on the form being dirty; matches the existing variant swap. */
export function DirtySaveButton({
  children,
  pendingLabel,
  size,
  className
}: {
  children: ReactNode;
  pendingLabel?: ReactNode;
  size?: ButtonSize;
  className?: string;
}) {
  const { isDirty } = useDirtyContext();
  return (
    <SubmitButton
      variant={isDirty ? "primary" : "secondary"}
      size={size}
      disabled={!isDirty}
      pendingLabel={pendingLabel}
      className={className}
    >
      {children}
    </SubmitButton>
  );
}
