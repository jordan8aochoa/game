import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "FieldFlow AI — Modern Construction Workflow Platform",
  description: "AI-powered change orders, T&M tickets, and field documentation for construction teams.",
  keywords: ["construction", "change orders", "T&M tickets", "field documentation", "AI", "GC", "subcontractor"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full bg-surface-50 font-sans antialiased">{children}</body>
    </html>
  );
}
