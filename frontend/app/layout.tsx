import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/ui/header";

export const metadata: Metadata = {
  title: "CollegeSodhpuch",
  description: "International university and visa guidance platform",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        <main>{children}</main>
      </body>
    </html>
  );
}
