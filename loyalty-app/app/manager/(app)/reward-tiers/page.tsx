import { Medal } from "lucide-react";
import { updateRewardTiers } from "@/app/manager/actions";
import { TierBadge } from "@/components/customer/tier-badge";
import { Button } from "@/components/shared/button";
import { SectionTitle } from "@/components/shared/section-title";
import { ToastActionForm } from "@/components/shared/toast-action-form";
import { listConfiguredRewardTiers } from "@/lib/data/reward-tiers";
import { formatPoints } from "@/lib/formatters";

export default async function ManagerRewardTiersPage() {
  const rewardTiers = await listConfiguredRewardTiers();

  return (
    <div className="space-y-7">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionTitle title="Reward Tiers" />
          <div className="inline-flex items-center gap-2 rounded-pill border border-line-soft bg-cream px-3 py-1.5 text-sm font-medium text-matcha-deep">
            <Medal className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
            Points based
          </div>
        </div>

        <ToastActionForm
          action={updateRewardTiers}
          successTitle="Reward tiers saved"
          errorTitle="Could not save reward tiers"
          className="surface-paper rounded-lg p-6"
        >
          <div className="grid gap-3">
            {rewardTiers.map((tier, index) => {
              const range =
                tier.max === null
                  ? `${formatPoints(tier.min)}+`
                  : `${formatPoints(tier.min)}-${formatPoints(tier.max)}`;

              return (
                <section
                  key={tier.id}
                  className="grid gap-4 rounded-md border border-line-soft bg-cream p-4 lg:grid-cols-[180px_minmax(0,1fr)_180px]"
                >
                  <input type="hidden" name="tierId" value={tier.id} />
                  <input type="hidden" name={`sortOrder-${tier.id}`} value={index + 1} />
                  <div className="flex items-start justify-between gap-3 lg:block">
                    <div>
                      <TierBadge tier={tier} />
                      <p className="counter mt-3 text-sm font-medium text-ink-muted">{range} pts</p>
                    </div>
                    <span className="counter text-xs font-medium text-ink-faint lg:mt-5 lg:block">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <label className="grid gap-2 text-sm font-medium text-charcoal">
                    Name
                    <input
                      name={`name-${tier.id}`}
                      required
                      defaultValue={tier.name}
                      className="min-h-tap rounded-md border border-line bg-cream px-4 py-3 text-base font-normal focus:border-matcha-deep focus:outline-none focus:shadow-focus"
                    />
                  </label>

                  <label className="grid gap-2 text-sm font-medium text-charcoal">
                    Minimum points
                    <input
                      name={`minPoints-${tier.id}`}
                      required
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      defaultValue={tier.min}
                      className="counter min-h-tap rounded-md border border-line bg-cream px-4 py-3 text-base font-semibold focus:border-matcha-deep focus:outline-none focus:shadow-focus"
                    />
                  </label>

                  <label className="grid gap-2 text-sm font-medium text-charcoal lg:col-span-2 lg:col-start-2">
                    Badge copy
                    <input
                      name={`description-${tier.id}`}
                      required
                      defaultValue={tier.vibe}
                      className="min-h-tap rounded-md border border-line bg-cream px-4 py-3 text-base font-normal focus:border-matcha-deep focus:outline-none focus:shadow-focus"
                    />
                  </label>
                </section>
              );
            })}
          </div>

          <div className="mt-6 flex justify-end">
            <Button type="submit">Save tiers</Button>
          </div>
        </ToastActionForm>
      </div>
  );
}
