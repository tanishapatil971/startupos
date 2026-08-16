"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
    // Only logging the error name to prevent leaking sensitive information in the browser console
    console.error("Global error boundary caught error:", error.name);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#020617",
          color: "#ffffff",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            textAlign: "center",
            maxWidth: "480px",
          }}
        >
          <div
            style={{
              marginBottom: "1.5rem",
              display: "flex",
              height: "3.5rem",
              width: "3.5rem",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "1rem",
              backgroundColor: "rgba(244, 63, 94, 0.1)",
              color: "#f43f5e",
            }}
          >
            <svg
              style={{ height: "1.75rem", width: "1.75rem" }}
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
          <h2
            style={{
              marginBottom: "0.5rem",
              fontSize: "1.25rem",
              fontWeight: 600,
            }}
          >
            Something went wrong
          </h2>
          <p
            style={{
              marginBottom: "2rem",
              fontSize: "0.875rem",
              lineHeight: 1.6,
              color: "#94a3b8",
            }}
          >
            A critical error occurred while loading the application. Please try
            again. If the problem persists, contact support.
          </p>
          <button
            onClick={() => reset()}
            style={{
              borderRadius: "0.5rem",
              backgroundColor: "#6366f1",
              paddingLeft: "1.25rem",
              paddingRight: "1.25rem",
              paddingTop: "0.625rem",
              paddingBottom: "0.625rem",
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "#ffffff",
              border: "none",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
