import "./globals.css";
import Link from "next/link";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "CollegeSodhpuch",
  description: "International university and visa guidance platform",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <nav className="site-header__nav" aria-label="Main navigation">
            <Link className="site-logo" href="/">
              CollegeSodhpuch
            </Link>
            <div className="site-links">
              <Link className="site-link" href="/">
                Home
              </Link>
              <Link className="site-link" href="/dashboard">
                Dashboard
              </Link>
            </div>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
