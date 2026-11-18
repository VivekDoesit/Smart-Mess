import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: "Smart Mess — Eat Smart. Waste Less. 🌱",
  description:
    "Hostel Food Waste Reduction & Meal Management Platform. Students indicate meal attendance in advance so mess kitchens can prepare exact quantities.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#FAF9F5] text-[#1F281B] antialiased min-h-screen">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
