import { clsx } from "clsx";

export function DataTable({
  headers,
  rows,
  className
}: {
  headers: string[];
  rows: React.ReactNode[][];
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "overflow-hidden rounded-lg border border-line-soft bg-cream",
        className
      )}
    >
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-line-soft bg-stone">
            {headers.map((header) => (
              <th
                key={header}
                className="eyebrow px-4 py-3 text-ink-muted"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="border-t border-line-soft transition-colors duration-fast ease-out-soft hover:bg-stone/60 first:border-t-0"
            >
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-4 py-3.5 align-middle text-charcoal">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
