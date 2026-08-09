"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import PageHeader from "@/components/PageHeader";
import Card from "@/components/Card";
import EmptyState from "@/components/EmptyState";
import Badge from "@/components/Badge";

export default function ComparePage() {
  const [reports, setReports] = useState<any[]>([]);
  const [first, setFirst] = useState<any>(null);
  const [second, setSecond] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReports() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("reports")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

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
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500/30 border-t-indigo-500" />
      </div>
    );
  }

  if (reports.length < 2) {
    return (
      <>
        <PageHeader title="Compare Analyses" description="Track how your startup strategy improves over time." />
        <EmptyState
          title="Not Enough Data"
          description="You need at least two analysis reports to perform a comparison. Run another analysis in the Command Center."
          icon="⚖️"
        />
      </>
    );
  }

  return (
    <>
      <PageHeader 
        title="Compare Analyses" 
        description="Track how your startup strategy and health evolve between updates." 
      />

      <div className="glass fade-up mb-8 grid gap-4 rounded-[24px] p-6 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-[0.1em] text-[var(--text-muted)]">
            Previous State
          </label>
          <select
            className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-glass)] px-4 py-3 text-[15px] text-white outline-none transition-colors focus:border-indigo-500/50"
            value={first?.id || ""}
            onChange={(e) => setFirst(reports.find((r) => r.id.toString() === e.target.value))}
          >
            <option value="" disabled className="bg-slate-900 text-white">Select Report</option>
            {reports.map((r) => (
              <option className="bg-slate-900 text-white" key={r.id} value={r.id}>
                {new Date(r.created_at).toLocaleDateString()} - {r.goal || "Analysis"}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-[0.1em] text-[var(--text-muted)]">
            Current State
          </label>
          <select
            className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-glass)] px-4 py-3 text-[15px] text-white outline-none transition-colors focus:border-indigo-500/50"
            value={second?.id || ""}
            onChange={(e) => setSecond(reports.find((r) => r.id.toString() === e.target.value))}
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
              <div key={index} className="fade-up space-y-6" style={{ animationDelay: `${index * 100}ms` }}>
                <Card title={isLatest ? "Current State" : "Previous State"} className={isLatest ? "border-indigo-500/20 bg-indigo-500/5" : ""}>
                  <div className="mb-4">
                    <p className="text-sm text-[var(--text-muted)]">Goal</p>
                    <h3 className="text-lg font-medium text-white">{report.goal}</h3>
                  </div>

                  <div className="mb-6 flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.04] ring-1 ring-white/10">
                      <span className="text-2xl font-bold text-white">{report.health_score}</span>
                    </div>
                    {isLatest && healthDiff !== 0 && (
                      <Badge variant={healthDiff > 0 ? "success" : "risk"}>
                        {healthDiff > 0 ? "Improved by " : "Dropped by "}{Math.abs(healthDiff)} pts
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">Risks</h4>
                      {report.risks && report.risks.length > 0 ? (
                        <ul className="space-y-2">
                          {report.risks.map((risk: string, i: number) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-faint)]">
                              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-400" />
                              {risk}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-[var(--text-muted)]">None</p>
                      )}
                    </div>

                    <div>
                      <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">Opportunities</h4>
                      {report.opportunities && report.opportunities.length > 0 ? (
                        <ul className="space-y-2">
                          {report.opportunities.map((item: string, i: number) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-faint)]">
                              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-[var(--text-muted)]">None</p>
                      )}
                    </div>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}