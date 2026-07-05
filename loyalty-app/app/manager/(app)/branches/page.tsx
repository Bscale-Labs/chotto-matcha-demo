import { Building2, Plus } from "lucide-react";
import { DataTable } from "@/components/shared/table";
import { SectionTitle } from "@/components/shared/section-title";
import { Pill } from "@/components/shared/pill";
import { Button } from "@/components/shared/button";
import { listBranches } from "@/lib/data/branches";

export default async function ManagerBranchesPage({
  searchParams
}: {
  searchParams: Promise<{ changed?: string }>;
}) {
  const { changed } = await searchParams;
  const branches = await listBranches();

  return (
    <div className="flex min-h-0 flex-col gap-5 lg:h-full">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionTitle title="Branches" />
          <Button href="/manager/branches/new" icon={Plus}>Add branch</Button>
        </div>
        <DataTable
          headers={["Branch", "Address", "Google Maps", "Status"]}
          rowHrefs={branches.map((branch) => `/manager/branches/${branch.id}/edit`)}
          rowKeys={branches.map((branch) => branch.id)}
          highlightKey={changed}
          rows={branches.map((branch) => [
            <span key={`${branch.id}-name`} className="inline-flex items-center gap-2 font-medium text-charcoal">
              <Building2 className="h-4 w-4 text-matcha-deep" strokeWidth={1.75} aria-hidden="true" />
              <span className="grid">
                <span>{branch.name}</span>
                {branch.code ? <span className="text-xs font-medium text-ink-muted">{branch.code}</span> : null}
              </span>
            </span>,
            <span key={`${branch.id}-address`} className="text-sm text-ink-muted">
              {branch.address}
            </span>,
            <span key={`${branch.id}-map`} className="block max-w-[220px] truncate text-sm text-ink-muted">
              {branch.googleMapsUrl ?? "—"}
            </span>,
            <Pill key={`${branch.id}-status`} tone={branch.active ? "default" : "muted"}>
              {branch.active ? "Open" : "Closed"}
            </Pill>
          ])}
        />
      </div>
  );
}
