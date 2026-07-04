import { ManagerShell } from "@/components/manager/manager-shell";
import { SectionTitle } from "@/components/shared/section-title";
import { CustomerCreateForm } from "@/components/manager/customer-create-form";

export default function NewCustomerPage() {
  return (
    <ManagerShell>
      <div className="space-y-7">
        <SectionTitle title="Add customer" />
        <section className="max-w-2xl rounded-lg border border-line-soft bg-cream p-6">
          <CustomerCreateForm />
        </section>
      </div>
    </ManagerShell>
  );
}
