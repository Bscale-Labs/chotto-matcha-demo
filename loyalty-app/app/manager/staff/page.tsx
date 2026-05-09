import { ManagerShell } from "@/components/manager/manager-shell";
import { DataTable } from "@/components/shared/table";
import { SectionTitle } from "@/components/shared/section-title";
import { Pill } from "@/components/shared/pill";
import { getBranch, staff } from "@/lib/mock-data";

export default function ManagerStaffPage() {
  return (
    <ManagerShell>
      <div className="space-y-7">
        <SectionTitle eyebrow="Team" title="Staff" />
        <DataTable
          headers={["Name", "Role", "Branch", "PIN", "Status"]}
          rows={staff.map((member) => [
            <span key={`${member.id}-name`} className="font-medium text-charcoal">
              {member.name}
            </span>,
            <span key={`${member.id}-role`} className="capitalize text-sm text-ink-muted">
              {member.role}
            </span>,
            <span key={`${member.id}-branch`} className="text-sm text-ink-muted">
              {getBranch(member.branchId)?.name ?? "All branches"}
            </span>,
            <span key={`${member.id}-pin`} className="text-sm text-ink-muted">
              {member.pinSet ? "Set" : "Not required"}
            </span>,
            <Pill key={`${member.id}-status`} tone={member.active ? "default" : "muted"}>
              {member.active ? "Active" : "Resting"}
            </Pill>
          ])}
        />
      </div>
    </ManagerShell>
  );
}
