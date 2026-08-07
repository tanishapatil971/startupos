"use client";

import { usePathname } from "next/navigation";

import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import AuthGuard from "@/components/AuthGuard";

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // pages without dashboard layout
  if (pathname === "/login" || pathname === "/landing") {
    return children;
  }

  return (
    <AuthGuard>

      <div className="flex min-h-screen">

        <Sidebar />

        <div className="flex flex-1 flex-col">

          <Topbar />

          <main className="flex-1 overflow-y-auto">
            {children}
          </main>

        </div>

      </div>

    </AuthGuard>
  );
}