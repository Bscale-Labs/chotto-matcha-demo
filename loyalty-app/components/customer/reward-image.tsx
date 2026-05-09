"use client";

import { useState } from "react";
import Image from "next/image";
import { Coffee, Gift, Leaf } from "lucide-react";
import type { Reward } from "@/lib/types";

export function RewardImage({
  imageUrl,
  type
}: {
  imageUrl?: string | null;
  type: Reward["type"];
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const Icon = type === "item" ? Coffee : type === "merch" ? Gift : Leaf;

  if (imageUrl && !imageFailed) {
    return (
      <Image
        src={imageUrl}
        alt=""
        width={64}
        height={64}
        className="h-16 w-16 shrink-0 rounded-md object-cover"
        onError={() => setImageFailed(true)}
      />
    );
  }

  return (
    <div
      className="grid h-16 w-16 shrink-0 place-items-center rounded-md bg-gradient-to-br from-sage-wash to-sage-tint text-matcha-deep"
      aria-hidden="true"
    >
      <Icon className="h-7 w-7" strokeWidth={1.5} />
    </div>
  );
}
