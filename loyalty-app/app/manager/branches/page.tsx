import { Building2 } from "lucide-react";
import { ManagerShell } from "@/components/manager/manager-shell";
import { DataTable } from "@/components/shared/table";
import { SectionTitle } from "@/components/shared/section-title";
import { Pill } from "@/components/shared/pill";
import { branches } from "@/lib/mock-data";

export default function ManagerBranchesPage() {
  return (
    <ManagerShell>
      <div className="space-y-7">
        <SectionTitle eyebrow="Locations" title="Branches" />
        <DataTable
          headers={["Branch", "Address", "Status"]}
          rows={branches.map((branch) => [
            <span key={`${branch.id}-name`} className="inline-flex items-center gap-2 font-medium text-charcoal">
              <Building2 className="h-4 w-4 text-matcha-deep" strokeWidth={1.5} aria-hidden="true" />
              {branch.name}
            </span>,
            <span key={`${branch.id}-address`} className="text-sm text-ink-muted">
              {branch.address}
            </span>,
            <Pill key={`${branch.id}-status`} tone={branch.active ? "default" : "muted"}>
              {branch.active ? "Open" : "Closed"}
            </Pill>
          ])}
        />
      </div>
    </ManagerShell>
  );
}
