import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { CustomerShell } from "@/components/customer/customer-shell";
import { ProfileEditForm } from "@/components/customer/profile-edit-form";
import { requireCustomerSession } from "@/lib/auth/session";

export default async function CustomerProfileEditPage() {
  const { customer } = await requireCustomerSession();

  return (
    <CustomerShell>
      <Link
        href="/customer/profile"
        className="inline-flex min-h-tap items-center gap-1 text-sm font-medium text-matcha-deep transition-colors duration-fast ease-out-soft hover:text-forest"
      >
        <ChevronLeft className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
        Profile
      </Link>

      <section className="mt-3">
        <h1 className="font-display text-[40px] font-medium leading-[44px] text-charcoal">
          Edit Profile
        </h1>
      </section>

      <section className="surface-paper mt-5 rounded-xl p-5">
        <ProfileEditForm
          defaultName={customer.name}
          defaultPhone={customer.phone}
          email={customer.email}
        />
      </section>
    </CustomerShell>
  );
}
