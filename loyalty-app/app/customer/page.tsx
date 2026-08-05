import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Leaf } from "lucide-react";
import { CustomerShell } from "@/components/customer/customer-shell";
import { RewardTile } from "@/components/customer/reward-tile";
import { requireCustomerSession } from "@/lib/auth/session";
import { listActiveRewardsWithBranches } from "@/lib/data/rewards";
import { formatPoints, formatPeso } from "@/lib/formatters";
import { pointsNeeded } from "@/lib/points";

const PESOS_PER_LEAF = 20;

function greeting() {
  const hour = Number(
    new Intl.DateTimeFormat("en-PH", {
      hour: "numeric",
      hour12: false,
      timeZone: "Asia/Manila"
    }).format(new Date())
  );
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default async function CustomerHome() {
  const { customer } = await requireCustomerSession();
  const firstName = customer.name.split(" ")[0];

  const rewards = await listActiveRewardsWithBranches();
  const isReady = (reward: (typeof rewards)[number]) =>
    pointsNeeded(customer, reward) === 0 && reward.availableBranchNames.length > 0;
  // Surface what the customer can claim right now first, then the closest goals —
  // so the section always has something to show without going empty.
  const featured = [...rewards]
    .sort((left, right) => {
      const leftReady = isReady(left);
      const rightReady = isReady(right);
      if (leftReady !== rightReady) return leftReady ? -1 : 1;
      if (leftReady && rightReady) return right.pointCost - left.pointCost;
      return pointsNeeded(customer, left) - pointsNeeded(customer, right);
    })
    .slice(0, 4);

  return (
    <CustomerShell>
      <section>
        <h1 className="font-display text-[32px] font-medium leading-[38px] text-charcoal">
          {greeting()},{" "}
          <span className="inline-flex items-center gap-1.5">
            {firstName}
            <Leaf className="h-5 w-5 text-matcha-deep" strokeWidth={1.75} aria-hidden="true" />
          </span>
        </h1>
        <p className="mt-1 font-display text-[15px] italic leading-5 text-ink-muted">
          抹茶のある毎日を。
        </p>
        <p className="mt-1 text-sm leading-5 text-ink-muted">
          Let&apos;s continue your Tea Journey.
        </p>
      </section>

      <div className="relative mt-4 h-44 overflow-hidden rounded-xl shadow-sm">
        <Image
          src="/cashier/matcha-storefront.png"
          alt="Chotto Matcha storefront"
          fill
          priority
          className="object-cover"
          sizes="(max-width: 28rem) 100vw, 28rem"
        />
      </div>

      <section className="surface-paper relative z-10 -mt-10 mx-3 flex items-center justify-between rounded-lg px-5 py-4">
        <div>
          <p className="eyebrow text-ink-muted">Your Leaves</p>
          <p className="counter mt-1 inline-flex items-center gap-1.5 font-display text-[28px] font-medium leading-none text-matcha-deep">
            <Leaf className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
            {formatPoints(customer.pointsBalance)}
          </p>
        </div>
        <p className="counter text-sm text-ink-muted">
          = {formatPeso(customer.pointsBalance * PESOS_PER_LEAF)} spent
        </p>
      </section>

      <section className="surface-paper mt-4 flex items-center gap-4 rounded-lg p-4">
        <div className="min-w-0 flex-1">
          <p className="eyebrow text-matcha-deep">Today&apos;s Matcha</p>
          <h3 className="mt-1 font-display text-[20px] font-medium leading-6 text-charcoal">
            Iced Matcha Latte
          </h3>
          <p className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-matcha-deep">
            +10 <Leaf className="h-3 w-3" strokeWidth={1.75} aria-hidden="true" /> bonus leaves
          </p>
        </div>
        <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-md">
          <Image
            src="/cashier/reward-latte.png"
            alt="Iced Matcha Latte"
            fill
            className="object-cover"
            sizes="4rem"
          />
        </div>
      </section>

      {featured.length > 0 ? (
        <section className="mt-7">
          <header className="mb-3 flex items-end justify-between gap-3">
            <h2 className="font-display text-[24px] font-medium leading-[29px] text-charcoal">
              Ready to redeem
            </h2>
            <Link
              href="/customer/rewards"
              className="-my-2.5 inline-flex min-h-tap shrink-0 items-center gap-0.5 px-1 text-sm font-medium text-matcha-deep transition-colors duration-fast ease-out-soft hover:text-forest"
            >
              See all
              <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
            </Link>
          </header>
          <div className="grid grid-cols-2 gap-3.5">
            {featured.map((reward) => (
              <RewardTile key={reward.id} reward={reward} ready={isReady(reward)} />
            ))}
          </div>
        </section>
      ) : null}
    </CustomerShell>
  );
}
