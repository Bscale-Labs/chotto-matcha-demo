import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, MapPin, QrCode } from "lucide-react";
import { CustomerShell } from "@/components/customer/customer-shell";
import { RewardImage } from "@/components/customer/reward-image";
import { PointsPill } from "@/components/customer/points-pill";
import { requireCustomerSession } from "@/lib/auth/session";
import { getRewardById, listRewardAllocations } from "@/lib/data/rewards";
import { formatPoints } from "@/lib/formatters";
import { pointsNeeded } from "@/lib/points";

export default async function RewardDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { customer } = await requireCustomerSession();
  const reward = await getRewardById(id);
  if (!reward || !reward.active) notFound();

  const allocations = (await listRewardAllocations(reward.id)).filter(
    (allocation) => allocation.active && (allocation.stockCount === null || allocation.stockCount > 0)
  );
  const needed = pointsNeeded(customer, reward);
  const ready = needed === 0 && allocations.length > 0;

  return (
    <CustomerShell>
      <Link
        href="/customer/rewards"
        className="inline-flex min-h-tap items-center gap-1 text-sm font-medium text-matcha-deep transition-colors duration-fast ease-out-soft hover:text-forest"
      >
        <ChevronLeft className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
        Rewards
      </Link>

      <section className="surface-paper mt-3 overflow-hidden rounded-xl">
        <div className="grid place-items-center bg-rice p-6">
          <RewardImage imageUrl={reward.imageUrl} name={reward.name} type={reward.type} />
        </div>
        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <h1 className="font-display text-[28px] font-medium leading-[34px] text-charcoal">
              {reward.name}
            </h1>
            <PointsPill points={reward.pointCost} tone={ready ? "solid" : "soft"} />
          </div>
          <p className="mt-3 text-sm leading-5 text-ink-muted">{reward.description}</p>
        </div>
      </section>

      {allocations.length > 0 ? (
        <section className="mt-4">
          <p className="eyebrow text-ink-muted">Available at</p>
          <ul className="mt-2 grid gap-1.5">
            {allocations.map((allocation) => (
              <li
                key={allocation.branchId}
                className="surface-paper flex items-center gap-2 rounded-md px-3 py-2.5 text-sm text-charcoal"
              >
                <MapPin className="h-4 w-4 shrink-0 text-matcha-deep" strokeWidth={1.75} aria-hidden="true" />
                <span className="truncate">{allocation.branchName}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mt-4">
        {ready ? (
          <Link
            href="/customer/qr"
            className="action-lacquer inline-flex min-h-tap w-full items-center justify-center gap-2 rounded-pill px-4 text-[15px] font-semibold"
          >
            <QrCode className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
            Show my QR to redeem
          </Link>
        ) : (
          <p className="surface-paper rounded-lg p-4 text-center text-sm text-ink-muted">
            {allocations.length === 0 ? (
              "Unavailable for now — check back soon."
            ) : (
              <>
                <span className="counter font-medium text-matcha-deep">
                  {formatPoints(needed)} more leaves
                </span>{" "}
                and this is yours.
              </>
            )}
          </p>
        )}
      </section>
    </CustomerShell>
  );
}
