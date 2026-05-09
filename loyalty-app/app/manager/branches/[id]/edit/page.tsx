import { notFound } from "next/navigation";
import { ManagerShell } from "@/components/manager/manager-shell";
import { SectionTitle } from "@/components/shared/section-title";
import { Button } from "@/components/shared/button";
import { updateBranch } from "@/app/manager/actions";
import { getBranchById } from "@/lib/data/branches";

export default async function EditBranchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const branch = await getBranchById(id);
  if (!branch) notFound();

  return (
    <ManagerShell>
      <div className="space-y-7">
        <SectionTitle eyebrow="Locations" title="Edit branch" />
        <form action={updateBranch} className="grid max-w-2xl gap-4 rounded-lg border border-line-soft bg-cream p-6">
          <input type="hidden" name="id" value={branch.id} />
          <input name="name" required defaultValue={branch.name} className="rounded-md border border-line bg-cream px-4 py-3 focus:border-matcha-deep focus:outline-none focus:shadow-focus" />
          <textarea name="address" required defaultValue={branch.address} className="min-h-28 rounded-md border border-line bg-cream px-4 py-3 focus:border-matcha-deep focus:outline-none focus:shadow-focus" />
          <div className="flex gap-3">
            <Button type="submit">Save branch</Button>
            <Button href="/manager/branches" variant="secondary">Cancel</Button>
          </div>
        </form>
      </div>
    </ManagerShell>
  );
}
