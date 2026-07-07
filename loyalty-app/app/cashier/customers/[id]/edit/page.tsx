import { notFound } from "next/navigation";
import { SectionTitle } from "@/components/shared/section-title";
import { CashierShell } from "@/components/cashier/cashier-shell";
import {
  BranchCustomerEditFields,
  BranchCustomerPointsAdjuster,
  BranchCustomerStatusToggle
} from "@/components/cashier/branch-crud-forms";
import { updateBranchCustomer } from "@/app/cashier/actions";
import { requireCashierManagerPageSession } from "@/lib/auth/session";
import { getCustomerById } from "@/lib/data/customers";

export default async function EditCashierCustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { profile, branch } = await requireCashierManagerPageSession(`/cashier/customers/${id}/edit`);
  const customer = await getCustomerById(id);
  if (!customer) notFound();

  return (
    <CashierShell sessionLabel={`${branch.name} · ${profile.name}`} mode="manager">
      <div className="space-y-7">
        <SectionTitle title="Edit customer" />
        <BranchCustomerEditFields
          action={updateBranchCustomer}
          customer={{
            id: customer.id,
            name: customer.name,
            code: customer.code,
            email: customer.email,
            phone: customer.phone
          }}
        />
        <section className="surface-paper grid max-w-2xl gap-4 rounded-lg p-6">
          <h2 className="font-sans text-[17px] font-bold leading-6 tracking-tight text-charcoal">
            Points
          </h2>
          <BranchCustomerPointsAdjuster customerId={customer.id} />
        </section>
        <section className="surface-paper grid max-w-2xl gap-4 rounded-lg p-6">
          <BranchCustomerStatusToggle customerId={customer.id} initialActive={customer.active} />
        </section>
      </div>
    </CashierShell>
  );
}
