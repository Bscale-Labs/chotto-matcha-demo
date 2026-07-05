import { Plus } from "lucide-react";
import { SectionTitle } from "@/components/shared/section-title";
import { Button } from "@/components/shared/button";
import { CustomerSearchTable } from "@/components/manager/customer-search-table";
import { listCustomersForManager } from "@/lib/data/manager";
import { listConfiguredRewardTiers } from "@/lib/data/reward-tiers";

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
  const customerRows = customers.map((customer) => ({
    id: customer.id,
    code: customer.code,
    email: customer.email,
    name: customer.name,
    phone: customer.phone,
    pointsBalance: customer.pointsBalance,
    active: customer.active
  }));
  const tierRows = rewardTiers.map((tier) => ({
    id: tier.id,
    name: tier.name,
    min: tier.min,
    max: tier.max,
    vibe: tier.vibe
  }));

  return (
    <div className="flex min-h-0 flex-col gap-5 lg:h-full">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionTitle title="Members" />
          <Button href="/manager/customers/new" icon={Plus}>Add customer</Button>
        </div>
        <CustomerSearchTable
          initialCustomers={customerRows}
          initialRewardTiers={tierRows}
          initialQuery={q}
          highlightKey={changed}
        />
      </div>
  );
}
