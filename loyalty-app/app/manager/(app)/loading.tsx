import { LoaderCircle } from "lucide-react";

export default function ManagerLoading() {
  return (
    <div className="flex min-h-[360px] items-center justify-center lg:h-full" aria-busy="true">
      <span className="sr-only">Loading manager content</span>
      <div className="surface-paper flex min-h-[132px] w-full max-w-sm flex-col items-center justify-center rounded-lg p-6 text-center">
        <LoaderCircle
          className="h-6 w-6 animate-spin text-matcha-deep"
          strokeWidth={1.9}
          aria-hidden="true"
        />
        <p className="mt-3 text-sm font-medium text-charcoal">Loading view</p>
      </div>
    </div>
  );
}
