import { Plus } from "lucide-react";
import { DataTable } from "@/components/shared/table";
import { SectionTitle } from "@/components/shared/section-title";
import { Pill } from "@/components/shared/pill";
import { Button } from "@/components/shared/button";
import { listManagerStaff } from "@/lib/data/manager";

export default async function ManagerStaffPage({
  searchParams
}: {
  searchParams: Promise<{ changed?: string }>;
}) {
  const { changed } = await searchParams;
  const staff = await listManagerStaff();

  return (
    <div className="flex min-h-0 flex-col gap-5 lg:h-full">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionTitle title="Staff" />
          <Button href="/manager/staff/new" icon={Plus}>Add staff</Button>
        </div>
        <DataTable
          headers={["Name", "Role", "Branch", "PIN", "Status"]}
          rowHrefs={staff.map(({ profile }) => `/manager/staff/${profile.id}/edit`)}
          rowKeys={staff.map(({ profile }) => profile.id)}
          highlightKey={changed}
          rows={staff.map(({ profile, detail, branchName }) => [
            <span key={`${profile.id}-name`} className="font-medium text-charcoal">
              {profile.name}
            </span>,
            <span key={`${profile.id}-role`} className="capitalize text-sm text-ink-muted">
              {detail.role}
            </span>,
            <span key={`${profile.id}-branch`} className="text-sm text-ink-muted">
              {branchName ?? "All branches"}
            </span>,
            <span key={`${profile.id}-pin`} className="text-sm text-ink-muted">
              {detail.pinHash ? "Set" : "Not required"}
            </span>,
            <Pill key={`${profile.id}-status`} tone={profile.active ? "default" : "muted"}>
              {profile.active ? "Active" : "Resting"}
            </Pill>
          ])}
        />
      </div>
  );
}
