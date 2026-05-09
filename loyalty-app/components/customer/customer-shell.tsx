import Link from "next/link";
import { Gift, History, Home, QrCode, UserRound } from "lucide-react";
import { Brand } from "@/components/shared/brand";

const nav = [
  { href: "/customer", label: "Home", icon: Home },
  { href: "/customer/qr", label: "QR", icon: QrCode },
  { href: "/customer/rewards", label: "Rewards", icon: Gift },
  { href: "/customer/activity", label: "Activity", icon: History },
  { href: "/customer/profile", label: "Profile", icon: UserRound }
];

export function CustomerShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="grain min-h-screen px-4 pb-24 pt-5">
      <div className="relative mx-auto max-w-md">
        <header className="mb-6 flex items-center justify-between">
          <Brand href="/customer" />
          <span className="rounded-full bg-matcha/12 px-3 py-1 text-xs font-bold text-moss">PWA</span>
        </header>
        {children}
      </div>
      <nav className="fixed inset-x-3 bottom-3 z-10 mx-auto grid max-w-md grid-cols-5 rounded-full border border-moss/15 bg-paper/95 p-2 shadow-soft backdrop-blur">
        {nav.map((item) => (
          <Link key={item.href} href={item.href} className="grid place-items-center gap-1 rounded-full px-2 py-2 text-[11px] font-bold text-moss hover:bg-matcha/10">
            <item.icon className="h-4 w-4" aria-hidden="true" />
            {item.label}
          </Link>
        ))}
      </nav>
    </main>
  );
}
