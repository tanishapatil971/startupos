"use client";

import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  async function loginWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:3000",
      },
    });

    console.log(data);
    console.log(error);
  }

  return (
    <main className="flex min-h-screen items-center justify-center text-white">

      <div className="glass w-[420px] rounded-3xl p-10 text-center">

        <h1 className="shimmer-text text-5xl font-bold">
          StartupOS
        </h1>

        <p className="mt-4 text-gray-400">
          Sign in to your AI founder workspace.
        </p>

        <button
          onClick={loginWithGoogle}
          className="
            mt-10 w-full rounded-2xl
            bg-white text-black
            px-6 py-4
            font-semibold
            transition
            hover:scale-[1.02]
          "
        >
          Continue with Google
        </button>

      </div>

    </main>
  );
}