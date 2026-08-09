import { ReactNode } from "react";

type CardProps = {
  title: string;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
};

export default function Card({ title, children, action, className = "" }: CardProps) {
  return (
    <div className={`glass relative flex h-full flex-col rounded-[20px] p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-white/[0.14] hover:bg-white/[0.04] sm:p-7 fade-up ${className}`}>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
          <h2 className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--text-muted)]">
            {title}
          </h2>
        </div>
        {action && <div>{action}</div>}
      </div>
      <div className="flex-1 text-[15px] leading-relaxed text-[var(--foreground)]">
        {children}
      </div>
    </div>
  );
}
