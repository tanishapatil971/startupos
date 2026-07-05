"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 min-h-screen border-r border-white/10 bg-white/[0.03] backdrop-blur-xl p-6">

      <div className="mb-10">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
          StartupOS
        </h1>

        <p className="text-xs text-gray-500 mt-2">
          AI Strategic Co-Founder
        </p>
      </div>

      <nav className="space-y-2">
        {links.map((link) => {
          const active = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`
                flex items-center rounded-xl px-4 py-3
                transition-all duration-200
                ${
                  active
                    ? "bg-indigo-500/20 text-white border border-indigo-400/30 shadow-lg shadow-indigo-500/10"
                    : "text-gray-400 hover:text-white hover:bg-white/[0.06]"
                }
              `}
            >
              {link.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}