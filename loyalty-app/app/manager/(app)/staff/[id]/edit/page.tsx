import { notFound } from "next/navigation";
import { SectionTitle } from "@/components/shared/section-title";
import { Button } from "@/components/shared/button";
import {
  DirtyForm,
  DirtySaveButton,
  TrackedInput,
  TrackedPinInput,
  TrackedSelect
} from "@/components/shared/dirty-form";
import { StaffStatusToggle } from "@/components/manager/staff-edit-controls";
import { updateStaff } from "@/app/manager/actions";
import { listActiveBranches } from "@/lib/data/branches";
import { getManagerStaffProfile } from "@/lib/data/manager";

const inputClass =
  "rounded-md border border-line bg-cream px-4 py-3 focus:border-matcha-deep focus:outline-none focus:shadow-focus";
const lockedInputClass =
  "cursor-not-allowed rounded-md border border-line bg-stone px-4 py-3 text-ink-muted focus:outline-none";

export default async function EditStaffPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [staff, branches] = await Promise.all([getManagerStaffProfile(id), listActiveBranches()]);
  if (!staff) notFound();

  return (
    <div className="space-y-7">
      <SectionTitle title="Edit staff" />
      <DirtyForm mode="edit" action={updateStaff} className="surface-paper grid max-w-2xl gap-4 rounded-lg p-6">
        <input type="hidden" name="id" value={staff.profile.id} />
        <label htmlFor="staff-name" className="grid gap-2 text-sm font-medium text-charcoal">
          Name
          <TrackedInput id="staff-name" name="name" required defaultValue={staff.profile.name} className={inputClass} />
        </label>
        <label htmlFor="staff-email" className="grid gap-2 text-sm font-medium text-charcoal">
          Email
          <TrackedInput
            id="staff-email"
            name="email"
            required
            readOnly
            type="email"
            defaultValue={staff.profile.email}
            className={lockedInputClass}
            aria-describedby="staff-email-lock"
          />
          <span id="staff-email-lock" className="text-xs font-normal text-ink-muted">
            Bound to this staff member&apos;s login.
          </span>
        </label>
        <label htmlFor="staff-role" className="grid gap-2 text-sm font-medium text-charcoal">
          Role
          <TrackedSelect
            id="staff-role"
            name="role"
            defaultValue={staff.detail.role}
            options={[
              { value: "cashier", label: "Cashier" },
              { value: "branch_manager", label: "Branch Manager" },
              { value: "manager", label: "Manager" }
            ]}
          />
        </label>
        <label htmlFor="staff-branch" className="grid gap-2 text-sm font-medium text-charcoal">
          Branch
          <TrackedSelect
            id="staff-branch"
            name="branchId"
            defaultValue={staff.detail.branchId ?? ""}
            options={[
              { value: "", label: "All branches / global manager" },
              ...branches.map((branch) => ({ value: branch.id, label: branch.name }))
            ]}
          />
        </label>
        <TrackedPinInput
          id="staff-pin"
          name="pin"
          label="Cashier / branch manager PIN"
          hint="Enter exactly 4 digits. Leave empty to keep current."
        />
        <div className="flex justify-end gap-3">
          <Button href="/manager/staff" variant="secondary">Cancel</Button>
          <DirtySaveButton pendingLabel="Saving…">Save staff</DirtySaveButton>
        </div>
      </DirtyForm>
      <section className="surface-paper grid max-w-2xl gap-4 rounded-lg p-6">
        <StaffStatusToggle staffProfileId={staff.profile.id} initialActive={staff.profile.active} />
      </section>
    </div>
  );
}
