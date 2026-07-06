import { CashierShell } from "@/components/cashier/cashier-shell";
import { Eyebrow } from "@/components/shared/eyebrow";
import { ScanFrame } from "@/components/cashier/cashier-visuals";
import { requireCashierShiftSession } from "@/lib/auth/session";

export default async function CashierIdentifyPage() {
  const { profile, branch } = await requireCashierShiftSession();

  return (
    <CashierShell sessionLabel={`${branch.name} · ${profile.name}`}>
      <section className="cashier-panel grid min-h-[620px] place-items-center rounded-lg p-8 text-center">
        <div className="w-full max-w-md">
          <Eyebrow className="text-matcha-deep">Scan member QR</Eyebrow>
          <ScanFrame className="mt-8" />
          <p className="mx-auto mt-6 max-w-xs text-sm leading-6 text-ink-muted">
            Position the member QR code inside the frame.
          </p>
        </div>
      </section>
    </CashierShell>
  );
}
