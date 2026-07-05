import { redirect } from "next/navigation";
import { Brand } from "@/components/shared/brand";
import { ManagerLoginForm } from "@/components/manager/manager-login-form";
import { getSession } from "@/lib/auth/session";

export default async function ManagerLoginPage() {
  const session = await getSession();
  if (session) redirect("/manager");

  return (
    <main className="min-h-screen bg-cream py-12">
      <div className="mx-auto flex max-w-md flex-col gap-8 px-5">
        <div className="flex justify-center">
          <Brand href="/" size="md" />
        </div>
        <section className="surface-paper rounded-lg p-8">
          <p className="eyebrow text-matcha-deep">Admin</p>
          <h1 className="mt-3 font-display text-[28px] font-semibold leading-9 text-charcoal">
            Welcome back.
          </h1>
          <p className="mt-2 text-sm leading-6 text-ink-muted">
            Sign in to tend the catalog, branches, and ledger.
          </p>
          <div className="mt-6">
            <ManagerLoginForm />
          </div>
        </section>
      </div>
    </main>
  );
}
