"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

export default function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { session, isLoading, hasCompany } = useAuth();

  const isPublicRoute = pathname === "/login" || pathname === "/landing";

  useEffect(() => {
    if (isPublicRoute || isLoading) return;

    if (!session) {
      router.push("/landing");
      return;
    }

    if (hasCompany === false && pathname !== "/onboarding") {
      router.push("/onboarding");
      return;
    }

    if (hasCompany === true && pathname === "/onboarding") {
      router.push("/");
      return;
    }
  }, [pathname, router, session, isLoading, hasCompany, isPublicRoute]);

  // Derive checking state from context — no setState needed
  const checking = !isPublicRoute && (isLoading || hasCompany === null);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center text-white">
        Loading StartupOS...
      </div>
    );
  }

  return children;
}