import { ArrowLeft, Gift, PlusCircle, ReceiptText } from "lucide-react";
import { Button } from "@/components/shared/button";
import { Eyebrow } from "@/components/shared/eyebrow";
import { CashierShell } from "@/components/cashier/cashier-shell";
import { CustomerAvatar, TeaStillLife } from "@/components/cashier/cashier-visuals";
import { TierBadge } from "@/components/customer/tier-badge";
import { getCashierShiftCookie } from "@/lib/auth/shift";
import { requireCashierManagerPageSession, requireCashierShiftSession } from "@/lib/auth/session";
import {
  getCustomerById,
  getCustomerRecentTransactions,
  getCustomerRecentTransactionsForBranch
} from "@/lib/data/customers";
import { listConfiguredRewardTiers } from "@/lib/data/reward-tiers";
import { formatDate, formatPoints } from "@/lib/formatters";
import { getTier } from "@/lib/loyalty";
import { notFound } from "next/navigation";

export default async function CashierCustomerPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ mode?: string }>;
}) {
  const [{ id }, shift, query] = await Promise.all([params, getCashierShiftCookie(), searchParams]);
  const useManagerMode = query.mode === "manager" || !shift;
  const context = useManagerMode
    ? { mode: "manager" as const, session: await requireCashierManagerPageSession(`/cashier/customer/${id}?mode=manager`) }
    : { mode: "service" as const, session: await requireCashierShiftSession() };
  const { profile, branch } = context.session;
  const [customer, recentTransactions, rewardTiers] = await Promise.all([
    getCustomerById(id),
    context.mode === "manager"
      ? getCustomerRecentTransactionsForBranch(id, branch.id, 2)
      : getCustomerRecentTransactions(id, 2),
    listConfiguredRewardTiers()
  ]);
  if (!customer?.active) notFound();
  const tier = getTier(customer.pointsBalance, rewardTiers);

  return (
    <CashierShell sessionLabel={`${branch.name} · ${profile.name}`} mode={context.mode}>
      <div className="mb-4">
        <Button
          href={context.mode === "manager" ? "/cashier/customers" : "/cashier/identify"}
          variant="tertiary"
          icon={ArrowLeft}
        >
          {context.mode === "manager" ? "Back to customers" : "Back to scanner"}
        </Button>
      </div>
      <section className="cashier-panel rounded-lg p-6">
        <Eyebrow className="text-matcha-deep">{context.mode === "manager" ? "Customer profile" : "Member found"}</Eyebrow>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <CustomerAvatar name={customer.name} className="h-16 w-16 text-lg" />
            <div>
              <h1 className="font-display text-[40px] font-medium leading-[44px] text-charcoal sm:text-[44px] sm:leading-[48px]">
                {customer.name}
              </h1>
              <p className="mt-1 text-sm leading-6 text-ink-muted">
                <span className="font-mono uppercase tracking-[0.08em] text-matcha-deep">{customer.code}</span>
                <span className="mx-2 text-line">/</span>
                {customer.phone}
              </p>
            </div>
          </div>
          <TierBadge tier={tier} />
        </div>

        <div className="cashier-points-panel mt-7 rounded-lg p-7 shadow-md">
          <p className="eyebrow relative text-cream/85">Current balance</p>
          <p className="counter relative mt-3 text-[56px] font-semibold leading-none tracking-tight">
            {formatPoints(customer.pointsBalance)} <span className="text-[26px] font-medium">pts</span>
          </p>
          <p className="relative mt-2 text-sm text-cream/85">Available points</p>
          <TeaStillLife className="pointer-events-none absolute bottom-0 right-0 h-full w-[42%] opacity-70 [mask-image:linear-gradient(90deg,transparent,black_32%)]" />
        </div>

        {context.mode === "service" ? (
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Button href={`/cashier/award?customerId=${customer.id}`} icon={PlusCircle}>
              Award points
            </Button>
            <Button href={`/cashier/redeem?customerId=${customer.id}`} variant="secondary" icon={Gift}>
              Redeem reward
            </Button>
          </div>
        ) : null}

        <div className="mt-6 border-t border-line-soft pt-5">
          <div className="flex items-center justify-between gap-3">
            <Eyebrow className="text-matcha-deep">Recent activity</Eyebrow>
            <span className="text-xs font-medium text-ink-muted">{recentTransactions.length} latest</span>
          </div>
          {recentTransactions.length > 0 ? (
            <ul className="mt-3 divide-y divide-line-soft">
              {recentTransactions.map((transaction) => (
                <li
                  key={transaction.id}
                  className="grid gap-3 py-3 sm:grid-cols-[1fr_auto] sm:items-center"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-pill bg-sage-wash text-matcha-deep">
                      <ReceiptText className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-sm font-medium capitalize text-charcoal">
                        {transaction.type === "earn" ? "Earned from purchase" : transaction.type}
                      </p>
                      <p className="mt-0.5 text-xs text-ink-muted">{formatDate(transaction.createdAt)}</p>
                    </div>
                  </div>
                  <p className="counter text-sm font-semibold text-matcha-deep sm:text-right">
                    {transaction.pointsDelta > 0 ? "+" : ""}
                    {formatPoints(transaction.pointsDelta)} pts
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-ink-muted">No recent activity.</p>
          )}
        </div>
      </section>
    </CashierShell>
  );
}
