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
        <header style={{ borderBottom: "1px solid #d9e0ee", background: "#fff" }}>
          <nav
            style={{
              maxWidth: 900,
              margin: "0 auto",
              padding: "1rem",
              display: "flex",
              gap: "1rem",
            }}
          >
            <Link href="/">Home</Link>
            <Link href="/login">Login</Link>
            <Link href="/dashboard">Dashboard</Link>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
