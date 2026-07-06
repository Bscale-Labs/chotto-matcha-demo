import { redirect } from "next/navigation";
import { LockKeyhole } from "lucide-react";
import { unlockCashierManagerMode } from "@/app/cashier/actions";
import { Button } from "@/components/shared/button";
import { Brand } from "@/components/shared/brand";
import { Input } from "@/components/shared/input";
import { SubmitButton } from "@/components/shared/submit-button";
import { getCashierManagerUnlockCookie } from "@/lib/auth/cashier-manager";
import { requireCashierTerminalSession } from "@/lib/auth/session";

function safeCashierNext(value?: string) {
  if (
    !value ||
    (value !== "/cashier" && !value.startsWith("/cashier/")) ||
    value.startsWith("/cashier/login") ||
    value.startsWith("/cashier/logout") ||
    value.startsWith("/cashier/unlock")
  ) {
    return "/cashier/stock";
  }
  return value;
}

export default async function CashierUnlockPage({
  searchParams
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const [terminal, params] = await Promise.all([requireCashierTerminalSession(), searchParams]);
  const next = safeCashierNext(params.next);
  const unlock = await getCashierManagerUnlockCookie();
  if (unlock?.staffProfileId === terminal.profile.id && unlock.branchId === terminal.branch.id) redirect(next);

  return (
    <main className="cashier-surface min-h-screen py-12">
      <div className="mx-auto flex max-w-md flex-col gap-8 px-5">
        <div className="flex justify-center">
          <Brand href="/cashier" size="md" />
        </div>
        <section className="cashier-panel rounded-lg p-8">
          <p className="eyebrow text-matcha-deep">Manager mode</p>
          <h1 className="mt-3 font-display text-[28px] font-semibold leading-9 text-charcoal">
            Re-enter password.
          </h1>
          <p className="mt-2 text-sm leading-6 text-ink-muted">
            {terminal.branch.name} management is locked. Confirm {terminal.profile.name}&apos;s password to manage stock and accounts.
          </p>
          <form action={unlockCashierManagerMode} className="mt-6 grid gap-4">
            <input type="hidden" name="next" value={next} />
            <Input
              label="Password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              error={params.error === "invalid" ? "Password did not match this branch manager account." : undefined}
              leadingIcon={<LockKeyhole className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />}
            />
            <SubmitButton pendingLabel="Unlocking..." className="mt-2 w-full">
              Unlock manager mode
            </SubmitButton>
            <Button href="/cashier" variant="secondary" className="w-full">
              Back to cashier
            </Button>
          </form>
        </section>
      </div>
    </main>
  );
}
