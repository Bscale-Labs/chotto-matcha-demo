import { ManagerShell } from "@/components/manager/manager-shell";
import { DataTable } from "@/components/shared/table";
import { SectionTitle } from "@/components/shared/section-title";
import { customers } from "@/lib/mock-data";
import { formatPoints } from "@/lib/formatters";

export default function ManagerCustomersPage() {
  return (
    <ManagerShell>
      <div className="space-y-6">
        <SectionTitle eyebrow="Profiles" title="Customers" />
        <DataTable
          headers={["Name", "Email", "Phone", "Balance"]}
          rows={customers.map((customer) => [
            customer.name,
            customer.email,
            customer.phone,
            `${formatPoints(customer.pointsBalance)} pts`
          ])}
        />
      </div>
    </ManagerShell>
  );
}
