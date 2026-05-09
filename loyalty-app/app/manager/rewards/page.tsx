import { Plus } from "lucide-react";
import { Button } from "@/components/shared/button";
import { ManagerShell } from "@/components/manager/manager-shell";
import { DataTable } from "@/components/shared/table";
import { SectionTitle } from "@/components/shared/section-title";
import { Pill } from "@/components/shared/pill";
import { rewards } from "@/lib/mock-data";
import { formatPoints } from "@/lib/formatters";

export default function ManagerRewardsPage() {
  return (
    <ManagerShell>
      <div className="space-y-7">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionTitle eyebrow="Catalog" title="Rewards" />
          <Button href="/manager/rewards" icon={Plus}>
            Add reward
          </Button>
        </div>
        <DataTable
          headers={["Reward", "Type", "Cost", "Stock", "Status"]}
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
            </Pill>
          ])}
        />
      </div>
    </ManagerShell>
  );
}
