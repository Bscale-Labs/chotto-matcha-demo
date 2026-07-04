import { notFound } from "next/navigation";
import { SectionTitle } from "@/components/shared/section-title";
import { Button } from "@/components/shared/button";
import { ToastActionForm } from "@/components/shared/toast-action-form";
import { adjustCustomerPoints, setCustomerActive, updateCustomer } from "@/app/manager/actions";
import { getCustomerById } from "@/lib/data/customers";

export default async function EditCustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const customer = await getCustomerById(id);
  if (!customer) notFound();

  return (
    <div className="space-y-7">
        <SectionTitle title="Edit customer" />
        <form action={updateCustomer} className="grid max-w-2xl gap-4 rounded-lg border border-line-soft bg-cream p-6">
          <input type="hidden" name="id" value={customer.id} />
          <input name="name" required defaultValue={customer.name} className="rounded-md border border-line bg-cream px-4 py-3 focus:border-matcha-deep focus:outline-none focus:shadow-focus" />
          <input name="email" required type="email" defaultValue={customer.email} className="rounded-md border border-line bg-cream px-4 py-3 focus:border-matcha-deep focus:outline-none focus:shadow-focus" />
          <input name="phone" required type="tel" defaultValue={customer.phone} className="rounded-md border border-line bg-cream px-4 py-3 focus:border-matcha-deep focus:outline-none focus:shadow-focus" />
          <div className="flex justify-end gap-3">
            <Button href="/manager/customers" variant="secondary">Cancel</Button>
            <Button type="submit">Save customer</Button>
          </div>
        </form>
        <section className="grid max-w-2xl gap-4 rounded-lg border border-line-soft bg-cream p-6">
          <h2 className="font-sans text-[17px] font-bold leading-6 tracking-tight text-charcoal">
            Points
          </h2>
          <ToastActionForm
            action={adjustCustomerPoints}
            successTitle="Points adjusted"
            successMessage="The member balance and ledger were updated."
            errorTitle="Could not adjust points"
            className="grid gap-3 sm:grid-cols-[120px_1fr_auto]"
          >
            <input type="hidden" name="id" value={customer.id} />
            <input
              name="pointsDelta"
              type="number"
              className="rounded-md border border-line bg-cream px-4 py-3 focus:border-matcha-deep focus:outline-none"
              placeholder="±"
              aria-label="Points delta"
            />
            <input
              name="reason"
              className="rounded-md border border-line bg-cream px-4 py-3 focus:border-matcha-deep focus:outline-none"
              placeholder="Reason"
              aria-label="Reason"
            />
            <Button type="submit">Apply</Button>
          </ToastActionForm>
        </section>
        <section className="grid max-w-2xl gap-4 rounded-lg border border-line-soft bg-cream p-6">
          <h2 className="font-sans text-[17px] font-bold leading-6 tracking-tight text-charcoal">
            Status
          </h2>
          <form action={setCustomerActive}>
            <input type="hidden" name="id" value={customer.id} />
            <input type="hidden" name="active" value={customer.active ? "false" : "true"} />
            <Button type="submit" variant="secondary">
              {customer.active ? "Deactivate member" : "Reactivate member"}
            </Button>
          </form>
        </section>
      </div>
  );
}
