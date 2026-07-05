import { notFound } from "next/navigation";
import { SectionTitle } from "@/components/shared/section-title";
import { Button } from "@/components/shared/button";
import {
  DirtyForm,
  DirtySaveButton,
  TrackedInput,
  TrackedSelect
} from "@/components/shared/dirty-form";
import { setStaffActive, updateStaff } from "@/app/manager/actions";
import { listActiveBranches } from "@/lib/data/branches";
import { getManagerStaffProfile } from "@/lib/data/manager";

const inputClass =
  "rounded-md border border-line bg-cream px-4 py-3 focus:border-matcha-deep focus:outline-none focus:shadow-focus";

export default async function EditStaffPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [staff, branches] = await Promise.all([getManagerStaffProfile(id), listActiveBranches()]);
  if (!staff) notFound();

  return (
    <div className="space-y-7">
        <SectionTitle title="Edit staff" />
        <DirtyForm mode="edit" action={updateStaff} className="grid max-w-2xl gap-4 rounded-lg border border-line-soft bg-cream p-6">
          <input type="hidden" name="id" value={staff.profile.id} />
          <TrackedInput name="name" required defaultValue={staff.profile.name} className={inputClass} />
          <TrackedInput name="email" required type="email" defaultValue={staff.profile.email} className={inputClass} />
          <TrackedSelect
            name="role"
            defaultValue={staff.detail.role}
            aria-label="Role"
            options={[
              { value: "cashier", label: "Cashier" },
              { value: "manager", label: "Manager" }
            ]}
          />
          <TrackedSelect
            name="branchId"
            defaultValue={staff.detail.branchId ?? ""}
            aria-label="Branch"
            options={[
              { value: "", label: "All branches / manager" },
              ...branches.map((branch) => ({ value: branch.id, label: branch.name }))
            ]}
          />
          <TrackedInput name="pin" inputMode="numeric" defaultValue="" placeholder="New cashier PIN; leave blank to keep current" className={inputClass} />
          <div className="flex justify-end gap-3">
            <Button href="/manager/staff" variant="secondary">Cancel</Button>
            <DirtySaveButton pendingLabel="Saving…">Save staff</DirtySaveButton>
          </div>
        </DirtyForm>
        <section className="grid max-w-2xl gap-4 rounded-lg border border-line-soft bg-cream p-6">
          <h2 className="font-sans text-[17px] font-bold leading-6 tracking-tight text-charcoal">
            Status
          </h2>
          <form action={setStaffActive}>
            <input type="hidden" name="id" value={staff.profile.id} />
            <input type="hidden" name="active" value={staff.profile.active ? "false" : "true"} />
            <Button type="submit" variant="secondary">
              {staff.profile.active ? "Deactivate staff" : "Reactivate staff"}
            </Button>
          </form>
        </section>
      </div>
  );
}
