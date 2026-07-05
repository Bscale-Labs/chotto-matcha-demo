import { notFound } from "next/navigation";
import { SectionTitle } from "@/components/shared/section-title";
import { Button } from "@/components/shared/button";
import {
  DirtyForm,
  DirtySaveButton,
  TrackedInput
} from "@/components/shared/dirty-form";
import { CustomerPointsAdjuster, CustomerStatusToggle } from "@/components/manager/customer-edit-controls";
import { updateCustomer } from "@/app/manager/actions";
import { getCustomerById } from "@/lib/data/customers";

const inputClass =
  "rounded-md border border-line bg-cream px-4 py-3 focus:border-matcha-deep focus:outline-none focus:shadow-focus";
const lockedInputClass =
  "cursor-not-allowed rounded-md border border-line bg-stone px-4 py-3 text-ink-muted focus:outline-none";

export default async function EditCustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const customer = await getCustomerById(id);
  if (!customer) notFound();

  return (
    <div className="space-y-7">
        <SectionTitle title="Edit customer" />
        <DirtyForm mode="edit" action={updateCustomer} className="surface-paper grid max-w-2xl gap-4 rounded-lg p-6">
          <input type="hidden" name="id" value={customer.id} />
          <label htmlFor="customer-name" className="grid gap-2 text-sm font-medium text-charcoal">
            Name
            <TrackedInput id="customer-name" name="name" required defaultValue={customer.name} className={inputClass} />
          </label>
          <label htmlFor="customer-code" className="grid gap-2 text-sm font-medium text-charcoal">
            Customer code
            <TrackedInput
              id="customer-code"
              name="code"
              readOnly
              defaultValue={customer.code}
              className={lockedInputClass}
              aria-describedby="customer-code-lock"
            />
            <span id="customer-code-lock" className="text-xs font-normal text-ink-muted">
              Used for QR lookup and transaction search.
            </span>
          </label>
          <label htmlFor="customer-email" className="grid gap-2 text-sm font-medium text-charcoal">
            Email
            <TrackedInput
              id="customer-email"
              name="email"
              required
              readOnly
              type="email"
              defaultValue={customer.email}
              className={lockedInputClass}
              aria-describedby="customer-email-lock"
            />
            <span id="customer-email-lock" className="text-xs font-normal text-ink-muted">
              Bound to this member&apos;s login.
            </span>
          </label>
          <label htmlFor="customer-phone" className="grid gap-2 text-sm font-medium text-charcoal">
            Phone number
            <TrackedInput id="customer-phone" name="phone" required type="tel" defaultValue={customer.phone} className={inputClass} />
          </label>
          <div className="flex justify-end gap-3">
            <Button href="/manager/customers" variant="secondary">Cancel</Button>
            <DirtySaveButton pendingLabel="Saving…">Save customer</DirtySaveButton>
          </div>
        </DirtyForm>
        <section className="surface-paper grid max-w-2xl gap-4 rounded-lg p-6">
          <h2 className="font-sans text-[17px] font-bold leading-6 tracking-tight text-charcoal">
            Points
          </h2>
          <CustomerPointsAdjuster customerId={customer.id} />
        </section>
        <section className="surface-paper grid max-w-2xl gap-4 rounded-lg p-6">
          <CustomerStatusToggle customerId={customer.id} initialActive={customer.active} />
        </section>
      </div>
  );
}
