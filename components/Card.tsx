type CardProps = {
  title: string;
  children: React.ReactNode;
};

export default function Card({ title, children }: CardProps) {
  return (
    <div className="group relative fade-up">
      {/* Glow that appears behind the card on hover */}
      <div className="pointer-events-none absolute -inset-px rounded-[20px] bg-gradient-to-br from-indigo-500/0 via-violet-500/0 to-cyan-400/0 opacity-0 blur-xl transition-opacity duration-500 group-hover:from-indigo-500/30 group-hover:via-violet-500/20 group-hover:to-cyan-400/20 group-hover:opacity-100" />

      <div className="glass relative rounded-[20px] p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-white/[0.14] sm:p-7">
        <div className="mb-4 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500" />
          <h2 className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--text-muted)]">
            {title}
          </h2>
        </div>
        <div className="text-[15px] leading-relaxed text-[var(--foreground)]">
          {children}
        </div>
      </div>
    </div>
  );
}
