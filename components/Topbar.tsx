"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Topbar({
  onMenuClick,
}: {
  onMenuClick: () => void;
}) {
  const [user, setUser] = useState<any>(null);
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
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--background)]/80 px-4 backdrop-blur-xl md:px-8">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-[var(--text-muted)] hover:bg-white/[0.05] hover:text-white lg:hidden"
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

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-glass)] py-1 pl-1 pr-4 transition-colors hover:bg-white/[0.06]">
          {avatar && !imgError ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatar}
              onError={() => setImgError(true)}
              className="h-8 w-8 rounded-full object-cover"
              alt={`${name}'s profile`}
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500 text-xs font-medium text-white">
              {initials}
            </div>
          )}
          <div className="flex items-center gap-3">
            <span className="hidden text-sm font-medium sm:block">{name}</span>
            <button
              onClick={logout}
              className="text-xs font-medium text-[var(--text-muted)] transition-colors hover:text-rose-400"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}