import { Plus } from "lucide-react";
import { ManagerShell } from "@/components/manager/manager-shell";
import { ActionLink } from "@/components/shared/action-link";
import { DataTable } from "@/components/shared/table";
import { SectionTitle } from "@/components/shared/section-title";
import { rewards } from "@/lib/mock-data";
import { formatPoints } from "@/lib/formatters";

export default function ManagerRewardsPage() {
  return (
    <ManagerShell>
      <div className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <SectionTitle eyebrow="Catalog" title="Rewards" />
          <ActionLink href="/manager/rewards" icon={Plus}>Create reward</ActionLink>
        </div>
        <DataTable
          headers={["Reward", "Type", "Cost", "Stock", "Status"]}
          rows={rewards.map((reward) => [
            reward.name,
            <span key={`${reward.id}-type`} className="capitalize">{reward.type}</span>,
            `${formatPoints(reward.pointCost)} pts`,
            reward.stockCount === null ? "Unlimited" : reward.stockCount,
            reward.active ? "Active" : "Archived"
          ])}
        />
      </div>
    </ManagerShell>
  );
}
