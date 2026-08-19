"use client";

import Link from "next/link";
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

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
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

  return (
    <>
      <PageHeader
        title="Reports"
        description="Review past strategic analyses and track changes in your startup's trajectory."
      />

      {reports.length === 0 ? (
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-8 text-center sm:p-12">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent-subtle)]">
            <svg className="h-5 w-5 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="mb-1.5 text-[15px] font-medium text-white">No Reports Yet</h3>
          <p className="mx-auto max-w-sm text-[13px] text-[var(--text-secondary)]">
            Go to the Dashboard to run your first startup analysis.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-[var(--border-subtle)]">
          {reports.map((report, i) => (
            <Link
              key={report.id}
              href={`/reports/${report.id}`}
              className={`group flex flex-col justify-between gap-3 px-5 py-4 transition-colors hover:bg-white/[0.02] sm:flex-row sm:items-center ${
                i !== reports.length - 1 ? "border-b border-[var(--border-subtle)]" : ""
              }`}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2.5">
                  <h2 className="truncate text-[14px] font-medium text-white transition-colors group-hover:text-[var(--accent)]">
                    {report.goal || "Startup Analysis"}
                  </h2>
                  <Badge variant={report.health_score >= 80 ? "success" : report.health_score >= 50 ? "warning" : "risk"}>
                    {report.health_score}
                  </Badge>
                </div>
                
                <div className="mt-1 flex items-center gap-3 text-[12px] text-[var(--text-tertiary)]">
                  <span>
                    {new Date(report.created_at).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  {report.risks && report.risks.length > 0 && (
                    <>
                      <span className="text-[var(--border-strong)]">·</span>
                      <span className="truncate">
                        {report.risks.length} risk{report.risks.length !== 1 ? "s" : ""}
                      </span>
                    </>
                  )}
                  {report.opportunities && report.opportunities.length > 0 && (
                    <>
                      <span className="text-[var(--border-strong)]">·</span>
                      <span className="truncate">
                        {report.opportunities.length} opportunit{report.opportunities.length !== 1 ? "ies" : "y"}
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-1.5 text-[13px] font-medium text-[var(--accent)] opacity-70 transition-opacity group-hover:opacity-100">
                View
                <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}