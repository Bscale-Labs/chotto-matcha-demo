"use client";

import {
  useId,
  useRef,
  useState,
  type ClipboardEvent,
  type KeyboardEvent
} from "react";
import { clsx } from "clsx";

const PIN_LENGTH = 4;

function onlyDigits(value: string) {
  return value.replace(/\D/g, "").slice(0, PIN_LENGTH);
}

function toDigits(value: string) {
  return onlyDigits(value).padEnd(PIN_LENGTH, " ").split("").map((digit) => digit.trim());
}

export function PinInput({
  name,
  label,
  hint,
  id,
  value,
  defaultValue = "",
  onValueChange,
  disabled,
  className
}: {
  name: string;
  label: string;
  hint?: string;
  id?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
}) {
  const generatedId = useId();
  const baseId = id ?? `pin-${generatedId}`;
  const labelId = `${baseId}-label`;
  const hintId = `${baseId}-hint`;
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(() => onlyDigits(defaultValue));
  const pin = isControlled ? onlyDigits(value) : internalValue;
  const digits = toDigits(pin);

  function commit(nextValue: string, focusIndex?: number) {
    const normalized = onlyDigits(nextValue);
    if (!isControlled) setInternalValue(normalized);
    onValueChange?.(normalized);
    if (focusIndex !== undefined) {
      requestAnimationFrame(() => refs.current[Math.min(PIN_LENGTH - 1, Math.max(0, focusIndex))]?.focus());
    }
  }

  function setDigit(index: number, rawValue: string) {
    const nextDigits = digits.slice();
    const incoming = onlyDigits(rawValue);

    if (incoming.length > 1) {
      for (let offset = 0; offset < incoming.length && index + offset < PIN_LENGTH; offset += 1) {
        nextDigits[index + offset] = incoming[offset];
      }
      commit(nextDigits.join(""), Math.min(index + incoming.length, PIN_LENGTH - 1));
      return;
    }

    nextDigits[index] = incoming;
    commit(nextDigits.join(""), incoming ? index + 1 : index);
  }

  function handleKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      event.preventDefault();
      const nextDigits = digits.slice();
      nextDigits[index - 1] = "";
      commit(nextDigits.join(""), index - 1);
    }
  }

  function handlePaste(index: number, event: ClipboardEvent<HTMLInputElement>) {
    const pasted = onlyDigits(event.clipboardData.getData("text"));
    if (!pasted) return;
    event.preventDefault();
    setDigit(index, pasted);
  }

  return (
    <div className={clsx("grid gap-2", className)}>
      <input type="hidden" name={name} value={pin} />
      <span id={labelId} className="text-sm font-medium text-charcoal">
        {label}
      </span>
      <div className="grid grid-cols-4 gap-2 sm:max-w-[18rem]" role="group" aria-labelledby={labelId} aria-describedby={hint ? hintId : undefined}>
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(node) => {
              refs.current[index] = node;
            }}
            type="password"
            inputMode="numeric"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            pattern="[0-9]*"
            maxLength={1}
            value={digit}
            disabled={disabled}
            aria-label={`${label} digit ${index + 1}`}
            onChange={(event) => setDigit(index, event.target.value)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            onPaste={(event) => handlePaste(index, event)}
            className="counter h-12 min-w-0 rounded-md border border-line bg-cream text-center text-lg font-semibold text-charcoal transition-colors duration-fast ease-out-soft placeholder:text-ink-faint focus:border-matcha-deep focus:outline-none focus:shadow-focus disabled:cursor-not-allowed disabled:bg-stone disabled:text-ink-faint"
          />
        ))}
      </div>
      {hint ? (
        <span id={hintId} className="text-xs leading-[18px] text-ink-muted">
          {hint}
        </span>
      ) : null}
    </div>
  );
}
