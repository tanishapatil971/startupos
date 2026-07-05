"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Topbar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
  async function loadUser() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    console.log("SESSION:", session);

    if (session) {
      setUser(session.user);
    }
  }

  loadUser();

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(
    (event, session) => {
      console.log("AUTH CHANGE:", event, session);

      if (session) {
        setUser(session.user);
      }
    }
  );

  return () => {
    subscription.unsubscribe();
  };
}, []);

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  const name =
    user?.user_metadata?.full_name || "Founder";

  const avatar =
    user?.user_metadata?.avatar_url;

  return (
    <header
      className="
      h-20 border-b border-white/10
      bg-white/[0.02] backdrop-blur-xl
      flex items-center justify-between
      px-8
    "
    >

      <div>
        <h2 className="text-lg font-semibold">
          Dashboard
        </h2>

        <p className="text-sm text-gray-500">
          Welcome back, {name}
        </p>
      </div>


      <div className="flex items-center gap-4">

        <button
          className="
          rounded-xl bg-white/[0.05]
          border border-white/10
          px-4 py-2
        "
        >
          🔔
        </button>


        <div
          className="
          flex items-center gap-3
          rounded-2xl
          bg-white/[0.05]
          border border-white/10
          px-4 py-2
        "
        >

          {avatar ? (
            <img
              src={avatar}
              className="h-9 w-9 rounded-full"
              alt="profile"
            />
          ) : (
            <div
              className="
              flex h-9 w-9 items-center justify-center
              rounded-full bg-indigo-500
            "
            >
              {name[0]}
            </div>
          )}


          <div>
            <p className="text-sm font-medium">
              {name}
            </p>

            <button
              onClick={logout}
              className="text-xs text-gray-500 hover:text-white"
            >
              Logout
            </button>
          </div>

        </div>

      </div>

    </header>
  );
}