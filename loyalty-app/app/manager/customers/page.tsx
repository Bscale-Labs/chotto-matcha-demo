import { ManagerShell } from "@/components/manager/manager-shell";
import { DataTable } from "@/components/shared/table";
import { SectionTitle } from "@/components/shared/section-title";
import { TierBadge } from "@/components/customer/tier-badge";
import { customers } from "@/lib/mock-data";
import { formatPoints } from "@/lib/formatters";
import { getTier } from "@/lib/loyalty";

export default function ManagerCustomersPage() {
  return (
    <ManagerShell>
      <div className="space-y-7">
        <SectionTitle eyebrow="Community" title="Members" />
        <DataTable
          headers={["Name", "Email", "Phone", "Tier", "Leaves"]}
          rows={customers.map((customer) => {
            const tier = getTier(customer.pointsBalance);
            return [
              <span key={`${customer.id}-name`} className="font-medium text-charcoal">
                {customer.name}
              </span>,
              <span key={`${customer.id}-email`} className="text-sm text-ink-muted">
                {customer.email}
              </span>,
              <span key={`${customer.id}-phone`} className="text-sm text-ink-muted">
                {customer.phone}
              </span>,
              <TierBadge key={`${customer.id}-tier`} tier={tier} size="sm" />,
              <span
                key={`${customer.id}-leaves`}
                className="counter text-sm font-medium text-charcoal"
              >
                {formatPoints(customer.pointsBalance)}
              </span>
            ];
          })}
        />
      </div>
    </ManagerShell>
  );
}
