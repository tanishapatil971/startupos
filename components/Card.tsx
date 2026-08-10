import { ReactNode } from "react";

type CardProps = {
  title?: string;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
  padding?: "default" | "compact" | "none";
};

export default function Card({ title, children, action, className = "", padding = "default" }: CardProps) {
  const padClass = padding === "none" ? "" : padding === "compact" ? "p-4 sm:p-5" : "p-5 sm:p-6";

  return (
    <div
      className={`relative flex h-full flex-col rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-raised)] ${padClass} ${className}`}
    >
      {title && (
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[13px] font-medium text-[var(--text-secondary)]">
            {title}
          </h2>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="flex-1 text-[14px] leading-relaxed text-[var(--text-primary)]">
        {children}
      </div>
    </div>
  );
}
