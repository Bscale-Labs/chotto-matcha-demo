import { notFound } from "next/navigation";
import { ManagerShell } from "@/components/manager/manager-shell";
import { SectionTitle } from "@/components/shared/section-title";
import { BranchDetailsForm } from "@/components/manager/branch-details-form";
import { getBranchById } from "@/lib/data/branches";

export default async function EditBranchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const branch = await getBranchById(id);
  if (!branch) notFound();

  return (
    <ManagerShell>
      <div className="space-y-7">
        <SectionTitle title="Edit branch" />
        <BranchDetailsForm mode="edit" branch={branch} />
      </div>
    </ManagerShell>
  );
}
