import { notFound } from "next/navigation";
import { SectionTitle } from "@/components/shared/section-title";
import { CashierShell } from "@/components/cashier/cashier-shell";
import {
  BranchStaffEditFields,
  BranchStaffStatusToggle
} from "@/components/cashier/branch-crud-forms";
import { updateBranchStaffAccount } from "@/app/cashier/actions";
import { requireCashierManagerPageSession } from "@/lib/auth/session";
import { getBranchStaffAccount } from "@/lib/data/staff";
import { isBranchShiftRole } from "@/lib/roles/staff";

export default async function EditBranchAccountPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { profile, branch } = await requireCashierManagerPageSession(`/cashier/accounts/${id}/edit`);
  const staff = await getBranchStaffAccount(id, branch.id);
  if (!staff || !isBranchShiftRole(staff.detail.role)) notFound();

  return (
    <CashierShell sessionLabel={`${branch.name} · ${profile.name}`} mode="manager">
      <div className="space-y-7">
        <SectionTitle title="Edit account" />
        <BranchStaffEditFields
          action={updateBranchStaffAccount}
          staff={{
            id: staff.profile.id,
            name: staff.profile.name,
            email: staff.profile.email,
            role: staff.detail.role
          }}
        />
        <section className="surface-paper grid max-w-2xl gap-4 rounded-lg p-6">
          <BranchStaffStatusToggle staffProfileId={staff.profile.id} initialActive={staff.profile.active} />
        </section>
      </div>
    </CashierShell>
  );
}
