import { Brand } from "@/components/shared/brand";

export default function ManagerAccessDeniedPage() {
  return (
    <main className="min-h-screen bg-cream py-12">
      <div className="mx-auto flex max-w-md flex-col gap-8 px-5">
        <div className="flex justify-center">
          <Brand href="/" size="md" />
        </div>
        <section className="rounded-lg border border-line-soft bg-cream p-8 shadow-sm">
          <p className="eyebrow text-matcha-deep">Hold on</p>
          <h1 className="mt-3 font-display text-[28px] font-semibold leading-9 text-charcoal">
            No manager profile yet.
          </h1>
          <p className="mt-3 text-sm leading-6 text-ink-muted">
            You&apos;re signed in, but no active manager is linked to this account. Ask a current
            manager to grant access, or sign out and try a different account.
          </p>
          <form action="/manager/logout" method="post" className="mt-6">
            <button
              type="submit"
              className="inline-flex min-h-tap items-center gap-2 rounded-pill border border-line bg-cream px-4 text-sm font-medium text-charcoal transition-colors duration-fast ease-out-soft hover:border-matcha-deep hover:text-matcha-deep"
            >
              Sign out
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
