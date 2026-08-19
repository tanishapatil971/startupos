"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import PageHeader from "@/components/PageHeader";
import Badge from "@/components/Badge";

interface RoadmapItem {
  week: string;
  title: string;
  status: string;
}

interface Report {
  id: string;
  user_id?: string;
  goal: string;
  health_score: number;
  risks: string[] | null;
  opportunities: string[] | null;
  next_actions?: string[] | null;
  roadmap?: RoadmapItem[] | null;
  created_at: string;
}

export default function ComparePage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [first, setFirst] = useState<Report | null>(null);
  const [second, setSecond] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReports() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("reports")
        .select("id, created_at, goal, health_score, risks, opportunities")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50);

      if (!error && data) {
        setReports(data);
        if (data.length >= 2) {
          setFirst(data[1]);
          setSecond(data[0]);
        }
      }
      setLoading(false);
    }
    loadReports();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-[var(--accent)]/30 border-t-[var(--accent)]" />
      </div>
    );
  }

  if (reports.length < 2) {
    return (
      <>
        <PageHeader title="Compare Analyses" description="Track how your startup strategy improves over time." />
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-8 text-center sm:p-12">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent-subtle)]">
            <svg className="h-5 w-5 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
            </svg>
          </div>
          <h3 className="mb-1.5 text-[15px] font-medium text-white">Not Enough Data</h3>
          <p className="mx-auto max-w-sm text-[13px] text-[var(--text-secondary)]">
            You need at least two analysis reports to perform a comparison. Run another analysis from the Dashboard.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader 
        title="Compare Analyses" 
        description="Track how your startup strategy and health evolve between updates." 
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-4">
          <label className="mb-2 block text-[11px] font-medium uppercase tracking-wider text-[var(--text-secondary)]">
            Previous State
          </label>
          <select
            className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2 text-[14px] text-white outline-none transition-colors focus:border-[var(--accent)]/50"
            value={first?.id || ""}
            onChange={(e) => setFirst(reports.find((r) => r.id.toString() === e.target.value) ?? null)}
          >
            <option value="" disabled className="bg-slate-900 text-white">Select Report</option>
            {reports.map((r) => (
              <option className="bg-slate-900 text-white" key={r.id} value={r.id}>
                {new Date(r.created_at).toLocaleDateString()} - {r.goal || "Analysis"}
              </option>
            ))}
          </select>
        </div>

        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-4">
          <label className="mb-2 block text-[11px] font-medium uppercase tracking-wider text-[var(--text-secondary)]">
            Current State
          </label>
          <select
            className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2 text-[14px] text-white outline-none transition-colors focus:border-[var(--accent)]/50"
            value={second?.id || ""}
            onChange={(e) => setSecond(reports.find((r) => r.id.toString() === e.target.value) ?? null)}
          >
            <option value="" disabled className="bg-slate-900 text-white">Select Report</option>
            {reports.map((r) => (
              <option className="bg-slate-900 text-white" key={r.id} value={r.id}>
                {new Date(r.created_at).toLocaleDateString()} - {r.goal || "Analysis"}
              </option>
            ))}
          </select>
        </div>
      </div>

      {first && second && (
        <div className="grid gap-6 lg:grid-cols-2">
          {[first, second].map((report, index) => {
            const isLatest = index === 1;
            const healthDiff = isLatest ? second.health_score - first.health_score : 0;

            return (
              <div key={index} className="space-y-5">
                <div className={`rounded-xl border ${isLatest ? "border-[var(--accent)]/30 bg-[var(--accent)]/5" : "border-[var(--border-subtle)] bg-[var(--surface-raised)]"} p-5`}>
                  <div className="mb-5 flex items-start justify-between border-b border-[var(--border-subtle)] pb-4">
                    <div>
                      <p className="text-[12px] font-medium text-[var(--text-secondary)]">
                        {isLatest ? "Current State" : "Previous State"}
                      </p>
                      <h3 className="mt-1 text-[15px] font-medium text-white">{report.goal || "Startup Analysis"}</h3>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] font-medium text-[var(--text-secondary)]">Health</span>
                        <span className="text-xl font-bold text-white">{report.health_score}</span>
                      </div>
                      {isLatest && healthDiff !== 0 && (
                        <Badge variant={healthDiff > 0 ? "success" : "risk"}>
                          {healthDiff > 0 ? "+" : ""}{healthDiff} pts
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="mb-3 text-[13px] font-medium text-[var(--text-secondary)]">Risks</h4>
                      {report.risks && report.risks.length > 0 ? (
                        <ul className="space-y-2.5">
                          {report.risks.map((risk: string, i: number) => (
                            <li key={i} className="flex items-start gap-2.5 text-[14px] leading-relaxed text-white/80">
                              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-rose-400" />
                              {risk}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-[14px] text-[var(--text-tertiary)]">No major risks identified.</p>
                      )}
                    </div>

                    <div>
                      <h4 className="mb-3 text-[13px] font-medium text-[var(--text-secondary)]">Opportunities</h4>
                      {report.opportunities && report.opportunities.length > 0 ? (
                        <ul className="space-y-2.5">
                          {report.opportunities.map((item: string, i: number) => (
                            <li key={i} className="flex items-start gap-2.5 text-[14px] leading-relaxed text-white/80">
                              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-emerald-400" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-[14px] text-[var(--text-tertiary)]">No major opportunities identified.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}