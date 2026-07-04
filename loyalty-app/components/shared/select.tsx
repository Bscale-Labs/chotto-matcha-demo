"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { Check, ChevronDown } from "lucide-react";
import { clsx } from "clsx";

export type SelectOption = { value: string; label: string };

type SelectProps = {
  name: string;
  options: SelectOption[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  onChange?: () => void;
  placeholder?: string;
  id?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
};

/**
 * On-brand dropdown. The native <select> option list is OS-rendered and can't be
 * styled, so this is a custom listbox: a paper/ceramic trigger with the gloss cue,
 * a Focus-Glass menu, and a matcha-lacquer selected row. A hidden input carries the
 * value so it submits inside normal forms and server-action forms.
 */
export function Select({
  name,
  options,
  defaultValue,
  value: controlledValue,
  onValueChange,
  onChange,
  placeholder = "Select…",
  id,
  required,
  disabled,
  className,
  "aria-label": ariaLabel
}: SelectProps) {
  const reactId = useId();
  const baseId = id ?? `select-${reactId}`;
  const listboxId = `${baseId}-listbox`;
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue ?? "");
  const value = isControlled ? controlledValue : internalValue;
  const [open, setOpen] = useState(false);
  const selectedIndex = options.findIndex((option) => option.value === value);
  const [activeIndex, setActiveIndex] = useState(selectedIndex >= 0 ? selectedIndex : 0);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const selectedOption = selectedIndex >= 0 ? options[selectedIndex] : undefined;

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => listRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [open]);

  function focusTrigger() {
    requestAnimationFrame(() => triggerRef.current?.focus());
  }

  function openMenu() {
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
    setOpen(true);
  }

  function commit(index: number) {
    const option = options[index];
    if (!option) return;
    if (!isControlled) setInternalValue(option.value);
    onValueChange?.(option.value);
    onChange?.();
    setOpen(false);
    focusTrigger();
  }

  function onTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (disabled) return;
    if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
      event.preventDefault();
      setOpen(true);
    }
  }

  function onListKeyDown(event: KeyboardEvent<HTMLUListElement>) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActiveIndex((index) => Math.min(options.length - 1, index + 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        setActiveIndex((index) => Math.max(0, index - 1));
        break;
      case "Home":
        event.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        event.preventDefault();
        setActiveIndex(options.length - 1);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        commit(activeIndex);
        break;
      case "Escape":
        event.preventDefault();
        setOpen(false);
        focusTrigger();
        break;
      case "Tab":
        setOpen(false);
        break;
    }
  }

  return (
    <div ref={wrapRef} className="relative">
      <input type="hidden" name={name} value={value} required={required} />
      <button
        ref={triggerRef}
        type="button"
        id={baseId}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        aria-label={ariaLabel}
        onClick={() => {
          if (disabled) return;
          if (open) setOpen(false);
          else openMenu();
        }}
        onKeyDown={onTriggerKeyDown}
        className={clsx(
          "gloss flex min-h-[48px] w-full items-center justify-between gap-2 rounded-md border bg-cream px-4 text-left text-base text-charcoal transition-colors duration-fast ease-out-soft",
          open ? "border-matcha-deep shadow-focus" : "border-line hover:border-matcha-deep",
          disabled && "cursor-not-allowed text-ink-faint",
          className
        )}
      >
        <span className={clsx("truncate", !selectedOption && "text-ink-faint")}>
          {selectedOption?.label ?? placeholder}
        </span>
        <ChevronDown
          className={clsx(
            "h-4 w-4 shrink-0 text-ink-muted transition-transform duration-fast ease-out-soft",
            open && "rotate-180"
          )}
          strokeWidth={1.75}
          aria-hidden="true"
        />
      </button>
      {open ? (
        <ul
          ref={listRef}
          id={listboxId}
          role="listbox"
          tabIndex={-1}
          aria-activedescendant={`${baseId}-opt-${activeIndex}`}
          onKeyDown={onListKeyDown}
          // position/overflow set inline so they win over the unlayered
          // .surface-glass-strong rule (which forces position:relative / overflow:hidden)
          style={{ position: "absolute", overflowY: "auto" }}
          className="surface-glass-strong z-40 mt-2 max-h-64 w-full rounded-lg p-1.5 focus:outline-none"
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            const isActive = index === activeIndex;
            return (
              <li
                key={option.value}
                id={`${baseId}-opt-${index}`}
                role="option"
                aria-selected={isSelected}
                onClick={() => commit(index)}
                onMouseEnter={() => setActiveIndex(index)}
                className={clsx(
                  "flex min-h-tap cursor-pointer items-center justify-between gap-2 rounded-md px-3 text-sm font-medium transition-colors duration-fast ease-out-soft",
                  isSelected
                    ? "action-lacquer"
                    : isActive
                      ? "bg-sage-wash text-matcha-deep"
                      : "text-charcoal"
                )}
              >
                <span className="truncate">{option.label}</span>
                {isSelected ? (
                  <Check className="h-4 w-4 shrink-0 text-cream" strokeWidth={2} aria-hidden="true" />
                ) : null}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
