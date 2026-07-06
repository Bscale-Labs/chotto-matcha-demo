import { redirect } from "next/navigation";
import { Brand } from "@/components/shared/brand";
import { EmailLoginForm } from "@/components/auth/email-login-form";
import { getSession } from "@/lib/auth/session";

export default async function CashierLoginPage() {
  const session = await getSession();
  if (session) redirect("/cashier");

  return (
    <main className="cashier-surface min-h-screen py-12">
      <div className="mx-auto flex max-w-md flex-col gap-8 px-5">
        <div className="flex justify-center">
          <Brand href="/" size="md" />
        </div>
        <section className="cashier-panel rounded-lg p-8">
          <p className="eyebrow text-matcha-deep">Branch terminal</p>
          <h1 className="mt-3 font-display text-[28px] font-semibold leading-9 text-charcoal">
            Branch manager sign in.
          </h1>
          <p className="mt-2 text-sm leading-6 text-ink-muted">
            Unlock this cashier terminal for your assigned branch before staff start PIN shifts.
          </p>
          <div className="mt-6">
            <EmailLoginForm callbackURL="/cashier" placeholder="manager@chottomatcha.ph" authRole="branch_manager" />
          </div>
        </section>
      </div>
    </main>
  );
}
