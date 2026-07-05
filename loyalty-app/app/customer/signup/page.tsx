import Link from "next/link";
import { redirect } from "next/navigation";
import { Brand } from "@/components/shared/brand";
import { CustomerSignupForm } from "@/components/customer/customer-signup-form";
import { getSession } from "@/lib/auth/session";

export default async function CustomerSignupPage() {
  const session = await getSession();
  if (session) redirect("/customer");

  return (
    <main className="min-h-screen bg-cream py-12">
      <div className="mx-auto flex max-w-md flex-col gap-8 px-5">
        <div className="flex justify-center">
          <Brand href="/" size="md" />
        </div>
        <section className="surface-paper rounded-lg p-8">
          <p className="eyebrow text-matcha-deep">Member</p>
          <h1 className="mt-3 font-display text-[28px] font-semibold leading-9 text-charcoal">
            Create your account.
          </h1>
          <div className="mt-6">
            <CustomerSignupForm />
          </div>
          <p className="mt-5 text-sm text-ink-muted">
            Already have an account?{" "}
            <Link href="/customer/login" className="font-medium text-matcha-deep">
              Sign in
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
