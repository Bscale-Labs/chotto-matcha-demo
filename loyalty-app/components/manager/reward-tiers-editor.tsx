"use client";

import { useMemo, useState } from "react";
import { clsx } from "clsx";
import { Check, Pencil, Plus, Trash2 } from "lucide-react";
import { updateRewardTiers } from "@/app/manager/actions";
import { Button } from "@/components/shared/button";
import { FIELD_CHANGED_CLASS } from "@/components/shared/dirty-form";
import { SubmitButton } from "@/components/shared/submit-button";
import { Tooltip } from "@/components/shared/tooltip";
import { ToastActionForm } from "@/components/shared/toast-action-form";
import { formatPoints } from "@/lib/formatters";
import { tierIcon } from "@/lib/loyalty";

type EditorTier = { id: string; name: string; min: number; vibe: string };
type Row = { id: string; name: string; min: string; vibe: string };

function makeId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `tier-${Date.now().toString(36)}`;
}

function formatRange(rows: Row[], index: number) {
  const raw = rows[index].min.trim();
  if (raw === "") return "—";
  const min = Number(raw);
  if (!Number.isFinite(min)) return "—";

  const nextRaw = rows[index + 1]?.min.trim();
  const nextMin = nextRaw ? Number(nextRaw) : NaN;
  if (index + 1 < rows.length && Number.isFinite(nextMin)) {
    return `${formatPoints(min)}-${formatPoints(Math.max(min, nextMin - 1))}`;
  }
  return `${formatPoints(min)}+`;
}

function sortedRows(rows: Row[]) {
  return [...rows].sort((left, right) => {
    const leftMin = left.min.trim() === "" ? Number.POSITIVE_INFINITY : Number(left.min);
    const rightMin = right.min.trim() === "" ? Number.POSITIVE_INFINITY : Number(right.min);
    if (Number.isFinite(leftMin) && Number.isFinite(rightMin) && leftMin !== rightMin) {
      return leftMin - rightMin;
    }
    if (Number.isFinite(leftMin) !== Number.isFinite(rightMin)) {
      return Number.isFinite(leftMin) ? -1 : 1;
    }
    return rows.indexOf(left) - rows.indexOf(right);
  });
}

function formatMinPoints(value: string) {
  const raw = value.trim();
  if (raw === "") return "—";
  const min = Number(raw);
  return Number.isFinite(min) ? formatPoints(min) : "—";
}

const editorGrid =
  "lg:grid-cols-[180px_minmax(160px,0.9fr)_150px_minmax(260px,1.3fr)_88px]";

const fieldClass =
  "h-11 w-full min-w-0 rounded-md border border-line bg-cream px-3 text-sm text-charcoal focus:border-matcha-deep focus:outline-none focus:shadow-focus";

const displayCellClass =
  "flex min-h-11 min-w-0 items-center rounded-md px-3 text-sm text-charcoal";

const iconButtonClass =
  "inline-flex h-11 w-11 items-center justify-center rounded-pill text-ink-muted transition-colors duration-fast ease-out-soft hover:bg-sage-wash hover:text-matcha-deep";

export function RewardTiersEditor({ initialTiers }: { initialTiers: EditorTier[] }) {
  const [rows, setRows] = useState<Row[]>(
    initialTiers.map((tier) => ({
      id: tier.id,
      name: tier.name,
      min: String(tier.min),
      vibe: tier.vibe
    }))
  );
  const [editingIds, setEditingIds] = useState<Set<string>>(new Set());

  // Baseline the fields against the saved tiers (keyed by id). After a save the
  // page refreshes with the new values, so highlights and the dirty gate clear
  // on their own. A row with no baseline is newly added, so it counts as changed.
  const baselineById = useMemo(
    () =>
      new Map(
        initialTiers.map((tier) => [tier.id, { name: tier.name, min: String(tier.min), vibe: tier.vibe }])
      ),
    [initialTiers]
  );

  function fieldChanged(row: Row, key: keyof Omit<Row, "id">) {
    const base = baselineById.get(row.id);
    return base ? row[key] !== base[key] : true;
  }

  const dirty = useMemo(() => {
    if (rows.length !== initialTiers.length) return true;
    return rows.some((row) => {
      const base = baselineById.get(row.id);
      return base ? row.name !== base.name || row.min !== base.min || row.vibe !== base.vibe : true;
    });
  }, [rows, initialTiers.length, baselineById]);

  const displayRows = useMemo(() => sortedRows(rows), [rows]);

  function updateRow(id: string, patch: Partial<Row>) {
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  }

  function addRow() {
    const id = makeId();
    setRows((prev) => [...prev, { id, name: "", min: "", vibe: "" }]);
    setEditingIds((prev) => new Set(prev).add(id));
  }

  function removeRow(id: string) {
    setRows((prev) => (prev.length > 1 ? prev.filter((row) => row.id !== id) : prev));
    setEditingIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }

  function editRow(id: string) {
    setEditingIds((prev) => new Set(prev).add(id));
  }

  function finishEditingRow(id: string) {
    setEditingIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }

  return (
    <ToastActionForm
      action={updateRewardTiers}
      successTitle="Reward tiers saved"
      errorTitle="Could not save reward tiers"
      className="surface-paper overflow-hidden rounded-lg"
    >
      <div
        className={clsx(
          "hidden items-center gap-3 border-b border-line-soft bg-stone px-4 py-3 text-[11px] font-semibold uppercase tracking-eyebrow text-ink-muted lg:grid",
          editorGrid
        )}
      >
        <span>Tier</span>
        <span>Name</span>
        <span>Minimum points</span>
        <span>Badge copy</span>
        <span className="sr-only">Actions</span>
      </div>

      <div>
        {displayRows.map((row, index) => {
          const Icon = tierIcon(row.id, index);
          const isNew = !baselineById.has(row.id);
          const isEditing = isNew || editingIds.has(row.id);

          return (
            <section
              key={row.id}
              className={clsx(
                "grid gap-3 border-b border-line-soft bg-cream p-4 last:border-b-0 lg:items-center",
                editorGrid
              )}
            >
              <input type="hidden" name="tierId" value={row.id} />
              {!isEditing ? (
                <>
                  <input type="hidden" name={`name-${row.id}`} value={row.name} />
                  <input type="hidden" name={`minPoints-${row.id}`} value={row.min} />
                  <input type="hidden" name={`description-${row.id}`} value={row.vibe} />
                </>
              ) : null}

              <div className="flex min-w-0 items-center gap-3 lg:block">
                <div className="min-w-0">
                  <span className="inline-flex max-w-full items-center gap-1.5 rounded-pill bg-sage-wash px-3 py-1.5 text-sm font-medium text-matcha-deep">
                    <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
                    <span className="min-w-0 truncate tracking-tight">
                      {row.name.trim() || "New tier"}
                    </span>
                  </span>
                  <p className="counter mt-2 text-sm font-medium text-ink-muted">
                    {formatRange(displayRows, index)} pts
                  </p>
                </div>
              </div>

              {isEditing ? (
                <label className="grid gap-2 text-sm font-medium text-charcoal lg:block">
                  <span className="lg:sr-only">Name</span>
                  <input
                    name={`name-${row.id}`}
                    required
                    value={row.name}
                    onChange={(event) => updateRow(row.id, { name: event.target.value })}
                    className={clsx(
                      fieldClass,
                      fieldChanged(row, "name") && FIELD_CHANGED_CLASS
                    )}
                  />
                </label>
              ) : (
                <div className="grid gap-1 text-sm font-medium text-charcoal lg:block">
                  <span className="text-xs font-medium text-ink-muted lg:sr-only">Name</span>
                  <span className={clsx(displayCellClass, fieldChanged(row, "name") && FIELD_CHANGED_CLASS)}>
                    {row.name}
                  </span>
                </div>
              )}

              {isEditing ? (
                <label className="grid gap-2 text-sm font-medium text-charcoal lg:block">
                  <span className="lg:sr-only">Minimum points</span>
                  <input
                    name={`minPoints-${row.id}`}
                    required
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={row.min}
                    onChange={(event) =>
                      updateRow(row.id, { min: event.target.value.replace(/[^0-9]/g, "") })
                    }
                    className={clsx(
                      fieldClass,
                      "counter font-semibold",
                      fieldChanged(row, "min") && FIELD_CHANGED_CLASS
                    )}
                  />
                </label>
              ) : (
                <div className="grid gap-1 text-sm font-medium text-charcoal lg:block">
                  <span className="text-xs font-medium text-ink-muted lg:sr-only">Minimum points</span>
                  <span className={clsx(displayCellClass, "counter font-semibold", fieldChanged(row, "min") && FIELD_CHANGED_CLASS)}>
                    {formatMinPoints(row.min)}
                  </span>
                </div>
              )}

              {isEditing ? (
                <label className="grid gap-2 text-sm font-medium text-charcoal lg:block">
                  <span className="lg:sr-only">Badge copy</span>
                  <input
                    name={`description-${row.id}`}
                    required
                    value={row.vibe}
                    onChange={(event) => updateRow(row.id, { vibe: event.target.value })}
                    className={clsx(
                      fieldClass,
                      fieldChanged(row, "vibe") && FIELD_CHANGED_CLASS
                    )}
                  />
                </label>
              ) : (
                <div className="grid gap-1 text-sm font-medium text-charcoal lg:block">
                  <span className="text-xs font-medium text-ink-muted lg:sr-only">Badge copy</span>
                  <span className={clsx(displayCellClass, "text-ink-muted", fieldChanged(row, "vibe") && FIELD_CHANGED_CLASS)}>
                    {row.vibe}
                  </span>
                </div>
              )}

              <div className="flex justify-end gap-1">
                {isEditing ? (
                  <>
                    {rows.length > 1 ? (
                      <Tooltip label="Remove tier">
                        <button
                          type="button"
                          onClick={() => removeRow(row.id)}
                          aria-label={`Remove ${row.name.trim() || "tier"}`}
                          className="inline-flex h-11 w-11 items-center justify-center rounded-pill text-ink-muted transition-colors duration-fast ease-out-soft hover:bg-warn-fill hover:text-error-text"
                        >
                          <Trash2 className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                        </button>
                      </Tooltip>
                    ) : null}
                    {!isNew ? (
                      <Tooltip label="Done editing">
                        <button
                          type="button"
                          onClick={() => finishEditingRow(row.id)}
                          aria-label={`Done editing ${row.name.trim() || "tier"}`}
                          className={iconButtonClass}
                        >
                          <Check className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                        </button>
                      </Tooltip>
                    ) : null}
                  </>
                ) : (
                  <Tooltip label="Edit tier">
                    <button
                      type="button"
                      onClick={() => editRow(row.id)}
                      aria-label={`Edit ${row.name.trim() || "tier"}`}
                      className={iconButtonClass}
                    >
                      <Pencil className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                    </button>
                  </Tooltip>
                )}
              </div>
            </section>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-end gap-3 border-t border-line-soft bg-cream p-4">
        <Button type="button" variant="secondary" icon={Plus} onClick={addRow}>
          Add tier
        </Button>
        <SubmitButton variant={dirty ? "primary" : "secondary"} disabled={!dirty} pendingLabel="Saving…">
          Save tiers
        </SubmitButton>
      </div>
    </ToastActionForm>
  );
}
