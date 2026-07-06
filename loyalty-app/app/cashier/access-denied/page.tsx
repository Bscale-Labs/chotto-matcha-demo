import { Brand } from "@/components/shared/brand";
import { Button } from "@/components/shared/button";

export default function CashierAccessDeniedPage() {
  return (
    <main className="cashier-surface min-h-screen py-12">
      <div className="mx-auto flex max-w-md flex-col gap-8 px-5">
        <div className="flex justify-center">
          <Brand href="/" size="md" />
        </div>
        <section className="cashier-panel rounded-lg p-8">
          <p className="eyebrow text-matcha-deep">Hold on</p>
          <h1 className="mt-3 font-display text-[28px] font-semibold leading-9 text-charcoal">
            Branch manager access required.
          </h1>
          <p className="mt-3 text-sm leading-6 text-ink-muted">
            This account is signed in, but it is not an active branch manager account with an assigned branch.
          </p>
          <form action="/cashier/logout" method="post" className="mt-6">
            <Button type="submit" variant="secondary">
              Sign in with another account
            </Button>
          </form>
        </section>
      </div>
    </main>
  );
}
