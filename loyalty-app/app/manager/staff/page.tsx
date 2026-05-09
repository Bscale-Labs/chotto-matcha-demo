import { Plus } from "lucide-react";
import { ManagerShell } from "@/components/manager/manager-shell";
import { DataTable } from "@/components/shared/table";
import { SectionTitle } from "@/components/shared/section-title";
import { Pill } from "@/components/shared/pill";
import { Button } from "@/components/shared/button";
import { resetStaffPin, setStaffActive } from "@/app/manager/actions";
import { listManagerStaff } from "@/lib/data/manager";

export default async function ManagerStaffPage() {
  const staff = await listManagerStaff();

  return (
    <ManagerShell>
      <div className="space-y-7">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionTitle eyebrow="Team" title="Staff" />
          <Button href="/manager/staff/new" icon={Plus}>Add staff</Button>
        </div>
        <DataTable
          headers={["Name", "Role", "Branch", "PIN", "Status", "PIN reset", "Actions"]}
          rows={staff.map(({ profile, detail, branchName }) => [
            <span key={`${profile.id}-name`} className="font-medium text-charcoal">
              {profile.name}
            </span>,
            <span key={`${profile.id}-role`} className="capitalize text-sm text-ink-muted">
              {detail.role}
            </span>,
            <span key={`${profile.id}-branch`} className="text-sm text-ink-muted">
              {branchName ?? "All branches"}
            </span>,
            <span key={`${profile.id}-pin`} className="text-sm text-ink-muted">
              {detail.pinHash ? "Set" : "Not required"}
            </span>,
            <Pill key={`${profile.id}-status`} tone={profile.active ? "default" : "muted"}>
              {profile.active ? "Active" : "Resting"}
            </Pill>,
            detail.role === "cashier" ? (
              <form
                key={`${profile.id}-pin-reset`}
                action={resetStaffPin}
                className="flex items-center gap-1.5"
              >
                <input type="hidden" name="id" value={profile.id} />
                <input
                  name="pin"
                  inputMode="numeric"
                  className="h-9 w-20 rounded-md border border-line bg-cream px-2 text-sm focus:border-matcha-deep focus:outline-none"
                  placeholder="PIN"
                  aria-label="New PIN"
                />
                <button className="h-9 rounded-md border border-line bg-cream px-3 text-xs font-medium text-charcoal transition-colors duration-fast ease-out-soft hover:border-matcha-deep hover:text-matcha-deep">
                  Reset
                </button>
              </form>
            ) : (
              <span key={`${profile.id}-pin-reset`} className="text-xs text-ink-faint">—</span>
            ),
            <div
              key={`${profile.id}-actions`}
              className="flex items-center gap-1.5"
            >
              <Button href={`/manager/staff/${profile.id}/edit`} variant="tertiary">
                Edit
              </Button>
              <form action={setStaffActive}>
                <input type="hidden" name="id" value={profile.id} />
                <input type="hidden" name="active" value={profile.active ? "false" : "true"} />
                <button className="h-9 rounded-md border border-line bg-cream px-3 text-xs font-medium text-charcoal transition-colors duration-fast ease-out-soft hover:border-matcha-deep hover:text-matcha-deep">
                  {profile.active ? "Deactivate" : "Reactivate"}
                </button>
              </form>
            </div>
          ])}
        />
      </div>
    </ManagerShell>
  );
}
