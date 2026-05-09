import { Building2, Plus } from "lucide-react";
import { ManagerShell } from "@/components/manager/manager-shell";
import { DataTable } from "@/components/shared/table";
import { SectionTitle } from "@/components/shared/section-title";
import { Pill } from "@/components/shared/pill";
import { Button } from "@/components/shared/button";
import { setBranchActive } from "@/app/manager/actions";
import { listBranches } from "@/lib/data/branches";

export default async function ManagerBranchesPage() {
  const branches = await listBranches();

  return (
    <ManagerShell>
      <div className="space-y-7">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionTitle eyebrow="Locations" title="Branches" />
          <Button href="/manager/branches/new" icon={Plus}>Add branch</Button>
        </div>
        <DataTable
          headers={["Branch", "Address", "Status", "Actions"]}
          rows={branches.map((branch) => [
            <span key={`${branch.id}-name`} className="inline-flex items-center gap-2 font-medium text-charcoal">
              <Building2 className="h-4 w-4 text-matcha-deep" strokeWidth={1.75} aria-hidden="true" />
              {branch.name}
            </span>,
            <span key={`${branch.id}-address`} className="text-sm text-ink-muted">
              {branch.address}
            </span>,
            <Pill key={`${branch.id}-status`} tone={branch.active ? "default" : "muted"}>
              {branch.active ? "Open" : "Closed"}
            </Pill>,
            <div key={`${branch.id}-actions`} className="flex items-center gap-1.5">
              <Button href={`/manager/branches/${branch.id}/edit`} variant="tertiary">
                Edit
              </Button>
              <form action={setBranchActive}>
                <input type="hidden" name="id" value={branch.id} />
                <input type="hidden" name="active" value={branch.active ? "false" : "true"} />
                <button className="h-9 rounded-md border border-line bg-cream px-3 text-xs font-medium text-charcoal transition-colors duration-fast ease-out-soft hover:border-matcha-deep hover:text-matcha-deep">
                  {branch.active ? "Deactivate" : "Reactivate"}
                </button>
              </form>
            </div>
          ])}
        />
      </div>
    </ManagerShell>
  );
}
