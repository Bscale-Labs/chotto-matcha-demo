import { SectionTitle } from "@/components/shared/section-title";
import { CashierShell } from "@/components/cashier/cashier-shell";
import { BranchCustomerCreateForm } from "@/components/cashier/branch-crud-forms";
import { requireCashierManagerPageSession } from "@/lib/auth/session";

export default async function NewCashierCustomerPage() {
  const { profile, branch } = await requireCashierManagerPageSession("/cashier/customers/new");

  return (
    <CashierShell sessionLabel={`${branch.name} · ${profile.name}`} mode="manager">
      <div className="space-y-7">
        <SectionTitle title="Add customer" />
        <section className="surface-paper max-w-2xl rounded-lg p-6">
          <BranchCustomerCreateForm />
        </section>
      </div>
    </CashierShell>
  );
}
