import { ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
  variant?: "success" | "risk" | "warning" | "info" | "default";
};

const variantStyles = {
  success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  risk: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  info: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  default: "bg-white/[0.05] text-gray-300 border-white/10",
};

export default function Badge({ children, variant = "default" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors ${variantStyles[variant]}`}
    >
      {children}
    </span>
  );
}
