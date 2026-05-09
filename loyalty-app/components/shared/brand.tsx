import Link from "next/link";
import { Leaf } from "lucide-react";

export function Brand({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-3">
      <span className="grid h-11 w-11 place-items-center rounded-full bg-matcha text-paper shadow-soft">
        <Leaf className="h-5 w-5" aria-hidden="true" />
      </span>
      <span>
        <span className="block font-display text-xl leading-5 tracking-normal">Chotto</span>
        <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-moss/70">Matcha</span>
      </span>
    </Link>
  );
}
