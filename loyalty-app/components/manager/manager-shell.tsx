import { Brand } from "@/components/shared/brand";
import { ManagerNav } from "@/components/manager/manager-nav";
import { ManagerProfileMenu } from "@/components/manager/manager-profile-menu";
import { requireManagerSession } from "@/lib/auth/session";
import { listBranches } from "@/lib/data/branches";

export async function ManagerShell({ children }: { children: React.ReactNode }) {
  const [{ user }, branches] = await Promise.all([requireManagerSession(), listBranches()]);

  return (
    <div className="flex min-h-screen flex-col bg-stone lg:h-screen lg:overflow-hidden">
      <header className="sticky top-0 z-30 border-b border-line-soft bg-cream/95 shadow-sm backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-5 gap-y-3 px-5 py-2.5">
          <Brand
            href="/manager"
            size="sm"
            className="shrink-0 rounded-pill px-1.5 py-1 transition-colors duration-fast ease-out-soft hover:bg-sage-wash"
          />
          <div className="order-last w-full lg:order-none lg:w-auto lg:flex-1">
            <ManagerNav branches={branches.map((branch) => ({ id: branch.id, name: branch.name }))} />
          </div>
          <div className="ml-auto shrink-0 lg:ml-0">
            <ManagerProfileMenu name={user.name} />
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-6 lg:min-h-0 lg:overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
