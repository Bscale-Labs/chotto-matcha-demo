import { clsx } from "clsx";
import Link from "next/link";

function getColumnTemplate(headers: string[]) {
  const signature = headers.join("|");

  switch (signature) {
    case "When|Branch|Type|Points":
      return "minmax(8rem,1.05fr) minmax(12rem,1.25fr) minmax(8rem,0.8fr) minmax(8rem,0.75fr)";
    case "Branch|Address|Google Maps|Status":
      return "minmax(13rem,1.15fr) minmax(18rem,1.65fr) minmax(12rem,1fr) minmax(8rem,0.7fr)";
    case "Name|Contact|Tier|Points|Status":
      return "minmax(12rem,1.15fr) minmax(16rem,1.45fr) minmax(9rem,0.85fr) minmax(8rem,0.7fr) minmax(8rem,0.65fr)";
    case "Reward|Type|Cost|Branches|Status":
    case "Reward|Type|Cost|Branch stock|Branch status":
      return "minmax(15rem,1.45fr) minmax(8rem,0.7fr) minmax(8rem,0.7fr) minmax(12rem,1.05fr) minmax(9rem,0.8fr)";
    case "Name|Role|Branch|PIN|Status":
      return "minmax(12rem,1.15fr) minmax(9rem,0.75fr) minmax(12rem,1.15fr) minmax(8rem,0.7fr) minmax(8rem,0.7fr)";
    case "When|Member|Staff|Branch|Type|Bill|Points":
      return "minmax(9rem,1fr) minmax(11rem,1.05fr) minmax(10rem,1fr) minmax(12rem,1.05fr) minmax(11rem,1.05fr) minmax(7rem,0.65fr) minmax(8rem,0.7fr)";
    default:
      return `repeat(${headers.length}, minmax(0, 1fr))`;
  }
}

export function DataTable({
  headers,
  rows,
  rowHrefs,
  rowKeys,
  highlightKey,
  className
}: {
  headers: string[];
  rows: React.ReactNode[][];
  rowHrefs?: string[];
  /** Stable id per row, used to match `highlightKey`. */
  rowKeys?: string[];
  /** Id of the row that just changed — flashes a highlight on it. */
  highlightKey?: string;
  className?: string;
}) {
  const columnTemplate = getColumnTemplate(headers);

  return (
    <div className={clsx("surface-paper overflow-hidden rounded-lg", className)}>
      <div className="overflow-x-auto overscroll-x-none">
        <div className="min-w-[640px] text-left text-sm" role="table">
          <div className="bg-matcha-deep text-cream" role="rowgroup">
            <div
              className="grid"
              role="row"
              style={{ gridTemplateColumns: columnTemplate }}
            >
              {headers.map((header) => (
                <div
                  key={header}
                  className="min-w-0 bg-matcha-deep px-5 py-3.5 text-[11px] font-semibold uppercase tracking-eyebrow text-cream/85 first:rounded-tl-lg last:rounded-tr-lg"
                  role="columnheader"
                >
                  {header}
                </div>
              ))}
            </div>
          </div>
          <div
            className="max-h-none overflow-y-auto overscroll-none lg:max-h-[calc(100vh-21rem)]"
            role="rowgroup"
          >
            {rows.map((row, rowIndex) => (
              <div
                key={rowKeys?.[rowIndex] ?? rowIndex}
                className={clsx(
                  "grid",
                  "border-t border-line-soft transition-colors duration-fast ease-out-soft first:border-t-0",
                  rowHrefs?.[rowIndex] ? "cursor-pointer hover:bg-sage-wash/60" : "hover:bg-stone/50",
                  highlightKey && rowKeys?.[rowIndex] === highlightKey && "row-flash"
                )}
                role="row"
                style={{ gridTemplateColumns: columnTemplate }}
              >
                {row.map((cell, cellIndex) => (
                  <div key={cellIndex} className="min-w-0 px-5 py-4 text-charcoal" role="cell">
                    {rowHrefs?.[rowIndex] ? (
                      <Link
                        href={rowHrefs[rowIndex]}
                        className="-mx-5 -my-4 block px-5 py-4"
                      >
                        {cell}
                      </Link>
                    ) : (
                      cell
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
