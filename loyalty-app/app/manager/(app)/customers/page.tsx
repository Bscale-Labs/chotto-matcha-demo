import { Plus } from "lucide-react";
import { SectionTitle } from "@/components/shared/section-title";
import { Button } from "@/components/shared/button";
import { CustomerSearchTable } from "@/components/manager/customer-search-table";
import { listCustomersForManager } from "@/lib/data/manager";

export default async function ManagerCustomersPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; changed?: string }>;
}) {
  const { q, changed } = await searchParams;
  const customers = await listCustomersForManager(q);
  const customerRows = customers.map((customer) => ({
    id: customer.id,
    code: customer.code,
    email: customer.email,
    name: customer.name,
    phone: customer.phone,
    pointsBalance: customer.pointsBalance,
    active: customer.active
  }));

  return (
    <div className="flex min-h-0 flex-col gap-5 lg:h-full">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionTitle title="Members" />
          <Button href="/manager/customers/new" icon={Plus}>Add customer</Button>
        </div>
        <CustomerSearchTable
          initialCustomers={customerRows}
          initialQuery={q}
          highlightKey={changed}
        />
      </div>
  );
}
