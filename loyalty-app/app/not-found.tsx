import type { Metadata } from "next";
import { Brand } from "@/components/shared/brand";
import { NotFoundActions } from "./not-found-actions";

export const metadata: Metadata = {
  title: "Chotto Matcha"
};

export default function NotFound() {
  return (
    <main className="min-h-screen bg-cream py-12">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-md flex-col justify-center gap-8 px-5">
        <div className="flex justify-center">
          <Brand href="/" size="md" showTagline />
        </div>

        <section className="surface-paper rounded-lg p-8">
          <h1 className="font-display text-[28px] font-semibold leading-9 text-charcoal">
            We couldn&apos;t find the page you&apos;re looking for.
          </h1>
          <p className="mt-3 text-sm leading-6 text-ink-muted">
            But if it&apos;s matcha you&apos;re looking for, we have a lot of that!
          </p>
          <div className="mt-6">
            <NotFoundActions />
          </div>
        </section>
      </div>
    </main>
  );
}
