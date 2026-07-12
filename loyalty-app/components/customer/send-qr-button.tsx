"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/shared/button";

export function SendQrButton({ name }: { name: string }) {
  const [copied, setCopied] = useState(false);

  async function handleSend() {
    const shareData = {
      title: "Chotto Matcha",
      text: `Scan ${name}'s Chotto Matcha code to claim points.`,
      url: typeof window !== "undefined" ? window.location.href : "",
    };

    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share(shareData);
        return;
      }
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(shareData.url || shareData.text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // Share sheet dismissed — nothing to do.
    }
  }

  return (
    <Button
      type="button"
      variant="secondary"
      icon={Send}
      onClick={handleSend}
      className="mt-5 w-full"
    >
      {copied ? "Link copied" : "Send QR"}
    </Button>
  );
}
