import { notFound } from "next/navigation";
import { RewardDetailsForm } from "@/components/manager/reward-details-form";
import { RewardAllocationTable } from "@/components/manager/reward-allocation-table";
import { SectionTitle } from "@/components/shared/section-title";
import { listImageAssetsForManager } from "@/lib/data/assets";
import { listBranches } from "@/lib/data/branches";
import { getRewardById, listRewardAllocations } from "@/lib/data/rewards";

export default async function EditRewardPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [reward, branches, allocations, assetPool] = await Promise.all([
    getRewardById(id),
    listBranches(),
    listRewardAllocations(id),
    listImageAssetsForManager()
  ]);
  if (!reward) notFound();

  return (
    <div className="space-y-7">
        <SectionTitle title="Edit reward" />
        <RewardDetailsForm
          mode="edit"
          reward={{
            id: reward.id,
            name: reward.name,
            description: reward.description,
            pointCost: reward.pointCost,
            type: reward.type,
            active: reward.active,
            imageAssetId: reward.imageAssetId,
            imageUrl: reward.imageUrl
          }}
          assetPool={assetPool}
        />
        <section className="surface-paper grid max-w-2xl gap-4 rounded-lg p-6">
          <h2 className="font-sans text-[17px] font-bold leading-6 tracking-tight text-charcoal">
            Branch allocation
          </h2>
          <RewardAllocationTable rewardId={reward.id} branches={branches} allocations={allocations} />
        </section>
      </div>
  );
}
