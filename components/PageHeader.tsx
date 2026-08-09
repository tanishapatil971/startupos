type PageHeaderProps = {
  title: string;
  description: string;
  action?: React.ReactNode;
};

export default function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
      <div className="fade-up">
        <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
          {title}
        </h1>
        <p className="mt-2 text-[15px] text-[var(--text-muted)]">
          {description}
        </p>
      </div>
      {action && <div className="fade-up w-full md:w-auto" style={{ animationDelay: "50ms" }}>{action}</div>}
    </div>
  );
}
