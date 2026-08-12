"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center p-8 text-center fade-up">
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-500">
        <svg
          className="h-7 w-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.072 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      </div>
      <h2 className="mb-2 text-xl font-semibold text-white">Something went wrong</h2>
      <p className="mb-8 max-w-md text-[14px] leading-relaxed text-[var(--text-secondary)]">
        A critical error occurred while loading this page. Our team has been notified.
      </p>
      <div className="flex items-center gap-3">
        <button
          onClick={() => reset()}
          className="rounded-lg bg-[var(--accent)] px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-[var(--accent-hover)]"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-white/[0.05]"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
