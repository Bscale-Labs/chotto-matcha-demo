import { ManagerShell } from "@/components/manager/manager-shell";
import { SectionTitle } from "@/components/shared/section-title";
import { orgConfig } from "@/lib/mock-data";

export default function ManagerSettingsPage() {
  return (
    <ManagerShell>
      <div className="space-y-6">
        <SectionTitle eyebrow="Configuration" title="Settings" />
        <section className="matcha-card rounded-[8px] p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[8px] bg-white/65 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-moss">Earn rate</p>
              <p className="mt-3 font-display text-5xl text-ink">{orgConfig.earnRate}:1</p>
              <p className="mt-2 text-sm text-ink/60">1 point per peso spent</p>
            </div>
            <div className="rounded-[8px] bg-white/65 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-moss">Storage</p>
              <p className="mt-3 text-lg font-bold text-ink">Railway bucket planned</p>
              <p className="mt-2 text-sm text-ink/60">Reward images and org logo stay outside Postgres.</p>
            </div>
          </div>
        </section>
      </div>
    </ManagerShell>
  );
}
