import { ManagerShell } from "@/components/manager/manager-shell";
import { DataTable } from "@/components/shared/table";
import { SectionTitle } from "@/components/shared/section-title";
import { getBranch, staff } from "@/lib/mock-data";

export default function ManagerStaffPage() {
  return (
    <ManagerShell>
      <div className="space-y-6">
        <SectionTitle eyebrow="Team" title="Staff" />
        <DataTable
          headers={["Name", "Role", "Branch", "PIN", "Status"]}
          rows={staff.map((member) => [
            member.name,
            <span key={`${member.id}-role`} className="capitalize">{member.role}</span>,
            getBranch(member.branchId)?.name ?? "All branches",
            member.pinSet ? "Set" : "Not required",
            member.active ? "Active" : "Inactive"
          ])}
        />
      </div>
    </ManagerShell>
  );
}
