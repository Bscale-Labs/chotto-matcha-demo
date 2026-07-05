"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, X } from "lucide-react";
import { clsx } from "clsx";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];
const DATE_DISPLAY_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric"
});
const MONTH_LABEL_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric"
});
const DAY_LABEL_FORMATTER = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric"
});

function parseIsoDate(value?: string) {
  if (!value) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

function toIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function sameDate(a: Date | null, b: Date | null) {
  if (!a || !b) return false;
  return toIsoDate(a) === toIsoDate(b);
}

function isBetween(date: Date, start: Date | null, end: Date | null) {
  if (!start || !end) return false;
  const time = date.getTime();
  return time > start.getTime() && time < end.getTime();
}

function monthStart(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, months: number) {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

function buildMonthDays(month: Date) {
  const first = monthStart(month);
  const gridStart = new Date(first);
  gridStart.setDate(first.getDate() - first.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);
    return date;
  });
}

function formatDisplay(date: Date | null) {
  if (!date) return "";
  return DATE_DISPLAY_FORMATTER.format(date);
}

export function DateRangePicker({
  from,
  to,
  className
}: {
  from?: string;
  to?: string;
  className?: string;
}) {
  const rangeId = useId();
  const labelId = `${rangeId}-label`;
  const panelId = `${rangeId}-panel`;
  const wrapRef = useRef<HTMLDivElement>(null);
  const initialFrom = useMemo(() => parseIsoDate(from), [from]);
  const initialTo = useMemo(() => parseIsoDate(to), [to]);
  const [startDate, setStartDate] = useState<Date | null>(initialFrom);
  const [endDate, setEndDate] = useState<Date | null>(initialTo);
  const [visibleMonth, setVisibleMonth] = useState(() => monthStart(initialFrom ?? initialTo ?? new Date()));
  const [open, setOpen] = useState(false);
  const days = useMemo(() => buildMonthDays(visibleMonth), [visibleMonth]);
  const monthLabel = MONTH_LABEL_FORMATTER.format(visibleMonth);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false);
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function selectDate(day: Date) {
    const selected = startOfDay(day);
    if (!startDate || endDate) {
      setStartDate(selected);
      setEndDate(null);
      return;
    }

    if (selected.getTime() < startDate.getTime()) {
      setStartDate(selected);
      setEndDate(startDate);
      setOpen(false);
      return;
    }

    setEndDate(selected);
    setOpen(false);
  }

  function clearRange() {
    setStartDate(null);
    setEndDate(null);
  }

  function selectToday() {
    const today = startOfDay(new Date());
    setStartDate(today);
    setEndDate(today);
    setVisibleMonth(monthStart(today));
    setOpen(false);
  }

  return (
    <div ref={wrapRef} className={clsx("relative grid min-w-0 gap-1 text-xs font-medium text-ink-muted", className)}>
      <span id={labelId}>Date range</span>
      <input type="hidden" name="from" value={startDate ? toIsoDate(startDate) : ""} />
      <input type="hidden" name="to" value={endDate ? toIsoDate(endDate) : ""} />
      <button
        type="button"
        aria-labelledby={labelId}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={() => setOpen((current) => !current)}
        className={clsx(
          "gloss grid h-11 min-h-tap w-full min-w-0 grid-cols-[1fr_auto_1fr] items-center gap-2 rounded-md border bg-cream px-3 text-left text-sm text-charcoal transition-colors duration-fast ease-out-soft hover:border-matcha-deep focus:outline-none focus:shadow-focus",
          open ? "border-matcha-deep shadow-focus" : "border-line"
        )}
      >
        <span className="min-w-0">
          <span className="block text-[10px] font-semibold uppercase tracking-eyebrow text-ink-faint">Start</span>
          <span className={clsx("block truncate", !startDate && "text-ink-faint")}>
            {formatDisplay(startDate) || "Start date"}
          </span>
        </span>
        <CalendarDays className="h-4 w-4 shrink-0 text-matcha-deep" strokeWidth={1.75} aria-hidden="true" />
        <span className="min-w-0">
          <span className="block text-[10px] font-semibold uppercase tracking-eyebrow text-ink-faint">End</span>
          <span className={clsx("block truncate", !endDate && "text-ink-faint")}>
            {formatDisplay(endDate) || "End date"}
          </span>
        </span>
      </button>

      {open ? (
        <div
          id={panelId}
          // .surface-glass-strong sets position:relative / overflow:hidden for cards.
          // This panel must float above the filter bar instead of resizing the grid row.
          style={{ position: "absolute", overflow: "visible" }}
          className="surface-glass-strong absolute left-0 top-full z-50 mt-2 w-[min(22rem,calc(100vw-3rem))] rounded-lg p-3"
        >
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setVisibleMonth((month) => addMonths(month, -1))}
              className="grid h-9 w-9 place-items-center rounded-md text-matcha-deep transition-colors duration-fast ease-out-soft hover:bg-sage-wash focus:outline-none focus:shadow-focus"
              aria-label="Previous month"
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
            </button>
            <p className="text-sm font-semibold text-charcoal">{monthLabel}</p>
            <button
              type="button"
              onClick={() => setVisibleMonth((month) => addMonths(month, 1))}
              className="grid h-9 w-9 place-items-center rounded-md text-matcha-deep transition-colors duration-fast ease-out-soft hover:bg-sage-wash focus:outline-none focus:shadow-focus"
              aria-label="Next month"
            >
              <ChevronRight className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
            </button>
          </div>

          <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-ink-muted">
            {WEEKDAYS.map((weekday, index) => (
              <span key={`${weekday}-${index}`} className="py-1">
                {weekday}
              </span>
            ))}
          </div>

          <div className="mt-1 grid grid-cols-7 gap-1">
            {days.map((day) => {
              const inVisibleMonth = day.getMonth() === visibleMonth.getMonth();
              const selectedStart = sameDate(day, startDate);
              const selectedEnd = sameDate(day, endDate);
              const selected = selectedStart || selectedEnd;
              const inRange = isBetween(day, startDate, endDate);
              const today = sameDate(day, startOfDay(new Date()));

              return (
                <button
                  key={toIsoDate(day)}
                  type="button"
                  onClick={() => selectDate(day)}
                  className={clsx(
                    "counter relative grid h-9 place-items-center rounded-md text-xs font-medium transition-colors duration-fast ease-out-soft focus:outline-none focus:shadow-focus",
                    selected
                      ? "bg-matcha-deep text-cream shadow-sm"
                      : inRange
                        ? "bg-sage-wash text-matcha-deep"
                        : "text-charcoal hover:bg-sage-wash",
                    !inVisibleMonth && !selected && "text-ink-faint",
                    today && !selected && "ring-1 ring-sage-tint"
                  )}
                  aria-label={DAY_LABEL_FORMATTER.format(day)}
                >
                  {day.getDate()}
                </button>
              );
            })}
          </div>

          <div className="mt-3 flex items-center justify-between gap-2 border-t border-line-soft pt-3">
            <button
              type="button"
              onClick={clearRange}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-md px-2.5 text-xs font-semibold text-ink-muted transition-colors duration-fast ease-out-soft hover:bg-sage-wash hover:text-matcha-deep focus:outline-none focus:shadow-focus"
            >
              <X className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
              Clear
            </button>
            <button
              type="button"
              onClick={selectToday}
              className="min-h-9 rounded-md px-3 text-xs font-semibold text-matcha-deep transition-colors duration-fast ease-out-soft hover:bg-sage-wash focus:outline-none focus:shadow-focus"
            >
              Today
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
