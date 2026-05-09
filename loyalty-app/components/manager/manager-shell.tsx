import { Brand } from "@/components/shared/brand";
import { ManagerNav } from "@/components/manager/manager-nav";
import { requireManagerSession } from "@/lib/auth/session";
import { initials } from "@/lib/formatters";

export async function ManagerShell({ children }: { children: React.ReactNode }) {
  const { user } = await requireManagerSession();

  return (
    <main className="min-h-screen bg-stone py-6">
      <div className="mx-auto max-w-7xl px-5">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Brand href="/manager" size="sm" />
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-pill border border-line-soft bg-cream px-3 py-1.5 text-sm text-charcoal shadow-sm">
              <span className="grid h-6 w-6 place-items-center rounded-pill bg-matcha-deep text-[10px] font-semibold text-cream">
                {initials(user.name)}
              </span>
              {user.name}
            </span>
            <form action="/manager/logout" method="post">
              <button
                type="submit"
                className="inline-flex min-h-tap items-center gap-2 rounded-pill border border-line bg-cream px-4 text-sm font-medium text-charcoal transition-colors duration-fast ease-out-soft hover:border-matcha-deep hover:text-matcha-deep"
              >
                Sign out
              </button>
            </form>
          </div>
        </header>
        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
          <aside className="rounded-lg border border-line-soft bg-cream p-2 shadow-sm lg:sticky lg:top-6 lg:h-fit lg:min-h-[calc(100vh-8rem)]">
            <ManagerNav />
          </aside>
          <section className="min-w-0">{children}</section>
        </div>
      </div>
    </main>
  );
}
