import { ManagerShell } from "@/components/manager/manager-shell";
import { DataTable } from "@/components/shared/table";
import { SectionTitle } from "@/components/shared/section-title";
import { branches } from "@/lib/mock-data";

export default function ManagerBranchesPage() {
  return (
    <ManagerShell>
      <div className="space-y-6">
        <SectionTitle eyebrow="Locations" title="Branches" />
        <DataTable
          headers={["Branch", "Address", "Status"]}
          rows={branches.map((branch) => [
            branch.name,
            branch.address,
            branch.active ? "Active" : "Inactive"
          ])}
        />
      </div>
    </ManagerShell>
  );
}
