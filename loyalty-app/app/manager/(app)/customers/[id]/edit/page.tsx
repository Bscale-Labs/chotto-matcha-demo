import { notFound } from "next/navigation";
import { SectionTitle } from "@/components/shared/section-title";
import { Button } from "@/components/shared/button";
import {
  DirtyForm,
  DirtySaveButton,
  TrackedInput
} from "@/components/shared/dirty-form";
import { ToastActionForm } from "@/components/shared/toast-action-form";
import { adjustCustomerPoints, setCustomerActive, updateCustomer } from "@/app/manager/actions";
import { getCustomerById } from "@/lib/data/customers";

const inputClass =
  "rounded-md border border-line bg-cream px-4 py-3 focus:border-matcha-deep focus:outline-none focus:shadow-focus";

export default async function EditCustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const customer = await getCustomerById(id);
  if (!customer) notFound();

  return (
    <div className="space-y-7">
        <SectionTitle title="Edit customer" />
        <DirtyForm mode="edit" action={updateCustomer} className="surface-paper grid max-w-2xl gap-4 rounded-lg p-6">
          <input type="hidden" name="id" value={customer.id} />
          <TrackedInput name="name" required defaultValue={customer.name} className={inputClass} />
          <TrackedInput name="email" required type="email" defaultValue={customer.email} className={inputClass} />
          <TrackedInput name="phone" required type="tel" defaultValue={customer.phone} className={inputClass} />
          <div className="flex justify-end gap-3">
            <Button href="/manager/customers" variant="secondary">Cancel</Button>
            <DirtySaveButton pendingLabel="Saving…">Save customer</DirtySaveButton>
          </div>
        </DirtyForm>
        <section className="surface-paper grid max-w-2xl gap-4 rounded-lg p-6">
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
              className="rounded-md border border-line bg-cream px-4 py-3 focus:border-matcha-deep focus:outline-none focus:shadow-focus"
              placeholder="±"
              aria-label="Points delta"
            />
            <input
              name="reason"
              className="rounded-md border border-line bg-cream px-4 py-3 focus:border-matcha-deep focus:outline-none focus:shadow-focus"
              placeholder="Reason"
              aria-label="Reason"
            />
            <Button type="submit">Apply</Button>
          </ToastActionForm>
        </section>
        <section className="surface-paper grid max-w-2xl gap-4 rounded-lg p-6">
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
