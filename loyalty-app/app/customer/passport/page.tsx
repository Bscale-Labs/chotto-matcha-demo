import Image from "next/image";
import { Check, Globe2 } from "lucide-react";
import { CustomerShell } from "@/components/customer/customer-shell";
import { requireCustomerSession } from "@/lib/auth/session";
import { listActiveBranches } from "@/lib/data/branches";
import { getCustomerRecentTransactions } from "@/lib/data/customers";

export default async function CustomerPassportPage() {
  const { customer } = await requireCustomerSession();
  const [branches, activity] = await Promise.all([
    listActiveBranches(),
    getCustomerRecentTransactions(customer.id, 200)
  ]);
  const visited = new Set(
    activity.map((transaction) => transaction.branchId).filter(Boolean)
  );
  const visitedCount = branches.filter((branch) => visited.has(branch.id)).length;
  const isJapan = (text: string) => /tokyo|japan/i.test(text);
  const groups = [
    {
      country: "Philippines",
      branches: branches.filter((b) => !isJapan(`${b.name} ${b.address}`))
    },
    {
      country: "Japan",
      branches: branches.filter((b) => isJapan(`${b.name} ${b.address}`))
    }
  ].filter((group) => group.branches.length > 0);

  return (
    <CustomerShell>
      <section className="flex items-start justify-between gap-4">
        <h1 className="font-display text-[40px] font-medium leading-[44px] text-charcoal">
          Tea Passport
        </h1>
        <span
          className="grid h-16 w-16 shrink-0 rotate-6 place-items-center rounded-pill border-2 border-dashed border-sage font-display text-lg text-matcha-deep/70"
          aria-hidden="true"
        >
          茶
        </span>
      </section>

      {groups.map((group) => (
        <section key={group.country} className="mt-6">
          <p className="eyebrow text-ink-muted">{group.country}</p>
          <ul className="mt-3 grid gap-2">
            {group.branches.map((branch) => {
              const stamped = visited.has(branch.id);
              return (
                <li
                  key={branch.id}
                  className="surface-paper flex items-center gap-3 rounded-md p-3"
                >
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-sm">
                    <Image
                      src="/cashier/matcha-storefront.png"
                      alt=""
                      fill
                      className="object-cover"
                      sizes="3rem"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-charcoal">{branch.name}</p>
                    <p className="truncate text-xs text-ink-muted">{branch.address}</p>
                  </div>
                  <span
                    className={
                      stamped
                        ? "action-lacquer grid h-9 w-9 shrink-0 place-items-center rounded-pill text-cream"
                        : "grid h-9 w-9 shrink-0 place-items-center rounded-pill border border-dashed border-line text-ink-faint"
                    }
                    aria-label={stamped ? "Visited" : "Not visited yet"}
                    role="img"
                  >
                    {stamped ? (
                      <Check className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                    ) : null}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      <section className="mt-6 flex items-center gap-3 rounded-lg border border-dashed border-sage bg-sage-wash p-4">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-pill bg-milk text-matcha-deep">
          <Globe2 className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
        </span>
        <p className="text-xs leading-4 text-ink-muted">
          Visit all {branches.length} branches to unlock the{" "}
          <span className="font-medium text-matcha-deep">Global Matcha Traveler</span> badge.{" "}
          <span className="counter font-medium text-charcoal">
            {visitedCount} / {branches.length}
          </span>{" "}
          stamped.
        </p>
      </section>
    </CustomerShell>
  );
}
