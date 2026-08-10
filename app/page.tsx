"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import PageHeader from "@/components/PageHeader";
import Badge from "@/components/Badge";

export default function Home() {
  const [report, setReport] = useState<any>(null);
  const [allReports, setAllReports] = useState<any[]>([]);
  const [context, setContext] = useState("");
  const [goal, setGoal] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingInitial, setFetchingInitial] = useState(true);
  const trendCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("reports")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20);

      if (!error && data && data.length > 0) {
        setReport(data[0]);
        setAllReports(data);
        if (data[0].goal) setGoal(data[0].goal);
      }
      setFetchingInitial(false);
    }
    loadData();
  }, []);

  // Draw health trend chart
  useEffect(() => {
    if (!trendCanvasRef.current || allReports.length < 2) return;
    const canvas = trendCanvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const W = rect.width;
    const H = rect.height;
    const paddingTop = 20;
    const paddingBottom = 28;
    const paddingLeft = 32;
    const paddingRight = 16;
    const chartW = W - paddingLeft - paddingRight;
    const chartH = H - paddingTop - paddingBottom;

    // Data is newest first, reverse for chronological
    const data = [...allReports].reverse();

    ctx.clearRect(0, 0, W, H);

    // Y-axis lines
    ctx.strokeStyle = "rgba(255,255,255,0.05)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = paddingTop + (chartH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(paddingLeft, y);
      ctx.lineTo(W - paddingRight, y);
      ctx.stroke();
    }

    // Y-axis labels
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.font = "11px -apple-system, sans-serif";
    ctx.textAlign = "right";
    for (let i = 0; i <= 4; i++) {
      const y = paddingTop + (chartH / 4) * i;
      const val = 100 - i * 25;
      ctx.fillText(String(val), paddingLeft - 8, y + 4);
    }

    // Map data points
    const points = data.map((r: any, i: number) => ({
      x: paddingLeft + (data.length === 1 ? chartW / 2 : (i / (data.length - 1)) * chartW),
      y: paddingTop + chartH - (Math.min(Math.max(r.health_score, 0), 100) / 100) * chartH,
      score: r.health_score,
      date: new Date(r.created_at),
    }));

    // Area fill
    const gradient = ctx.createLinearGradient(0, paddingTop, 0, H);
    gradient.addColorStop(0, "rgba(99, 102, 241, 0.15)");
    gradient.addColorStop(1, "rgba(99, 102, 241, 0.0)");
    ctx.beginPath();
    ctx.moveTo(points[0].x, H - paddingBottom);
    points.forEach((p) => ctx.lineTo(p.x, p.y));
    ctx.lineTo(points[points.length - 1].x, H - paddingBottom);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Line
    ctx.beginPath();
    ctx.strokeStyle = "#6366f1";
    ctx.lineWidth = 2;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    points.forEach((p, i) => {
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.stroke();

    // Dots
    points.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = "#6366f1";
      ctx.fill();
      ctx.strokeStyle = "#0a0b10";
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // X-axis date labels
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.font = "10px -apple-system, sans-serif";
    ctx.textAlign = "center";
    const labelCount = Math.min(points.length, 6);
    const step = Math.max(1, Math.floor(points.length / labelCount));
    for (let i = 0; i < points.length; i += step) {
      const p = points[i];
      ctx.fillText(
        p.date.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
        p.x,
        H - 6
      );
    }
    // Always show last label
    if (points.length > 1) {
      const last = points[points.length - 1];
      ctx.fillText(
        last.date.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
        last.x,
        H - 6
      );
    }
  }, [allReports]);

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
        setAllReports((prev) => [insertedReport, ...prev]);
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

  function getHealthStatus(score: number) {
    if (score >= 80) return { label: "Strong", variant: "success" as const, desc: "Your startup is in a healthy position. Keep executing." };
    if (score >= 60) return { label: "Moderate", variant: "warning" as const, desc: "Some areas need attention. Review the risks and actions below." };
    if (score >= 40) return { label: "Needs attention", variant: "warning" as const, desc: "Several areas require focus. Prioritize the recommended actions." };
    return { label: "Critical", variant: "risk" as const, desc: "Your startup health is low. Immediate action on the items below is recommended." };
  }

  const healthStatus = getHealthStatus(healthScore);

  // Compute trend from previous report
  const previousReport = allReports.length > 1 ? allReports[1] : null;
  const healthDiff = previousReport ? healthScore - previousReport.health_score : null;

  if (fetchingInitial) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-[var(--accent)]/30 border-t-[var(--accent)]" />
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Your startup health, priorities, and latest intelligence."
      />

      {/* New Analysis Input */}
      <section className="mb-8 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-5 sm:p-6 fade-up" aria-label="Run new analysis">
        <h2 className="mb-3 text-[13px] font-medium text-[var(--text-secondary)]">
          New Analysis
        </h2>
        <div className="grid gap-4">
          <input
            type="text"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="Current startup goal (e.g. Reach $10k MRR)"
            className="w-full rounded-lg border border-[var(--border-subtle)] bg-white/[0.03] px-3.5 py-2.5 text-[14px] text-white outline-none transition-colors placeholder:text-[var(--text-tertiary)] focus:border-[var(--accent)]/50"
            id="goal-input"
          />
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Paste recent updates, meeting notes, or challenges for a new analysis..."
            className="w-full resize-y rounded-lg border border-[var(--border-subtle)] bg-white/[0.03] px-3.5 py-2.5 text-[14px] text-white outline-none transition-colors placeholder:text-[var(--text-tertiary)] focus:border-[var(--accent)]/50"
            rows={3}
            id="context-input"
          />
          <div className="flex justify-end">
            <button
              onClick={analyzeStartup}
              disabled={loading || !goal || !context}
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-5 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[var(--accent-hover)] disabled:opacity-50 disabled:hover:bg-[var(--accent)]"
              id="run-analysis-btn"
            >
              {loading && <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />}
              {loading ? "Analyzing..." : "Run Analysis"}
            </button>
          </div>
        </div>
      </section>

      {report ? (
        <div className="space-y-6">

          {/* ====== SECTION 1: Health + Goal ====== */}
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="Startup health overview">
            {/* Health Score */}
            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-5 sm:col-span-1 lg:col-span-2">
              <div className="mb-1 text-[13px] font-medium text-[var(--text-secondary)]">Startup Health</div>
              <div className="flex items-start gap-5 sm:items-center">
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-bold tracking-tight text-white">{healthScore}</span>
                  <span className="text-[11px] text-[var(--text-tertiary)]">/ 100</span>
                </div>
                <div className="flex-1">
                  {/* Progress bar */}
                  <div className="mb-2 h-2 overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{
                        width: `${healthPct}%`,
                        backgroundColor: healthScore >= 80 ? "var(--semantic-success)" : healthScore >= 50 ? "var(--semantic-warning)" : "var(--semantic-risk)",
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={healthStatus.variant}>{healthStatus.label}</Badge>
                    {healthDiff !== null && healthDiff !== 0 && (
                      <span className={`text-[12px] font-medium ${healthDiff > 0 ? "text-emerald-400" : "text-rose-400"}`}>
                        {healthDiff > 0 ? "+" : ""}{healthDiff} pts
                      </span>
                    )}
                  </div>
                  <p className="mt-1.5 text-[13px] text-[var(--text-secondary)]">{healthStatus.desc}</p>
                </div>
              </div>
              <div className="mt-3 border-t border-[var(--border-subtle)] pt-3">
                <Link
                  href="/reports"
                  className="text-[13px] font-medium text-[var(--accent)] transition-colors hover:text-[var(--accent-hover)]"
                >
                  View latest analysis →
                </Link>
              </div>
            </div>

            {/* Current Goal */}
            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-5">
              <div className="mb-1 text-[13px] font-medium text-[var(--text-secondary)]">Current Goal</div>
              <p className="text-[15px] font-medium text-white leading-snug">{report.goal}</p>
              <p className="mt-3 text-[12px] text-[var(--text-tertiary)]">
                Last updated {new Date(report.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
              </p>
            </div>
          </section>

          {/* ====== SECTION 2: Attention — Risk + Opportunity ====== */}
          <section className="grid gap-4 sm:grid-cols-2" aria-label="Items needing attention">
            {/* Top Risk */}
            <div className="rounded-xl border border-rose-500/15 bg-[var(--semantic-risk-subtle)] p-5">
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-md bg-rose-500/20">
                  <svg className="h-3 w-3 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.072 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-[13px] font-medium text-rose-300">Top Risk</h3>
              </div>
              {report.risks && report.risks.length > 0 ? (
                <>
                  <p className="text-[14px] leading-relaxed text-rose-100/90">{report.risks[0]}</p>
                  {report.risks.length > 1 && (
                    <p className="mt-3 text-[12px] text-rose-400/60">+{report.risks.length - 1} more identified</p>
                  )}
                </>
              ) : (
                <p className="text-[14px] text-[var(--text-secondary)]">No major risks identified.</p>
              )}
            </div>

            {/* Best Opportunity */}
            <div className="rounded-xl border border-emerald-500/15 bg-[var(--semantic-success-subtle)] p-5">
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-md bg-emerald-500/20">
                  <svg className="h-3 w-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-[13px] font-medium text-emerald-300">Best Opportunity</h3>
              </div>
              {report.opportunities && report.opportunities.length > 0 ? (
                <>
                  <p className="text-[14px] leading-relaxed text-emerald-100/90">{report.opportunities[0]}</p>
                  {report.opportunities.length > 1 && (
                    <p className="mt-3 text-[12px] text-emerald-400/60">+{report.opportunities.length - 1} more identified</p>
                  )}
                </>
              ) : (
                <p className="text-[14px] text-[var(--text-secondary)]">No major opportunities identified.</p>
              )}
            </div>
          </section>

          {/* ====== SECTION 3: Recommended Actions ====== */}
          <section aria-label="Recommended actions">
            <h2 className="mb-3 text-[13px] font-medium text-[var(--text-secondary)]">Recommended Actions</h2>
            {report.next_actions && report.next_actions.length > 0 ? (
              <div className="overflow-hidden rounded-xl border border-[var(--border-subtle)]">
                {report.next_actions.map((action: string, i: number) => (
                  <div
                    key={i}
                    className={`flex items-start gap-3.5 px-5 py-3.5 ${
                      i !== report.next_actions.length - 1 ? "border-b border-[var(--border-subtle)]" : ""
                    } ${i === 0 ? "bg-[var(--surface-raised)]" : "bg-[var(--surface)]"}`}
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[var(--accent-subtle)] text-[11px] font-bold text-[var(--accent)]">
                      {i + 1}
                    </span>
                    <div className="flex-1">
                      <span className="text-[14px] text-white/90">{action}</span>
                    </div>
                    {i === 0 && (
                      <Badge variant="warning">Priority</Badge>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-5 text-[14px] text-[var(--text-secondary)]">
                No recommended actions at this time.
              </div>
            )}
          </section>

          {/* ====== SECTION 4: Health Trend ====== */}
          <section aria-label="Health trend">
            <h2 className="mb-3 text-[13px] font-medium text-[var(--text-secondary)]">Health Trend</h2>
            {allReports.length >= 2 ? (
              <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-5">
                <canvas
                  ref={trendCanvasRef}
                  className="h-48 w-full sm:h-56"
                  aria-label={`Health trend chart showing ${allReports.length} data points`}
                  role="img"
                />
              </div>
            ) : (
              <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-5">
                <p className="text-[14px] text-[var(--text-secondary)]">
                  Run one more analysis to see your health trend over time. Each analysis adds a data point to track your startup&apos;s trajectory.
                </p>
              </div>
            )}
          </section>

          {/* ====== SECTION 5: Recent Intelligence ====== */}
          {allReports.length > 1 && (
            <section aria-label="Recent intelligence">
              <h2 className="mb-3 text-[13px] font-medium text-[var(--text-secondary)]">Recent Intelligence</h2>
              <div className="space-y-2">
                {allReports.slice(0, 3).map((r: any, i: number) => (
                  <Link
                    key={r.id}
                    href={`/reports/${r.id}`}
                    className="flex items-center justify-between gap-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-4 py-3 transition-colors hover:border-[var(--accent)]/30 hover:bg-white/[0.02]"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14px] font-medium text-white">{r.goal || "Analysis"}</p>
                      <p className="mt-0.5 text-[12px] text-[var(--text-tertiary)]">
                        {new Date(r.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={r.health_score >= 80 ? "success" : r.health_score >= 50 ? "warning" : "risk"}>
                        {r.health_score}
                      </Badge>
                      <svg className="h-3.5 w-3.5 text-[var(--text-tertiary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-8 text-center sm:p-12 fade-up">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent-subtle)]">
            <svg className="h-5 w-5 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="mb-1.5 text-[15px] font-medium text-white">No Analysis Yet</h3>
          <p className="mx-auto max-w-sm text-[13px] text-[var(--text-secondary)]">
            Set your startup goal and provide context above to generate your first strategic analysis.
          </p>
        </div>
      )}
    </>
  );
}
