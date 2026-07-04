import type { ElementType, ReactNode } from "react";
import { clsx } from "clsx";

export type CardMaterial = "paper" | "glass" | "glass-strong";

const materials: Record<CardMaterial, string> = {
  // Opaque, readable content (default) — the Content layer
  paper: "surface-paper",
  // Floating / sticky control surface — the Control Glass layer
  glass: "surface-glass",
  // Focus surface (modal, QR, confirmation) — the Focus layer
  "glass-strong": "surface-glass-strong"
};

export function Card({
  children,
  className,
  as: Component = "section",
  material = "paper",
  padded = true
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  material?: CardMaterial;
  padded?: boolean;
}) {
  return (
    <Component
      className={clsx(
        "rounded-lg",
        materials[material],
        padded && "p-6",
        className
      )}
    >
      {children}
    </Component>
  );
}
