import { Plus } from "lucide-react";
import { Button } from "@/components/shared/button";
import { ManagerShell } from "@/components/manager/manager-shell";
import { DataTable } from "@/components/shared/table";
import { SectionTitle } from "@/components/shared/section-title";
import { Pill } from "@/components/shared/pill";
import { adjustRewardStock, setRewardActive } from "@/app/manager/actions";
import { listRewards } from "@/lib/data/rewards";
import { formatPoints } from "@/lib/formatters";

export default async function ManagerRewardsPage() {
  const rewards = await listRewards();

  return (
    <ManagerShell>
      <div className="space-y-7">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionTitle eyebrow="Catalog" title="Rewards" />
          <Button href="/manager/rewards/new" icon={Plus}>
            Add reward
          </Button>
        </div>
        <DataTable
          headers={["Reward", "Type", "Cost", "Stock", "Status", "Stock adjust", "Actions"]}
          rows={rewards.map((reward) => [
            <span key={`${reward.id}-name`} className="font-medium text-charcoal">
              {reward.name}
            </span>,
            <span key={`${reward.id}-type`} className="capitalize text-sm text-ink-muted">
              {reward.type}
            </span>,
            <span key={`${reward.id}-cost`} className="counter text-sm text-charcoal">
              {formatPoints(reward.pointCost)}
            </span>,
            <span key={`${reward.id}-stock`} className="text-sm text-ink-muted">
              {reward.stockCount === null ? "Always available" : `${reward.stockCount} left`}
            </span>,
            <Pill
              key={`${reward.id}-status`}
              tone={reward.active ? "default" : "muted"}
            >
              {reward.active ? "Active" : "Resting"}
            </Pill>,
            <form
              key={`${reward.id}-stock-adjust`}
              action={adjustRewardStock}
              className="flex items-center gap-1.5"
            >
              <input type="hidden" name="id" value={reward.id} />
              <input
                name="delta"
                type="number"
                className="h-9 w-16 rounded-md border border-line bg-cream px-2 text-sm focus:border-matcha-deep focus:outline-none"
                placeholder="±"
                aria-label="Stock delta"
              />
              <button className="h-9 rounded-md border border-line bg-cream px-3 text-xs font-medium text-charcoal transition-colors duration-fast ease-out-soft hover:border-matcha-deep hover:text-matcha-deep">
                Apply
              </button>
            </form>,
            <div key={`${reward.id}-actions`} className="flex items-center gap-1.5">
              <Button href={`/manager/rewards/${reward.id}/edit`} variant="tertiary">
                Edit
              </Button>
              <form action={setRewardActive}>
                <input type="hidden" name="id" value={reward.id} />
                <input type="hidden" name="active" value={reward.active ? "false" : "true"} />
                <button className="h-9 rounded-md border border-line bg-cream px-3 text-xs font-medium text-charcoal transition-colors duration-fast ease-out-soft hover:border-matcha-deep hover:text-matcha-deep">
                  {reward.active ? "Archive" : "Restore"}
                </button>
              </form>
            </div>
          ])}
        />
      </div>
    </ManagerShell>
  );
}
