"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { name: "Dashboard", href: "/" },
  { name: "Analytics", href: "/analytics" },
  { name: "AI Chat", href: "/chat" },
  { name: "Reports", href: "/reports" },
  { name: "Roadmap", href: "/roadmap" },
  { name: "Actions", href: "/actions" },
  { name: "Compare", href: "/compare" },
  { name: "Notifications", href: "/notifications" },
];

export default function Sidebar({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-[var(--border-subtle)] bg-[var(--surface)] transition-transform duration-300 lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-6">
          <div>
            <h1 className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-2xl font-bold tracking-tight text-transparent">
              StartupOS
            </h1>
            <p className="mt-1 text-xs font-medium text-[var(--text-muted)]">
              AI Strategic Co-Founder
            </p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 text-gray-400 hover:text-white lg:hidden"
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>

        <nav className="flex-1 space-y-1.5 overflow-y-auto p-4">
          {links.map((link) => {
            const active = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center rounded-xl px-4 py-2.5 text-[15px] font-medium transition-all duration-200
                  ${
                    active
                      ? "bg-indigo-500/10 text-indigo-400"
                      : "text-[var(--text-muted)] hover:bg-white/[0.04] hover:text-white"
                  }
                `}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}