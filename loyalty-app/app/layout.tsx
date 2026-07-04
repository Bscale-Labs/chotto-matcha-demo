import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Suspense } from "react";
import { ToastProvider, ToastUrlListener } from "@/components/shared/toast-provider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap"
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Chotto Matcha — Just a moment, with matcha.",
  description: "A quiet loyalty ritual for Chotto Matcha members, baristas, and managers.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg"
  }
};

export const viewport: Viewport = {
  themeColor: "#2F4B2E",
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <ToastProvider>
          {children}
          <Suspense fallback={null}>
            <ToastUrlListener />
          </Suspense>
        </ToastProvider>
      </body>
    </html>
  );
}
