import { ManagerShell } from "@/components/manager/manager-shell";
import { SectionTitle } from "@/components/shared/section-title";
import { Button } from "@/components/shared/button";
import { createReward } from "@/app/manager/actions";

export default function NewRewardPage() {
  return (
    <ManagerShell>
      <div className="space-y-7">
        <SectionTitle eyebrow="Catalog" title="Add reward" />
        <form action={createReward} encType="multipart/form-data" className="grid max-w-2xl gap-4 rounded-lg border border-line-soft bg-cream p-6">
          <input name="name" required placeholder="Reward name" className="rounded-md border border-line bg-cream px-4 py-3 focus:border-matcha-deep focus:outline-none focus:shadow-focus" />
          <textarea name="description" required placeholder="Description" className="min-h-28 rounded-md border border-line bg-cream px-4 py-3 focus:border-matcha-deep focus:outline-none focus:shadow-focus" />
          <label className="grid gap-2 text-sm font-medium text-charcoal">
            Reward image
            <input name="image" type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="rounded-md border border-line bg-cream px-4 py-3 text-sm text-ink-muted file:mr-3 file:rounded-pill file:border-0 file:bg-sage-wash file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-matcha-deep focus:border-matcha-deep focus:outline-none focus:shadow-focus" />
          </label>
          <input name="pointCost" required type="number" min="1" placeholder="Point cost" className="rounded-md border border-line bg-cream px-4 py-3 focus:border-matcha-deep focus:outline-none focus:shadow-focus" />
          <select name="type" className="rounded-md border border-line bg-cream px-4 py-3 focus:border-matcha-deep focus:outline-none focus:shadow-focus">
            <option value="item">Item</option>
            <option value="merch">Merch</option>
          </select>
          <input name="stockCount" type="number" min="0" placeholder="Stock count; leave blank for always available" className="rounded-md border border-line bg-cream px-4 py-3 focus:border-matcha-deep focus:outline-none focus:shadow-focus" />
          <div className="flex gap-3">
            <Button type="submit">Create reward</Button>
            <Button href="/manager/rewards" variant="secondary">Cancel</Button>
          </div>
        </form>
      </div>
    </ManagerShell>
  );
}
