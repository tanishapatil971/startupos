"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import PageHeader from "@/components/PageHeader";
import Badge from "@/components/Badge";
import { useAuth } from "@/components/AuthProvider";

interface RoadmapItem {
  week: string;
  title: string;
  status: string;
}

interface Report {
  id: string;
  user_id: string;
  goal: string;
  health_score: number;
  risks: string[] | null;
  opportunities: string[] | null;
  next_actions: string[] | null;
  roadmap: RoadmapItem[] | null;
  created_at: string;
}

export default function ReportDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReport() {
      if (!id) return;

      if (!user) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("reports")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

      if (error || !data) {
        console.error("Report load failed");
        router.push("/reports");
        return;
      }

      setReport(data);
      setLoading(false);
    }
    loadReport();
  }, [id, router, user]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-[var(--accent)]/30 border-t-[var(--accent)]" />
      </div>
    );
  }

  if (!report) return null;

  const healthScore = report.health_score;
  const healthVariant = healthScore >= 80 ? "success" : healthScore >= 50 ? "warning" : "risk";

  return (
    <>
      {/* Back nav */}
      <div className="mb-4">
        <button
          onClick={() => router.push("/reports")}
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--text-secondary)] transition-colors hover:text-white"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Reports
        </button>
      </div>

      <PageHeader
        title={report.goal || "Analysis Report"}
        description={new Date(report.created_at).toLocaleDateString(undefined, {
          weekday: "long", year: "numeric", month: "long", day: "numeric",
          hour: "2-digit", minute: "2-digit"
        })}
        action={
          <Badge variant={healthVariant as "success" | "warning" | "risk"}>
            Health: {healthScore}/100
          </Badge>
        }
      />

      <div className="space-y-5">
        {/* Health bar */}
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-5">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[13px] font-medium text-[var(--text-secondary)]">Health Score</span>
            <span className="text-lg font-bold text-white">{healthScore}<span className="text-[13px] text-[var(--text-tertiary)]"> / 100</span></span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${Math.min(Math.max(healthScore, 0), 100)}%`,
                backgroundColor: healthScore >= 80 ? "var(--semantic-success)" : healthScore >= 50 ? "var(--semantic-warning)" : "var(--semantic-risk)",
              }}
            />
          </div>
        </div>

        {/* Risks & Opportunities */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Risks */}
          <div className="rounded-xl border border-rose-500/15 bg-[var(--semantic-risk-subtle)] p-5">
            <h2 className="mb-3 flex items-center gap-2 text-[13px] font-medium text-rose-300">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
              Risks ({report.risks?.length ?? 0})
            </h2>
            {report.risks && report.risks.length > 0 ? (
              <ul className="space-y-2.5">
                {report.risks.map((risk: string, i: number) => (
                  <li key={i} className="flex items-start gap-2.5 text-[14px] leading-relaxed text-rose-100/90">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-rose-400/60" />
                    {risk}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[14px] text-[var(--text-secondary)]">No major risks identified.</p>
            )}
          </div>

          {/* Opportunities */}
          <div className="rounded-xl border border-emerald-500/15 bg-[var(--semantic-success-subtle)] p-5">
            <h2 className="mb-3 flex items-center gap-2 text-[13px] font-medium text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Opportunities ({report.opportunities?.length ?? 0})
            </h2>
            {report.opportunities && report.opportunities.length > 0 ? (
              <ul className="space-y-2.5">
                {report.opportunities.map((item: string, i: number) => (
                  <li key={i} className="flex items-start gap-2.5 text-[14px] leading-relaxed text-emerald-100/90">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-emerald-400/60" />
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[14px] text-[var(--text-secondary)]">No major opportunities identified.</p>
            )}
          </div>
        </div>

        {/* Recommended Actions */}
        <div>
          <h2 className="mb-3 text-[13px] font-medium text-[var(--text-secondary)]">Recommended Actions</h2>
          {report.next_actions && report.next_actions.length > 0 ? (
            <div className="overflow-hidden rounded-xl border border-[var(--border-subtle)]">
              {report.next_actions?.map((action: string, i: number) => (
                <div key={i} className={`flex items-start gap-3.5 px-5 py-3.5 ${
                  i !== (report.next_actions?.length ?? 0) - 1 ? "border-b border-[var(--border-subtle)]" : ""
                } bg-[var(--surface-raised)]`}>
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[var(--accent-subtle)] text-[11px] font-bold text-[var(--accent)]">
                    {i + 1}
                  </span>
                  <span className="text-[14px] text-white/90">{action}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-5 text-[14px] text-[var(--text-secondary)]">
              No recommended actions.
            </div>
          )}
        </div>

        {/* Roadmap */}
        {report.roadmap && report.roadmap.length > 0 && (
          <div>
            <h2 className="mb-3 text-[13px] font-medium text-[var(--text-secondary)]">Roadmap</h2>
            <div className="overflow-hidden rounded-xl border border-[var(--border-subtle)]">
              {report.roadmap?.map((item, index: number) => (
                <div key={index} className={`flex items-center justify-between gap-4 px-5 py-3.5 ${
                  index !== (report.roadmap?.length ?? 0) - 1 ? "border-b border-[var(--border-subtle)]" : ""
                } bg-[var(--surface-raised)]`}>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--accent)]">{item.week}</p>
                    <p className="mt-0.5 text-[14px] font-medium text-white">{item.title}</p>
                  </div>
                  <Badge variant="default">{item.status}</Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}