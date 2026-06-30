"use client";

import { useState } from "react";
import Card from "@/components/Card";
import { startupData } from "@/lib/mockData";

export default function Home() {
  const [analysis, setAnalysis] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [context, setContext] = useState("");
  const [goal, setGoal] = useState("Reach 100 paying customers");
  const [loading, setLoading] = useState(false);

  const analyzeStartup = async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          goal,
          context,
        }),
      });

      const data = await response.json();
console.log(data);

      console.log(data.analysis);

      setAnalysis(data.analysis);

const previousReports = JSON.parse(
  localStorage.getItem("reports") || "[]"
);

previousReports.unshift({
  id: Date.now(),
  date: new Date().toLocaleString(),
  goal,
  healthScore: data.analysis.healthScore,
  risks: data.analysis.risks,
  opportunities: data.analysis.opportunities,
  nextActions: data.analysis.nextActions,
});

localStorage.setItem(
  "reports",
  JSON.stringify(previousReports)
);
console.log(previousReports);

setHistory((prev) => [data.analysis, ...prev]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const healthScore = analysis?.healthScore ?? startupData.healthScore;
  const healthPct = Math.min(Math.max(healthScore, 0), 100);

  return (
    <main className="relative min-h-screen overflow-x-hidden px-4 py-14 sm:px-8 lg:px-12">
      {/* Ambient background orbs */}
      <div className="pointer-events-none fixed left-1/2 top-[-10%] -z-10 h-[480px] w-[780px] -translate-x-1/2 rounded-full bg-indigo-600/20 blur-[120px]" />
      <div className="pointer-events-none fixed bottom-[-15%] right-[-10%] -z-10 h-[420px] w-[420px] rounded-full bg-cyan-500/10 blur-[120px]" />

      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="fade-up mb-14 flex flex-col gap-3">
          <span className="glass inline-flex w-fit items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium text-[var(--text-muted)]">
            <span className="glow-pulse h-1.5 w-1.5 rounded-full bg-violet-400 shadow-[0_0_8px_2px_rgba(139,92,246,0.6)]" />
            AI-powered startup intelligence
          </span>
          <h1 className="shimmer-text text-5xl font-semibold tracking-tight sm:text-6xl">
            StartupOS
          </h1>
          <p className="max-w-xl text-[15px] leading-relaxed text-[var(--text-muted)]">
            Set your goal, drop in your latest notes, and get a clear read on
            risk, momentum, and what to do next.
          </p>
        </div>

        {/* Input panel */}
        <div
          className="glass fade-up mb-12 rounded-[20px] p-6 sm:p-8"
          style={{ animationDelay: "80ms" }}
        >
          <div className="grid gap-6">
            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-[0.1em] text-[var(--text-muted)]">
                Startup goal
              </label>
              <input
                type="text"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="Enter startup goal"
                className="w-full rounded-2xl border border-[var(--border-subtle)] bg-white/[0.03] px-4 py-3.5 text-[15px] text-[var(--foreground)] outline-none transition-all duration-200 placeholder:text-[var(--text-faint)] hover:border-white/[0.14] focus:border-indigo-400/50 focus:bg-white/[0.05] focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-[0.1em] text-[var(--text-muted)]">
                Context
              </label>
              <textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="Paste meeting notes, customer feedback, startup updates..."
                className="w-full resize-y rounded-2xl border border-[var(--border-subtle)] bg-white/[0.03] px-4 py-3.5 text-[15px] leading-relaxed text-[var(--foreground)] outline-none transition-all duration-200 placeholder:text-[var(--text-faint)] hover:border-white/[0.14] focus:border-indigo-400/50 focus:bg-white/[0.05] focus:ring-4 focus:ring-indigo-500/10"
                rows={8}
              />
            </div>

            <div>
              <button
                onClick={analyzeStartup}
                disabled={loading}
                className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-500 bg-[length:200%_auto] px-6 py-3 text-[14px] font-medium text-white shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_8px_24px_-8px_rgba(99,102,241,0.6)] transition-all duration-300 hover:bg-right hover:shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_8px_32px_-6px_rgba(99,102,241,0.8)] active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-left"
              >
                {loading && (
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                )}
                {loading ? "Analyzing..." : "Analyze Startup"}
              </button>
            </div>
          </div>
        </div>

        {/* Results grid */}
        <div className="grid gap-5 md:grid-cols-2">
          <Card title="Goal">
            <p className="font-medium leading-relaxed">{goal}</p>
          </Card>

          <Card title="Health Score">
            <div className="flex items-end gap-2">
              <span className="text-4xl font-semibold tabular-nums tracking-tight text-white">
                {healthScore}
              </span>
              <span className="mb-1 text-sm text-[var(--text-faint)]">
                / 100
              </span>
            </div>
            <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-violet-400 to-indigo-400 transition-all duration-700 ease-out"
                style={{ width: `${healthPct}%` }}
              />
            </div>
          </Card>

          <Card title="Top Risks">
            <ul className="space-y-2.5">
              {(analysis?.risks ?? startupData.risks).map((risk: string) => (
                <li key={risk} className="flex items-start gap-2.5 text-sm">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-400 shadow-[0_0_6px_1px_rgba(251,113,133,0.5)]" />
                  <span className="text-[var(--foreground)]/90">{risk}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card title="Opportunities">
            <ul className="space-y-2.5">
              {(analysis?.opportunities ?? startupData.opportunities).map(
                (item: string) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_6px_1px_rgba(52,211,153,0.5)]" />
                    <span className="text-[var(--foreground)]/90">{item}</span>
                  </li>
                )
              )}
            </ul>
          </Card>

          <Card title="Next Actions">
            <ul className="space-y-2.5">
              {(analysis?.nextActions ?? startupData.nextActions).map(
                (action: string) => (
                  <li key={action} className="flex items-start gap-2.5 text-sm">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400 shadow-[0_0_6px_1px_rgba(129,140,248,0.5)]" />
                    <span className="text-[var(--foreground)]/90">{action}</span>
                  </li>
                )
              )}
            </ul>
          </Card>
        </div>
      </div>
    </main>
  );
}
