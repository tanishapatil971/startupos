"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Card from "@/components/Card";
import PageHeader from "@/components/PageHeader";
import Badge from "@/components/Badge";

export default function Home() {
  const [report, setReport] = useState<any>(null);
  const [context, setContext] = useState("");
  const [goal, setGoal] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingInitial, setFetchingInitial] = useState(true);

  useEffect(() => {
    async function loadLatestReport() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("reports")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (!error && data) {
        setReport(data);
        if (data.goal) setGoal(data.goal);
      }
      setFetchingInitial(false);
    }
    loadLatestReport();
  }, []);

  const analyzeStartup = async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal, context }),
      });

      const data = await response.json();
      if (!data.success) {
        console.error(data.error);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: insertedReport, error } = await supabase
        .from("reports")
        .insert({
          user_id: user.id,
          goal: goal,
          health_score: data.analysis.healthScore,
          risks: data.analysis.risks,
          opportunities: data.analysis.opportunities,
          next_actions: data.analysis.nextActions,
          roadmap: data.analysis.roadmap,
        })
        .select()
        .single();

      if (error) {
        console.error("DATABASE ERROR:", error);
      } else {
        setReport(insertedReport);
        setContext(""); // Clear context after success
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const healthScore = report?.health_score ?? 0;
  const healthPct = Math.min(Math.max(healthScore, 0), 100);

  if (fetchingInitial) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500/30 border-t-indigo-500" />
      </div>
    );
  }

  return (
    <>
      <PageHeader 
        title="Command Center" 
        description="Your startup's current health, strategic focus, and immediate execution plan."
      />

      {/* Input panel for new update */}
      <div className="glass fade-up mb-10 rounded-[24px] p-6 sm:p-8">
        <h2 className="mb-4 text-sm font-medium uppercase tracking-widest text-[var(--text-muted)]">
          Strategic Update
        </h2>
        <div className="grid gap-6">
          <div>
            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="Current Startup Goal (e.g. Reach $10k MRR)"
              className="w-full rounded-xl border border-[var(--border-subtle)] bg-white/[0.03] px-4 py-3 text-[15px] text-white outline-none transition-colors focus:border-indigo-500/50 focus:bg-white/[0.05]"
            />
          </div>
          <div>
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Paste recent updates, meeting notes, or challenges here to get a new analysis..."
              className="w-full resize-y rounded-xl border border-[var(--border-subtle)] bg-white/[0.03] px-4 py-3 text-[15px] text-white outline-none transition-colors focus:border-indigo-500/50 focus:bg-white/[0.05]"
              rows={4}
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={analyzeStartup}
              disabled={loading || !goal || !context}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-indigo-600 disabled:opacity-50 disabled:hover:bg-indigo-500"
            >
              {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />}
              {loading ? "Analyzing..." : "Run Analysis"}
            </button>
          </div>
        </div>
      </div>

      {report ? (
        <div className="grid gap-6 lg:grid-cols-3">
          
          {/* Health Score & Goal */}
          <div className="space-y-6 lg:col-span-1">
            <Card title="Startup Health" className="bg-gradient-to-br from-indigo-500/5 to-purple-500/5">
              <div className="flex flex-col items-center justify-center py-4">
                <div className="relative flex items-center justify-center">
                  <svg className="h-32 w-32 -rotate-90 transform">
                    <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                    <circle 
                      cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" 
                      strokeDasharray={351.8} 
                      strokeDashoffset={351.8 - (351.8 * healthPct) / 100}
                      className="text-indigo-400 transition-all duration-1000 ease-out" 
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold tracking-tighter text-white">{healthScore}</span>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <Badge variant={healthScore >= 80 ? "success" : healthScore >= 50 ? "warning" : "risk"}>
                    {healthScore >= 80 ? "On Track" : healthScore >= 50 ? "Needs Attention" : "High Risk"}
                  </Badge>
                </div>
              </div>
            </Card>

            <Card title="Current Goal">
              <p className="text-lg font-medium text-white">{report.goal}</p>
              <div className="mt-4 text-sm text-[var(--text-muted)]">
                Last updated {new Date(report.created_at).toLocaleDateString()}
              </div>
            </Card>
          </div>

          {/* Details (Risks, Opportunities, Actions) */}
          <div className="grid gap-6 sm:grid-cols-2 lg:col-span-2">
            
            <Card title="Top Risk" className="border-rose-500/20 bg-rose-500/5">
              <div className="flex flex-col h-full">
                {report.risks && report.risks.length > 0 ? (
                  <>
                    <p className="flex-1 font-medium text-rose-200">{report.risks[0]}</p>
                    {report.risks.length > 1 && (
                      <p className="mt-4 text-xs text-rose-400/70">+{report.risks.length - 1} more risks identified</p>
                    )}
                  </>
                ) : (
                  <p className="text-[var(--text-muted)]">No major risks identified.</p>
                )}
              </div>
            </Card>

            <Card title="Top Opportunity" className="border-emerald-500/20 bg-emerald-500/5">
              <div className="flex flex-col h-full">
                {report.opportunities && report.opportunities.length > 0 ? (
                  <>
                    <p className="flex-1 font-medium text-emerald-200">{report.opportunities[0]}</p>
                    {report.opportunities.length > 1 && (
                      <p className="mt-4 text-xs text-emerald-400/70">+{report.opportunities.length - 1} more opportunities</p>
                    )}
                  </>
                ) : (
                  <p className="text-[var(--text-muted)]">No major opportunities identified.</p>
                )}
              </div>
            </Card>

            <Card title="Immediate Actions" className="sm:col-span-2">
              {report.next_actions && report.next_actions.length > 0 ? (
                <ul className="space-y-3">
                  {report.next_actions.slice(0, 3).map((action: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 rounded-lg border border-white/5 bg-white/[0.02] p-3">
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-[10px] font-bold text-indigo-400">
                        {i + 1}
                      </div>
                      <span className="text-[14px] text-white/90">{action}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[var(--text-muted)]">No immediate actions recommended.</p>
              )}
            </Card>

          </div>
        </div>
      ) : (
        <div className="glass flex flex-col items-center justify-center rounded-[24px] p-12 text-center fade-up">
          <div className="mb-4 rounded-full bg-indigo-500/10 p-4 text-indigo-400">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-medium text-white">No Analysis Yet</h3>
          <p className="max-w-md text-sm text-[var(--text-muted)]">
            Set your startup goal and provide some context above to generate your first strategic analysis.
          </p>
        </div>
      )}
    </>
  );
}
