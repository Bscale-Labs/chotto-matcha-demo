import { RewardDetailsForm } from "@/components/manager/reward-details-form";
import { SectionTitle } from "@/components/shared/section-title";
import { listImageAssetsForManager } from "@/lib/data/assets";

export default async function NewRewardPage() {
  const assetPool = await listImageAssetsForManager();

  return (
    <div className="space-y-7">
        <SectionTitle title="Add reward" />
        <RewardDetailsForm mode="create" assetPool={assetPool} />
      </div>
  );
}
