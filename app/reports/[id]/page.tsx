"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import PageHeader from "@/components/PageHeader";
import Card from "@/components/Card";
import Badge from "@/components/Badge";

export default function ReportDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReport() {
      if (!id) return;

      const { data: { user } } = await supabase.auth.getUser();
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
        console.error("Report not found", error);
        router.push("/reports");
        return;
      }

      setReport(data);
      setLoading(false);
    }
    loadReport();
  }, [id, router]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500/30 border-t-indigo-500" />
      </div>
    );
  }

  if (!report) return null;

  return (
    <>
      <div className="mb-6 fade-up">
        <button 
          onClick={() => router.push("/reports")}
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--text-muted)] transition-colors hover:text-white"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Reports
        </button>
      </div>

      <PageHeader 
        title="Analysis Report" 
        description={new Date(report.created_at).toLocaleDateString(undefined, {
          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
          hour: '2-digit', minute: '2-digit'
        })}
        action={
          <Badge variant={report.health_score >= 80 ? "success" : report.health_score >= 50 ? "warning" : "risk"}>
            Health Score: {report.health_score}/100
          </Badge>
        }
      />

      <div className="grid gap-6">
        <Card title="Strategic Goal">
          <p className="text-lg font-medium text-white">{report.goal}</p>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card title="Identified Risks" className="border-rose-500/20 bg-rose-500/5">
            {report.risks && report.risks.length > 0 ? (
              <ul className="space-y-3">
                {report.risks.map((risk: string, i: number) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-400" />
                    <span className="text-[15px] text-rose-100/90">{risk}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[var(--text-muted)]">No major risks identified.</p>
            )}
          </Card>

          <Card title="Opportunities" className="border-emerald-500/20 bg-emerald-500/5">
            {report.opportunities && report.opportunities.length > 0 ? (
              <ul className="space-y-3">
                {report.opportunities.map((item: string, i: number) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                    <span className="text-[15px] text-emerald-100/90">{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[var(--text-muted)]">No major opportunities identified.</p>
            )}
          </Card>
        </div>

        <Card title="Recommended Actions">
          {report.next_actions && report.next_actions.length > 0 ? (
            <div className="space-y-4">
              {report.next_actions.map((action: string, i: number) => (
                <div key={i} className="flex items-start gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-4">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-xs font-bold text-indigo-400">
                    {i + 1}
                  </div>
                  <span className="text-[15px] text-white/90">{action}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[var(--text-muted)]">No recommended actions.</p>
          )}
        </Card>
        
        {report.roadmap && report.roadmap.length > 0 && (
          <Card title="Roadmap Context">
            <div className="space-y-4">
              {report.roadmap.map((item: any, index: number) => (
                <div key={index} className="flex items-start justify-between gap-4 border-b border-white/5 pb-4 last:border-0 last:pb-0">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400">{item.week}</p>
                    <p className="mt-1 font-medium text-white">{item.title}</p>
                  </div>
                  <Badge variant="default">{item.status}</Badge>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </>
  );
}