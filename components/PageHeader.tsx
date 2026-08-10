type PageHeaderProps = {
  title: string;
  description: string;
  action?: React.ReactNode;
};

export default function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
          {title}
        </h1>
        <p className="mt-1 text-[14px] text-[var(--text-secondary)]">
          {description}
        </p>
      </div>
      {action && <div className="w-full sm:w-auto">{action}</div>}
    </div>
  );
}
