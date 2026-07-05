import { Plus } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/shared/button";
import { DataTable } from "@/components/shared/table";
import { SectionTitle } from "@/components/shared/section-title";
import { Pill } from "@/components/shared/pill";
import { Tooltip } from "@/components/shared/tooltip";
import { listBranches } from "@/lib/data/branches";
import { listRewardsForManager } from "@/lib/data/rewards";
import { formatPoints } from "@/lib/formatters";

function AvailableBranches({
  count,
  branchNames
}: {
  count: number;
  branchNames: string[];
}) {
  const label = count === 1 ? "1 branch in stock" : `${count} branches in stock`;
  const tooltip = branchNames.length > 0
    ? branchNames.join(", ")
    : "No branches available";

  return (
    <Tooltip label={tooltip} align="start" contentClassName="whitespace-normal">
      <span className="text-sm text-ink-muted">
        {count > 0 ? label : "No stock"}
      </span>
    </Tooltip>
  );
}

export default async function ManagerRewardsPage({
  searchParams
}: {
  searchParams: Promise<{ branchId?: string; changed?: string }>;
}) {
  const { branchId, changed } = await searchParams;
  const branches = await listBranches();
  const selectedBranch = branches.find((branch) => branch.id === branchId);
  const rewards = await listRewardsForManager(selectedBranch?.id);

  return (
    <div className="flex min-h-0 flex-col gap-5 lg:h-full">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionTitle title="Rewards" />
          <Button href="/manager/rewards/new" icon={Plus}>
            Add reward
          </Button>
        </div>
        <DataTable
          headers={
            selectedBranch
              ? ["Reward", "Type", "Cost", "Branch stock", "Branch status"]
              : ["Reward", "Type", "Cost", "Branches", "Status"]
          }
          rowHrefs={rewards.map((reward) =>
            selectedBranch
              ? `/manager/rewards/${reward.id}/edit?branchId=${selectedBranch.id}`
              : `/manager/rewards/${reward.id}/edit`
          )}
          rowKeys={rewards.map((reward) => reward.id)}
          highlightKey={changed}
          rows={rewards.map((reward) => [
            <div key={`${reward.id}-name`} className="flex items-center gap-3">
              {reward.imageUrl ? (
                <Image src={reward.imageUrl} alt="" width={40} height={40} className="h-10 w-10 rounded-md object-cover" />
              ) : null}
              <span className="font-medium text-charcoal">
                {reward.name}
              </span>
            </div>,
            <span key={`${reward.id}-type`} className="capitalize text-sm text-ink-muted">
              {reward.type}
            </span>,
            <span key={`${reward.id}-cost`} className="counter text-sm text-charcoal">
              {formatPoints(reward.pointCost)}
            </span>,
            <span key={`${reward.id}-stock`} className="text-sm text-ink-muted">
              {selectedBranch
                ? reward.branchId
                  ? reward.branchStockCount === null
                    ? "Always available"
                    : `${reward.branchStockCount} left`
                  : "Not allocated"
                : (
                  <AvailableBranches
                    count={reward.availableBranchCount ?? 0}
                    branchNames={reward.availableBranchNames}
                  />
                )}
            </span>,
            <Pill
              key={`${reward.id}-status`}
              tone={
                selectedBranch
                  ? reward.branchActive
                    ? "default"
                    : "muted"
                  : reward.active
                    ? "default"
                    : "muted"
              }
            >
              {selectedBranch
                ? reward.branchActive
                  ? "Available"
                  : "Resting"
                : reward.active
                  ? "Active"
                  : "Resting"}
            </Pill>
          ])}
        />
      </div>
  );
}
