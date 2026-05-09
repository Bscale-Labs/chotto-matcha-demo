import { ManagerShell } from "@/components/manager/manager-shell";
import { SectionTitle } from "@/components/shared/section-title";
import { Button } from "@/components/shared/button";
import { updateSettings } from "@/app/manager/actions";
import { getOrgDisplayConfig } from "@/lib/data/org-config";

export default async function ManagerSettingsPage() {
  const orgConfig = await getOrgDisplayConfig();

  return (
    <ManagerShell>
      <div className="space-y-7">
        <SectionTitle eyebrow="Configuration" title="Settings" />
        <form action={updateSettings} className="rounded-lg border border-line-soft bg-cream p-7 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-md border border-line-soft bg-stone/40 p-5">
              <p className="eyebrow text-ink-muted">Earn rate</p>
              <input
                name="earnRate"
                type="number"
                min="0.01"
                step="0.01"
                defaultValue={orgConfig.earnRate}
                className="counter mt-3 w-full rounded-md border border-line bg-cream px-4 py-3 font-display text-[32px] font-medium leading-none text-charcoal focus:border-matcha-deep focus:outline-none focus:shadow-focus"
              />
              <p className="mt-3 text-sm leading-5 text-ink-muted">
                One point earned for every peso a member spends.
              </p>
            </div>
            <div className="rounded-md border border-line-soft bg-stone/40 p-5">
              <p className="eyebrow text-ink-muted">Display name</p>
              <input
                name="orgName"
                defaultValue={orgConfig.orgName}
                className="mt-3 w-full rounded-md border border-line bg-cream px-4 py-3 text-base text-charcoal focus:border-matcha-deep focus:outline-none focus:shadow-focus"
              />
              <p className="mt-3 text-sm leading-5 text-ink-muted">
                Logo upload remains out of scope. Current logo asset: {orgConfig.logoAssetId ?? "none"}.
              </p>
            </div>
          </div>
          <Button type="submit" className="mt-5">Save settings</Button>
        </form>
      </div>
    </ManagerShell>
  );
}
