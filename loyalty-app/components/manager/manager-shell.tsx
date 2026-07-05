import { Brand } from "@/components/shared/brand";
import { ManagerNav } from "@/components/manager/manager-nav";
import { ManagerProfileMenu } from "@/components/manager/manager-profile-menu";
import { requireManagerSession } from "@/lib/auth/session";
import { listBranches } from "@/lib/data/branches";

export async function ManagerShell({ children }: { children: React.ReactNode }) {
  const [{ user }, branches] = await Promise.all([requireManagerSession(), listBranches()]);

  return (
    <main className="min-h-screen bg-stone py-6 lg:h-screen lg:overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 lg:h-full">
        <div className="grid gap-6 lg:h-full lg:grid-cols-[240px_minmax(0,1fr)]">
          <aside className="flex flex-col lg:h-full lg:min-h-0">
            <div className="rounded-pill border border-line-soft bg-cream p-1.5 shadow-sm">
              <Brand
                href="/manager"
                size="sm"
                className="w-full rounded-pill px-2.5 py-1.5 transition-colors duration-fast ease-out-soft hover:bg-sage-wash"
              />
            </div>
            <div className="mt-3 flex min-h-0 flex-1 flex-col rounded-lg border border-line-soft bg-cream p-2 shadow-sm">
              <ManagerNav branches={branches.map((branch) => ({ id: branch.id, name: branch.name }))} />
              <div className="mt-4 border-t border-line-soft pt-2 lg:mt-auto">
                <ManagerProfileMenu name={user.name} />
              </div>
            </div>
          </aside>
          <section className="manager-scroll-region min-w-0 lg:h-full lg:overflow-y-auto lg:pr-2">
            {children}
          </section>
        </div>
      </div>
    </main>
  );
}
