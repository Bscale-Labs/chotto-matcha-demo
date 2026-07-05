import Link from "next/link";
import { redirect } from "next/navigation";
import { Brand } from "@/components/shared/brand";
import { EmailLoginForm } from "@/components/auth/email-login-form";
import { getSession } from "@/lib/auth/session";

export default async function CustomerLoginPage({
  searchParams
}: {
  searchParams: Promise<{ created?: string; emailFailed?: string }>;
}) {
  const session = await getSession();
  if (session) redirect("/customer");
  const { created, emailFailed } = await searchParams;

  return (
    <main className="min-h-screen bg-cream py-12">
      <div className="mx-auto flex max-w-md flex-col gap-8 px-5">
        <div className="flex justify-center">
          <Brand href="/" size="md" />
        </div>
        <section className="surface-paper rounded-lg p-8">
          <p className="eyebrow text-matcha-deep">Member</p>
          <h1 className="mt-3 font-display text-[28px] font-semibold leading-9 text-charcoal">
            Sign in to your points.
          </h1>
          {created ? (
            <p className="mt-2 text-sm text-matcha-deep">
              Account created. {emailFailed ? "Send yourself a fresh sign-in link." : "Check your email for a sign-in link."}
            </p>
          ) : null}
          <div className="mt-6">
            <EmailLoginForm callbackURL="/customer" placeholder="lia@example.com" />
          </div>
          <p className="mt-5 text-sm text-ink-muted">
            New here?{" "}
            <Link href="/customer/signup" className="font-medium text-matcha-deep">
              Create an account
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
