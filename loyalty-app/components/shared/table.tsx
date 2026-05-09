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
    <div className={clsx("matcha-card overflow-hidden rounded-[8px]", className)}>
      <table className="w-full border-collapse text-left text-sm">
        <thead className="bg-moss text-paper">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-4 py-3 text-xs font-bold uppercase tracking-[0.16em]">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-t border-moss/10">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-4 py-4 text-ink/78">
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
