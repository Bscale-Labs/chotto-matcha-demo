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
        "overflow-x-auto rounded-lg border border-line-soft bg-cream shadow-sm",
        className
      )}
    >
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <thead>
          <tr className="bg-matcha-deep text-cream">
            {headers.map((header) => (
              <th
                key={header}
                className="px-4 py-3 text-[11px] font-semibold uppercase tracking-eyebrow text-cream/85 first:rounded-tl-lg last:rounded-tr-lg"
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
              className="border-t border-line-soft transition-colors duration-fast ease-out-soft first:border-t-0 hover:bg-stone/50"
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
