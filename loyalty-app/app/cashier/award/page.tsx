import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { Button } from "@/components/shared/button";
import { Eyebrow } from "@/components/shared/eyebrow";
import { CashierShell } from "@/components/cashier/cashier-shell";
import { AwardPointsForm } from "@/components/cashier/award-points-form";
import { requireCashierShiftSession } from "@/lib/auth/session";
import { getCustomerById } from "@/lib/data/customers";
import { getEarnRate } from "@/lib/data/org-config";

export default async function CashierAwardPage({
  searchParams
}: {
  searchParams: Promise<{ customerId?: string; bill?: string }>;
}) {
  const { profile, branch } = await requireCashierShiftSession();
  const { customerId, bill } = await searchParams;
  if (!customerId) notFound();
  const [customer, earnRate] = await Promise.all([getCustomerById(customerId), getEarnRate()]);
  if (!customer?.active) notFound();

  return (
    <CashierShell sessionLabel={`${branch.name} · ${profile.name}`}>
      <div className="mb-4">
        <Button href={`/cashier/customer/${customer.id}`} variant="tertiary" icon={ArrowLeft}>
          Back to member
        </Button>
      </div>
      <section className="cashier-panel rounded-lg p-6">
        <Eyebrow className="text-matcha-deep">Award points</Eyebrow>
        <h1 className="mt-3 font-display text-[40px] font-medium leading-[44px] text-charcoal">
          {customer.name}
        </h1>
        <AwardPointsForm customerId={customer.id} earnRate={earnRate} showBillError={bill === "invalid"} />
      </section>
    </CashierShell>
  );
}
