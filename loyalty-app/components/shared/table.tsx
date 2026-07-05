import { clsx } from "clsx";
import Link from "next/link";

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
  return (
    <div
      className={clsx(
        "surface-paper max-h-none overflow-auto overscroll-none rounded-lg lg:max-h-[calc(100vh-18rem)]",
        className
      )}
    >
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <thead>
          <tr className="bg-matcha-deep text-cream">
            {headers.map((header) => (
              <th
                key={header}
                className="sticky top-0 z-10 bg-matcha-deep px-5 py-3.5 text-[11px] font-semibold uppercase tracking-eyebrow text-cream/85 first:rounded-tl-lg last:rounded-tr-lg"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={rowKeys?.[rowIndex] ?? rowIndex}
              className={clsx(
                "border-t border-line-soft transition-colors duration-fast ease-out-soft first:border-t-0",
                rowHrefs?.[rowIndex] ? "cursor-pointer hover:bg-sage-wash/60" : "hover:bg-stone/50",
                highlightKey && rowKeys?.[rowIndex] === highlightKey && "row-flash"
              )}
            >
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-5 py-4 align-middle text-charcoal">
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
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
