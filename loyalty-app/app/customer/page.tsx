import { Gift, QrCode } from "lucide-react";
import { ActionLink } from "@/components/shared/action-link";
import { StatCard } from "@/components/shared/stat-card";
import { CustomerShell } from "@/components/customer/customer-shell";
import { getBranch, getCustomer, getCustomerTransactions, getReward } from "@/lib/mock-data";
import { formatDate, formatPoints } from "@/lib/formatters";

export default function CustomerHome() {
  const customer = getCustomer();
  const recent = getCustomerTransactions(customer.id).slice(0, 3);

  return (
    <CustomerShell>
      <section className="matcha-card rounded-[8px] p-6">
        <p className="text-sm font-bold text-moss">Hi, {customer.name.split(" ")[0]}</p>
        <p className="mt-4 font-display text-6xl leading-none text-ink">{formatPoints(customer.pointsBalance)}</p>
        <p className="mt-2 text-sm text-ink/60">available points</p>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <ActionLink href="/customer/qr" icon={QrCode} className="px-3">Show QR</ActionLink>
          <ActionLink href="/customer/rewards" icon={Gift} variant="secondary" className="px-3">Rewards</ActionLink>
        </div>
      </section>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <StatCard label="Earn rate" value="1:1" detail="1 point per peso" />
        <StatCard label="Status" value="Open" detail="No expiry" />
      </div>

      <section className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-ink">Recent activity</h2>
          <a href="/customer/activity" className="text-sm font-bold text-moss">View all</a>
        </div>
        <div className="grid gap-3">
          {recent.map((transaction) => (
            <article key={transaction.id} className="matcha-card rounded-[8px] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-ink">
                    {transaction.type === "redeem" ? getReward(transaction.rewardId ?? "")?.name : getBranch(transaction.branchId)?.name}
                  </p>
                  <p className="mt-1 text-xs text-ink/55">{formatDate(transaction.createdAt)}</p>
                </div>
                <span className={transaction.pointsDelta > 0 ? "font-bold text-matcha" : "font-bold text-persimmon"}>
                  {transaction.pointsDelta > 0 ? "+" : ""}
                  {formatPoints(transaction.pointsDelta)}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </CustomerShell>
  );
}
