import { notFound } from "next/navigation";
import { ManagerShell } from "@/components/manager/manager-shell";
import { SectionTitle } from "@/components/shared/section-title";
import { Button } from "@/components/shared/button";
import { updateStaff } from "@/app/manager/actions";
import { listActiveBranches } from "@/lib/data/branches";
import { getManagerStaffProfile } from "@/lib/data/manager";

export default async function EditStaffPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [staff, branches] = await Promise.all([getManagerStaffProfile(id), listActiveBranches()]);
  if (!staff) notFound();

  return (
    <ManagerShell>
      <div className="space-y-7">
        <SectionTitle eyebrow="Team" title="Edit staff" />
        <form action={updateStaff} className="grid max-w-2xl gap-4 rounded-lg border border-line-soft bg-cream p-6">
          <input type="hidden" name="id" value={staff.profile.id} />
          <input name="name" required defaultValue={staff.profile.name} className="rounded-md border border-line bg-cream px-4 py-3 focus:border-matcha-deep focus:outline-none focus:shadow-focus" />
          <input name="email" required type="email" defaultValue={staff.profile.email} className="rounded-md border border-line bg-cream px-4 py-3 focus:border-matcha-deep focus:outline-none focus:shadow-focus" />
          <select name="role" defaultValue={staff.detail.role} className="rounded-md border border-line bg-cream px-4 py-3 focus:border-matcha-deep focus:outline-none focus:shadow-focus">
            <option value="cashier">Cashier</option>
            <option value="manager">Manager</option>
          </select>
          <select name="branchId" defaultValue={staff.detail.branchId ?? ""} className="rounded-md border border-line bg-cream px-4 py-3 focus:border-matcha-deep focus:outline-none focus:shadow-focus">
            <option value="">All branches / manager</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>{branch.name}</option>
            ))}
          </select>
          <input name="pin" inputMode="numeric" placeholder="New cashier PIN; leave blank to keep current" className="rounded-md border border-line bg-cream px-4 py-3 focus:border-matcha-deep focus:outline-none focus:shadow-focus" />
          <div className="flex gap-3">
            <Button type="submit">Save staff</Button>
            <Button href="/manager/staff" variant="secondary">Cancel</Button>
          </div>
        </form>
      </div>
    </ManagerShell>
  );
}
