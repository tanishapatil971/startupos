"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

export default function Topbar({
  onMenuClick,
}: {
  onMenuClick: () => void;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    async function loadUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        setUser(session.user);
      }
    }

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setUser(session.user);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  const name = user?.user_metadata?.full_name || "Founder";
  const avatar = user?.user_metadata?.avatar_url;
  const initials = name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-[var(--topbar-height)] shrink-0 items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--background)] px-4 md:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-md p-1.5 text-[var(--text-tertiary)] hover:bg-white/[0.04] hover:text-white lg:hidden"
          aria-label="Open menu"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          {avatar && !imgError ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatar}
              onError={() => setImgError(true)}
              className="h-7 w-7 rounded-full object-cover"
              alt={`${name}'s profile`}
            />
          ) : (
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--accent)] text-[11px] font-medium text-white">
              {initials}
            </div>
          )}
          <span className="hidden text-[13px] font-medium text-[var(--text-secondary)] sm:block">{name}</span>
          <button
            onClick={logout}
            className="ml-1 rounded-md px-2 py-1 text-[12px] font-medium text-[var(--text-tertiary)] transition-colors hover:text-rose-400"
            aria-label="Log out"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}