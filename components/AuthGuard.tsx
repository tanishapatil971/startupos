"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { usePathname, useRouter } from "next/navigation";

export default function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkUser() {

      // allow login page
      if (pathname === "/login") {
        setChecking(false);
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
      } else {
        setChecking(false);
      }
    }

    checkUser();

  }, [pathname, router]);


  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center text-white">
        Loading StartupOS...
      </div>
    );
  }


  return children;
}