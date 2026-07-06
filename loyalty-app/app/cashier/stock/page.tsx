import { CashierShell } from "@/components/cashier/cashier-shell";
import { BranchStockTable } from "@/components/cashier/branch-stock-table";
import { SectionTitle } from "@/components/shared/section-title";
import { requireCashierManagerPageSession } from "@/lib/auth/session";
import { listBranchRewardStock } from "@/lib/data/rewards";

export default async function CashierStockPage() {
  const { profile, branch } = await requireCashierManagerPageSession("/cashier/stock");
  const rewards = await listBranchRewardStock(branch.id);

  return (
    <CashierShell sessionLabel={`${branch.name} · ${profile.name}`} mode="manager">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionTitle title="Stock" />
      </div>

      <section className="cashier-panel mt-4 rounded-lg p-5">
        <BranchStockTable rewards={rewards} />
      </section>
    </CashierShell>
  );
}
