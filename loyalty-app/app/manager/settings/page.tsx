import { ManagerShell } from "@/components/manager/manager-shell";
import { SectionTitle } from "@/components/shared/section-title";
import { orgConfig } from "@/lib/mock-data";

export default function ManagerSettingsPage() {
  return (
    <ManagerShell>
      <div className="space-y-7">
        <SectionTitle eyebrow="Configuration" title="Settings" />
        <section className="rounded-lg border border-line-soft bg-cream p-7">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-md border border-line-soft bg-stone/40 p-5">
              <p className="eyebrow text-ink-muted">Earn rate</p>
              <p className="counter mt-3 font-display text-[40px] font-medium leading-none text-charcoal">
                {orgConfig.earnRate}:1
              </p>
              <p className="mt-3 text-sm leading-5 text-ink-muted">
                One leaf earned for every peso a member spends.
              </p>
            </div>
            <div className="rounded-md border border-line-soft bg-stone/40 p-5">
              <p className="eyebrow text-ink-muted">Storage</p>
              <p className="mt-3 font-display text-[20px] font-medium leading-7 text-charcoal">
                Object bucket planned
              </p>
              <p className="mt-3 text-sm leading-5 text-ink-muted">
                Reward images and the org logo live outside Postgres.
              </p>
            </div>
          </div>
        </section>
      </div>
    </ManagerShell>
  );
}
