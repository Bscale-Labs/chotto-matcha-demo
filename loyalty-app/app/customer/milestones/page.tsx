import Link from "next/link";
import { Award, ChevronLeft, CupSoda, Footprints, Globe2, Leaf, Stamp } from "lucide-react";
import { clsx } from "clsx";
import { CustomerShell } from "@/components/customer/customer-shell";
import { requireCustomerSession } from "@/lib/auth/session";
import { listActiveBranches } from "@/lib/data/branches";
import { getCustomerRecentTransactions } from "@/lib/data/customers";

export default async function CustomerMilestonesPage() {
  const { customer } = await requireCustomerSession();
  const [activity, branches] = await Promise.all([
    getCustomerRecentTransactions(customer.id, 200),
    listActiveBranches()
  ]);

  const earns = activity.filter((t) => t.type === "earn");
  const redeems = activity.filter((t) => t.type === "redeem");
  const totalEarned = earns.reduce((sum, t) => sum + Math.max(0, t.pointsDelta), 0);
  const visitedCount = new Set(earns.map((t) => t.branchId).filter(Boolean)).size;

  const milestones = [
    {
      icon: CupSoda,
      name: "First Sip",
      description: "Earn your first leaves",
      unlocked: earns.length > 0
    },
    {
      icon: Award,
      name: "First Treat",
      description: "Redeem your first reward",
      unlocked: redeems.length > 0
    },
    {
      icon: Footprints,
      name: "Regular",
      description: "Earn leaves 5 times",
      unlocked: earns.length >= 5
    },
    {
      icon: Leaf,
      name: "Leaf Collector",
      description: "Collect 500 leaves all-time",
      unlocked: totalEarned >= 500
    },
    {
      icon: Stamp,
      name: "Explorer",
      description: "Visit 3 different branches",
      unlocked: visitedCount >= 3
    },
    {
      icon: Globe2,
      name: "Global Matcha Traveler",
      description: `Visit all ${branches.length} branches`,
      unlocked: branches.length > 0 && visitedCount >= branches.length
    }
  ];

  return (
    <CustomerShell>
      <Link
        href="/customer/profile"
        className="inline-flex min-h-tap items-center gap-1 text-sm font-medium text-matcha-deep transition-colors duration-fast ease-out-soft hover:text-forest"
      >
        <ChevronLeft className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
        Profile
      </Link>

      <section className="mt-3">
        <h1 className="font-display text-[40px] font-medium leading-[44px] text-charcoal">
          Milestones
        </h1>
      </section>

      <ul className="mt-6 grid gap-2">
        {milestones.map((milestone) => (
          <li
            key={milestone.name}
            className={clsx(
              "flex items-center gap-3 rounded-md p-4",
              milestone.unlocked
                ? "surface-paper"
                : "border border-dashed border-line bg-transparent"
            )}
          >
            <span
              className={clsx(
                "grid h-11 w-11 shrink-0 place-items-center rounded-pill",
                milestone.unlocked
                  ? "action-lacquer text-cream"
                  : "border border-dashed border-line text-ink-faint"
              )}
              aria-hidden="true"
            >
              <milestone.icon className="h-4 w-4" strokeWidth={1.5} />
            </span>
            <div className="min-w-0 flex-1">
              <p
                className={clsx(
                  "font-medium",
                  milestone.unlocked ? "text-charcoal" : "text-ink-faint"
                )}
              >
                {milestone.name}
              </p>
              <p className="text-xs text-ink-muted">{milestone.description}</p>
            </div>
            {milestone.unlocked ? (
              <span className="text-xs font-medium text-matcha-deep">Unlocked</span>
            ) : null}
          </li>
        ))}
      </ul>
    </CustomerShell>
  );
}
