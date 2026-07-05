import { Brand } from "@/components/shared/brand";

export default function CustomerAccessDeniedPage() {
  return (
    <main className="min-h-screen bg-cream py-12">
      <div className="mx-auto flex max-w-md flex-col gap-8 px-5">
        <div className="flex justify-center">
          <Brand href="/" size="md" />
        </div>
        <section className="surface-paper rounded-lg p-8">
          <p className="eyebrow text-matcha-deep">Hold on</p>
          <h1 className="mt-3 font-display text-[28px] font-semibold leading-9 text-charcoal">
            No active member profile.
          </h1>
          <p className="mt-3 text-sm leading-6 text-ink-muted">
            This account is signed in, but it is not linked to an active customer profile.
          </p>
        </section>
      </div>
    </main>
  );
}
