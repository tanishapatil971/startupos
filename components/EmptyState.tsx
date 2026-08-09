import { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description: string;
  icon?: ReactNode;
  action?: ReactNode;
};

export default function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div className="glass flex flex-col items-center justify-center rounded-3xl p-12 text-center fade-up">
      {icon && <div className="mb-4 text-4xl opacity-50">{icon}</div>}
      <h3 className="mb-2 text-lg font-medium text-white">{title}</h3>
      <p className="mb-6 max-w-sm text-sm text-[var(--text-muted)]">
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
}
