import { Plus, Search } from "lucide-react";
import { ManagerShell } from "@/components/manager/manager-shell";
import { DataTable } from "@/components/shared/table";
import { SectionTitle } from "@/components/shared/section-title";
import { TierBadge } from "@/components/customer/tier-badge";
import { Button } from "@/components/shared/button";
import { Pill } from "@/components/shared/pill";
import { listCustomersForManager } from "@/lib/data/manager";
import { listConfiguredRewardTiers } from "@/lib/data/reward-tiers";
import { formatPoints } from "@/lib/formatters";
import { getTier } from "@/lib/loyalty";

export default async function ManagerCustomersPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; changed?: string }>;
}) {
  const { q, changed } = await searchParams;
  const [customers, rewardTiers] = await Promise.all([
    listCustomersForManager(q),
    listConfiguredRewardTiers()
  ]);

  return (
    <ManagerShell>
      <div className="space-y-7">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionTitle title="Members" />
          <Button href="/manager/customers/new" icon={Plus}>Add customer</Button>
        </div>
        <form className="ml-auto flex w-full max-w-lg items-center gap-2 rounded-md border border-line bg-cream px-4 py-3 focus-within:border-matcha-deep focus-within:shadow-focus">
          <Search className="h-4 w-4 text-ink-muted" strokeWidth={1.75} aria-hidden="true" />
          <input
            name="q"
            defaultValue={q ?? ""}
            placeholder="Search name, email, or phone"
            className="flex-1 bg-transparent text-sm placeholder:text-ink-faint focus:outline-none"
          />
          <button className="-my-1 inline-flex min-h-tap items-center rounded-md px-2 text-sm font-medium text-matcha-deep transition-colors duration-fast ease-out-soft hover:text-forest">
            Search
          </button>
        </form>
        <DataTable
          headers={["Name", "Contact", "Tier", "Points", "Status"]}
          rowHrefs={customers.map((customer) => `/manager/customers/${customer.id}/edit`)}
          rowKeys={customers.map((customer) => customer.id)}
          highlightKey={changed}
          rows={customers.map((customer) => {
            const tier = getTier(customer.pointsBalance, rewardTiers);
            return [
              <span key={`${customer.id}-name`} className="font-medium text-charcoal">
                {customer.name}
              </span>,
              <div key={`${customer.id}-contact`} className="grid">
                <span className="text-sm text-charcoal">{customer.email}</span>
                <span className="text-xs text-ink-muted">{customer.phone}</span>
              </div>,
              <TierBadge key={`${customer.id}-tier`} tier={tier} size="sm" />,
              <span
                key={`${customer.id}-points`}
                className="counter text-sm font-medium text-charcoal"
              >
                {formatPoints(customer.pointsBalance)}
              </span>,
              <Pill key={`${customer.id}-status`} tone={customer.active ? "default" : "muted"}>
                {customer.active ? "Active" : "Inactive"}
              </Pill>
            ];
          })}
        />
      </div>
    </ManagerShell>
  );
}
