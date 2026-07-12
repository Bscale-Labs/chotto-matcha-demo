import Link from "next/link";
import { RewardImage } from "@/components/customer/reward-image";
import { PointsPill } from "@/components/customer/points-pill";
import type { RewardWithAvailability } from "@/lib/types";

export function RewardTile({
  reward,
  ready = false
}: {
  reward: RewardWithAvailability;
  ready?: boolean;
}) {
  return (
    <Link
      href="/customer/rewards"
      className="group flex flex-col overflow-hidden rounded-lg border border-line-soft bg-milk shadow-sm transition-colors duration-fast ease-out-soft hover:border-line"
    >
      <div className="relative aspect-[5/4] w-full overflow-hidden bg-rice">
        <RewardImage
          imageUrl={reward.imageUrl}
          name={reward.name}
          type={reward.type}
          variant="cover"
        />
        <PointsPill
          points={reward.pointCost}
          tone={ready ? "solid" : "soft"}
          className="absolute right-2 top-2"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <h3 className="font-display text-base leading-5 text-charcoal">{reward.name}</h3>
        <p className="line-clamp-2 text-xs leading-[17px] text-ink-muted">{reward.description}</p>
      </div>
    </Link>
  );
}
