import { ManagerShell } from "@/components/manager/manager-shell";
import { SectionTitle } from "@/components/shared/section-title";
import { StaffCreateForm } from "@/components/manager/staff-create-form";
import { listActiveBranches } from "@/lib/data/branches";

export default async function NewStaffPage() {
  const branches = await listActiveBranches();

  return (
    <ManagerShell>
      <div className="space-y-7">
        <SectionTitle title="Add staff" />
        <section className="max-w-2xl rounded-lg border border-line-soft bg-cream p-6">
          <StaffCreateForm branches={branches.map((branch) => ({ id: branch.id, name: branch.name }))} />
        </section>
      </div>
    </ManagerShell>
  );
}
