import { Medal } from "lucide-react";
import { RewardTiersEditor } from "@/components/manager/reward-tiers-editor";
import { SectionTitle } from "@/components/shared/section-title";
import { listConfiguredRewardTiers } from "@/lib/data/reward-tiers";

export default async function ManagerRewardTiersPage() {
  const rewardTiers = await listConfiguredRewardTiers();
  const initialTiers = rewardTiers.map((tier) => ({
    id: tier.id,
    name: tier.name,
    min: tier.min,
    vibe: tier.vibe
  }));

  return (
    <div className="space-y-7">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionTitle title="Reward Tiers" />
        <div className="inline-flex items-center gap-2 rounded-pill border border-line-soft bg-cream px-3 py-1.5 text-sm font-medium text-matcha-deep">
          <Medal className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
          Points based
        </div>
      </div>

      <RewardTiersEditor initialTiers={initialTiers} />
    </div>
  );
}
