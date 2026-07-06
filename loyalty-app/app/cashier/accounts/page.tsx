import Link from "next/link";
import { BadgeCheck, ChevronRight, KeyRound, Mail, Plus } from "lucide-react";
import { Button } from "@/components/shared/button";
import { SectionTitle } from "@/components/shared/section-title";
import { CashierShell } from "@/components/cashier/cashier-shell";
import { CustomerAvatar } from "@/components/cashier/cashier-visuals";
import { requireCashierManagerPageSession } from "@/lib/auth/session";
import { listBranchStaffAccounts } from "@/lib/data/staff";
import { staffRoleLabel } from "@/lib/roles/staff";

export default async function CashierAccountsPage() {
  const { profile, branch } = await requireCashierManagerPageSession("/cashier/accounts");
  const staffAccounts = await listBranchStaffAccounts(branch.id);

  return (
    <CashierShell sessionLabel={`${branch.name} · ${profile.name}`} mode="manager">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionTitle title="Branch accounts" />
        <Button href="/cashier/accounts/new" icon={Plus}>Add account</Button>
      </div>

      <section className="cashier-panel mt-4 rounded-lg p-5">
        <div className="grid gap-2">
          {staffAccounts.length > 0 ? (
            staffAccounts.map(({ profile: staffProfile, detail }) => (
              <Link
                key={`${staffProfile.id}-${detail.role}`}
                href={`/cashier/accounts/${staffProfile.id}/edit`}
                className="gloss group grid gap-4 rounded-lg border border-line-soft bg-milk p-4 transition-colors duration-fast ease-out-soft hover:border-matcha-deep hover:bg-sage-wash sm:grid-cols-[1fr_auto] sm:items-center"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <CustomerAvatar name={staffProfile.name} className="h-12 w-12 shrink-0" />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="truncate font-medium text-charcoal">{staffProfile.name}</span>
                      <span className="rounded-pill bg-sage-wash px-2.5 py-1 text-xs font-semibold text-matcha-deep">
                        {staffRoleLabel(detail.role)}
                      </span>
                    </div>
                    <span className="mt-1 flex min-w-0 items-center gap-1.5 text-xs text-ink-muted">
                      <Mail className="h-3.5 w-3.5 shrink-0 text-matcha-deep" strokeWidth={1.75} aria-hidden="true" />
                      <span className="truncate">{staffProfile.email}</span>
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 sm:justify-end">
                  <span className="inline-flex min-h-8 items-center gap-1.5 rounded-pill bg-cream px-2.5 text-xs font-medium text-ink-muted">
                    <KeyRound className="h-3.5 w-3.5 text-matcha-deep" strokeWidth={1.75} aria-hidden="true" />
                    {detail.pinHash ? "PIN set" : "No PIN"}
                  </span>
                  <span className="inline-flex min-h-8 items-center gap-1.5 rounded-pill bg-sage-wash px-2.5 text-xs font-semibold text-matcha-deep">
                    <BadgeCheck className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                    {staffProfile.active ? "Active" : "Inactive"}
                  </span>
                  <ChevronRight
                    className="h-4 w-4 shrink-0 self-center text-ink-faint transition-colors group-hover:text-matcha-deep"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                </div>
              </Link>
            ))
          ) : (
            <div className="rounded-md border border-line-soft bg-cream p-6 text-sm leading-6 text-ink-muted">
              No staff accounts are assigned to this branch yet.
            </div>
          )}
        </div>
      </section>
    </CashierShell>
  );
}
