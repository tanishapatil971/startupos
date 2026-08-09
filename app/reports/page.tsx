"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import Badge from "@/components/Badge";

export default function ReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
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

  return (
    <>
      <PageHeader 
        title="Analysis History" 
        description="Review past strategic reports and track changes in your startup's trajectory." 
      />

      {reports.length === 0 ? (
        <EmptyState 
          title="No Reports Generated" 
          description="Go to the Command Center to run your first startup analysis."
          icon="📂"
        />
      ) : (
        <div className="grid gap-4">
          {reports.map((report) => (
            <Link
              key={report.id}
              href={`/reports/${report.id}`}
              className="glass group flex flex-col justify-between gap-4 rounded-2xl p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-500/30 hover:bg-white/[0.04] sm:flex-row sm:items-center"
            >
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-3">
                  <h2 className="text-lg font-semibold text-white group-hover:text-indigo-400 transition-colors">
                    {report.goal || "Startup Analysis"}
                  </h2>
                  <Badge variant={report.health_score >= 80 ? "success" : report.health_score >= 50 ? "warning" : "risk"}>
                    Score: {report.health_score}
                  </Badge>
                </div>
                
                <p className="text-sm text-[var(--text-muted)]">
                  {new Date(report.created_at).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
                
                {report.risks && report.risks.length > 0 && (
                  <p className="mt-3 text-sm text-[var(--text-faint)] line-clamp-1">
                    <span className="font-medium text-[var(--text-muted)]">Top Risk:</span> {report.risks[0]}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 text-sm font-medium text-indigo-400 opacity-80 transition-opacity group-hover:opacity-100">
                View Details
                <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}