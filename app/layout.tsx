import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";

import AppShell from "@/components/AppShell";
import { AuthProvider } from "@/components/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StartupOS",
  description: "AI Strategic Co-Founder",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="bg-slate-950 text-white">
        <Script
  src="https://accounts.google.com/gsi/client"
  strategy="beforeInteractive"
/>

        <AuthProvider>
          <AppShell>
            {children}
          </AppShell>
        </AuthProvider>

      </body>
    </html>
  );
}