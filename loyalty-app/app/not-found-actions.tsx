"use client";

import { ArrowLeft, Home } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/shared/button";

export function NotFoundActions() {
  const router = useRouter();

  function handleReturn() {
    if (window.history.length <= 1) {
      router.push("/");
      return;
    }

    const currentLocation = window.location.href;
    router.back();

    window.setTimeout(() => {
      if (window.location.href === currentLocation) {
        router.push("/");
      }
    }, 350);
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
      <Button type="button" onClick={handleReturn} icon={ArrowLeft}>
        Back
      </Button>
      <Button href="/" variant="secondary" icon={Home}>
        Home
      </Button>
    </div>
  );
}
