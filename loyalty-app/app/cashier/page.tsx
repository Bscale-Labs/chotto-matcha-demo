import { ArrowRight, KeyRound } from "lucide-react";
import { Button } from "@/components/shared/button";
import { CashierShell } from "@/components/cashier/cashier-shell";
import { Eyebrow } from "@/components/shared/eyebrow";
import { branches, staff } from "@/lib/mock-data";

export default function CashierPage() {
  const branch = branches[0];
  const roster = staff.filter((member) => member.role === "cashier" && member.branchId === branch.id);

  return (
    <CashierShell>
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <section className="rounded-lg border border-line-soft bg-cream p-7">
          <Eyebrow className="text-matcha-deep">Branch device</Eyebrow>
          <h1 className="mt-3 font-display text-[40px] font-medium leading-[44px] text-charcoal">
            {branch.name}
          </h1>
          <p className="mt-2 text-sm leading-6 text-ink-muted">{branch.address}</p>

          <div className="mt-7 grid gap-3">
            {roster.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between rounded-md border border-line-soft bg-stone/40 p-4"
              >
                <div>
                  <p className="font-medium text-charcoal">{member.name}</p>
                  <p className="mt-1 text-xs text-ink-muted">PIN required</p>
                </div>
                <button
                  type="button"
                  aria-label={`Start ${member.name} shift`}
                  className="grid h-11 w-11 place-items-center rounded-pill bg-matcha-deep text-cream transition-colors duration-fast ease-out-soft hover:bg-forest"
                >
                  <KeyRound className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        </section>
        <aside className="rounded-lg border border-line-soft bg-cream p-7">
          <Eyebrow className="text-matcha-deep">Active session</Eyebrow>
          <h2 className="mt-3 font-display text-[24px] font-medium leading-[30px] text-charcoal">
            Mika is on the bar
          </h2>
          <p className="mt-2 text-sm leading-6 text-ink-muted">
            Identify a member, then award leaves or redeem a reward.
          </p>
          <Button href="/cashier/identify" icon={ArrowRight} iconPosition="trailing" className="mt-6 w-full">
            Identify member
          </Button>
        </aside>
      </div>
    </CashierShell>
  );
}
