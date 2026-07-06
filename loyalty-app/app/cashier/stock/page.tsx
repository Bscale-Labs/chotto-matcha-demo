import { ArrowLeft, Package } from "lucide-react";
import { Button } from "@/components/shared/button";
import { CashierShell } from "@/components/cashier/cashier-shell";
import { BranchStockTable } from "@/components/cashier/branch-stock-table";
import { Eyebrow } from "@/components/shared/eyebrow";
import { Pill } from "@/components/shared/pill";
import { requireCashierManagerSession } from "@/lib/auth/session";
import { listBranchRewardStock } from "@/lib/data/rewards";

export default async function CashierStockPage() {
  const { profile, branch } = await requireCashierManagerSession("/cashier/stock");
  const rewards = await listBranchRewardStock(branch.id);
  const availableCount = rewards.filter((reward) => reward.branchActive).length;

  return (
    <CashierShell sessionLabel={`${branch.name} · ${profile.name}`} mode="manager">
      <div className="mb-4">
        <Button href="/cashier" variant="tertiary" icon={ArrowLeft}>
          Back to cashier
        </Button>
      </div>
      <section className="cashier-panel rounded-lg p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow className="text-matcha-deep">Branch stock</Eyebrow>
            <h1 className="mt-3 font-display text-[40px] font-medium leading-[44px] text-charcoal">
              {branch.name}
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-ink-muted">
              Control this branch&apos;s reward availability and stock counts.
            </p>
          </div>
          <Pill icon={Package}>{availableCount} available</Pill>
        </div>
        <div className="mt-5">
          <BranchStockTable rewards={rewards} />
        </div>
      </section>
    </CashierShell>
  );
}
