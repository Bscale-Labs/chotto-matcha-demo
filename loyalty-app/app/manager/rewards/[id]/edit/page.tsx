import { notFound } from "next/navigation";
import { ManagerShell } from "@/components/manager/manager-shell";
import { SectionTitle } from "@/components/shared/section-title";
import { Button } from "@/components/shared/button";
import { updateReward } from "@/app/manager/actions";
import { getRewardById } from "@/lib/data/rewards";

export default async function EditRewardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const reward = await getRewardById(id);
  if (!reward) notFound();

  return (
    <ManagerShell>
      <div className="space-y-7">
        <SectionTitle eyebrow="Catalog" title="Edit reward" />
        <form action={updateReward} className="grid max-w-2xl gap-4 rounded-lg border border-line-soft bg-cream p-6">
          <input type="hidden" name="id" value={reward.id} />
          <input name="name" required defaultValue={reward.name} className="rounded-md border border-line bg-cream px-4 py-3 focus:border-matcha-deep focus:outline-none focus:shadow-focus" />
          <textarea name="description" required defaultValue={reward.description} className="min-h-28 rounded-md border border-line bg-cream px-4 py-3 focus:border-matcha-deep focus:outline-none focus:shadow-focus" />
          <input name="pointCost" required type="number" min="1" defaultValue={reward.pointCost} className="rounded-md border border-line bg-cream px-4 py-3 focus:border-matcha-deep focus:outline-none focus:shadow-focus" />
          <select name="type" defaultValue={reward.type} className="rounded-md border border-line bg-cream px-4 py-3 focus:border-matcha-deep focus:outline-none focus:shadow-focus">
            <option value="item">Item</option>
            <option value="merch">Merch</option>
          </select>
          <input name="stockCount" type="number" min="0" defaultValue={reward.stockCount ?? ""} className="rounded-md border border-line bg-cream px-4 py-3 focus:border-matcha-deep focus:outline-none focus:shadow-focus" />
          <div className="flex gap-3">
            <Button type="submit">Save reward</Button>
            <Button href="/manager/rewards" variant="secondary">Cancel</Button>
          </div>
        </form>
      </div>
    </ManagerShell>
  );
}
