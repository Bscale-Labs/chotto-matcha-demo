import { ArrowRight, KeyRound } from "lucide-react";
import { ActionLink } from "@/components/shared/action-link";
import { CashierShell } from "@/components/cashier/cashier-shell";
import { branches, staff } from "@/lib/mock-data";

export default function CashierPage() {
  const branch = branches[0];
  const roster = staff.filter((member) => member.role === "cashier" && member.branchId === branch.id);

  return (
    <CashierShell>
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <section className="matcha-card rounded-[8px] p-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-matcha">Branch device</p>
          <h1 className="mt-2 font-display text-5xl text-ink">{branch.name}</h1>
          <p className="mt-3 text-sm leading-6 text-ink/65">{branch.address}</p>
          <div className="mt-8 grid gap-3">
            {roster.map((member) => (
              <div key={member.id} className="flex items-center justify-between rounded-[8px] bg-white/60 p-4">
                <div>
                  <p className="font-bold text-ink">{member.name}</p>
                  <p className="mt-1 text-sm text-ink/55">PIN required</p>
                </div>
                <button className="grid h-12 w-12 place-items-center rounded-full bg-ink text-paper" aria-label={`Start ${member.name} shift`}>
                  <KeyRound className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        </section>
        <aside className="matcha-card rounded-[8px] p-6">
          <h2 className="text-xl font-bold text-ink">Active session</h2>
          <p className="mt-3 text-sm leading-6 text-ink/62">Mika is signed in for the demo. Go straight to lookup or scan.</p>
          <ActionLink href="/cashier/identify" icon={ArrowRight} className="mt-6 w-full">Identify customer</ActionLink>
        </aside>
      </div>
    </CashierShell>
  );
}
