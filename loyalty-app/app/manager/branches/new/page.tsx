import { ManagerShell } from "@/components/manager/manager-shell";
import { SectionTitle } from "@/components/shared/section-title";
import { Button } from "@/components/shared/button";
import { createBranch } from "@/app/manager/actions";

export default function NewBranchPage() {
  return (
    <ManagerShell>
      <div className="space-y-7">
        <SectionTitle eyebrow="Locations" title="Add branch" />
        <form action={createBranch} className="grid max-w-2xl gap-4 rounded-lg border border-line-soft bg-cream p-6">
          <input name="name" required placeholder="Branch name" className="rounded-md border border-line bg-cream px-4 py-3 focus:border-matcha-deep focus:outline-none focus:shadow-focus" />
          <textarea name="address" required placeholder="Address" className="min-h-28 rounded-md border border-line bg-cream px-4 py-3 focus:border-matcha-deep focus:outline-none focus:shadow-focus" />
          <div className="flex gap-3">
            <Button type="submit">Create branch</Button>
            <Button href="/manager/branches" variant="secondary">Cancel</Button>
          </div>
        </form>
      </div>
    </ManagerShell>
  );
}
