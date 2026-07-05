import { Brand } from "@/components/shared/brand";
import { Button } from "@/components/shared/button";

export default function ManagerAccessDeniedPage() {
  return (
    <main className="min-h-screen bg-cream py-12">
      <div className="mx-auto flex max-w-md flex-col gap-8 px-5">
        <div className="flex justify-center">
          <Brand href="/" size="md" />
        </div>
        <section className="surface-paper rounded-lg p-8">
          <p className="eyebrow text-matcha-deep">Hold on</p>
          <h1 className="mt-3 font-display text-[28px] font-semibold leading-9 text-charcoal">
            No admin profile yet.
          </h1>
          <p className="mt-3 text-sm leading-6 text-ink-muted">
            You&apos;re signed in, but no active admin is linked to this account. Ask a current
            admin to grant access, or sign out and try a different account.
          </p>
          <form action="/manager/logout" method="post" className="mt-6">
            <Button type="submit" variant="secondary">
              Sign out
            </Button>
          </form>
        </section>
      </div>
    </main>
  );
}
