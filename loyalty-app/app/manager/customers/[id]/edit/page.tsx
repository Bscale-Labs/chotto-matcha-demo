import { notFound } from "next/navigation";
import { ManagerShell } from "@/components/manager/manager-shell";
import { SectionTitle } from "@/components/shared/section-title";
import { Button } from "@/components/shared/button";
import { updateCustomer } from "@/app/manager/actions";
import { getCustomerById } from "@/lib/data/customers";

export default async function EditCustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const customer = await getCustomerById(id);
  if (!customer) notFound();

  return (
    <ManagerShell>
      <div className="space-y-7">
        <SectionTitle eyebrow="Community" title="Edit customer" />
        <form action={updateCustomer} className="grid max-w-2xl gap-4 rounded-lg border border-line-soft bg-cream p-6">
          <input type="hidden" name="id" value={customer.id} />
          <input name="name" required defaultValue={customer.name} className="rounded-md border border-line bg-cream px-4 py-3 focus:border-matcha-deep focus:outline-none focus:shadow-focus" />
          <input name="email" required type="email" defaultValue={customer.email} className="rounded-md border border-line bg-cream px-4 py-3 focus:border-matcha-deep focus:outline-none focus:shadow-focus" />
          <input name="phone" required type="tel" defaultValue={customer.phone} className="rounded-md border border-line bg-cream px-4 py-3 focus:border-matcha-deep focus:outline-none focus:shadow-focus" />
          <div className="flex gap-3">
            <Button type="submit">Save customer</Button>
            <Button href="/manager/customers" variant="secondary">Cancel</Button>
          </div>
        </form>
      </div>
    </ManagerShell>
  );
}
