"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import PageHeader from "@/components/PageHeader";
import Badge from "@/components/Badge";

export default function AnalyticsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const healthCanvasRef = useRef<HTMLCanvasElement>(null);
  const riskCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    async function loadAnalytics() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("reports")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20);

      if (!error && data) {
        setReports(data);
      }
      setLoading(false);
    }

    loadAnalytics();
  }, []);

  // Shared chart drawing function
  function drawLineChart(
    canvas: HTMLCanvasElement,
    dataPoints: { value: number; date: Date }[],
    color: string,
    maxVal: number,
    label: string
  ) {
    const ctx = canvas.getContext("2d");
    if (!ctx || dataPoints.length === 0) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const W = rect.width;
    const H = rect.height;
    const padTop = 16;
    const padBottom = 28;
    const padLeft = 28;
    const padRight = 12;
    const chartW = W - padLeft - padRight;
    const chartH = H - padTop - padBottom;

    ctx.clearRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = "rgba(255,255,255,0.04)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padTop + (chartH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padLeft, y);
      ctx.lineTo(W - padRight, y);
      ctx.stroke();
    }

    // Y labels
    ctx.fillStyle = "rgba(255,255,255,0.25)";
    ctx.font = "10px -apple-system, sans-serif";
    ctx.textAlign = "right";
    for (let i = 0; i <= 4; i++) {
      const y = padTop + (chartH / 4) * i;
      ctx.fillText(String(Math.round(maxVal - (maxVal / 4) * i)), padLeft - 6, y + 3);
    }

    const points = dataPoints.map((d, i) => ({
      x: padLeft + (dataPoints.length === 1 ? chartW / 2 : (i / (dataPoints.length - 1)) * chartW),
      y: padTop + chartH - (Math.min(Math.max(d.value, 0), maxVal) / maxVal) * chartH,
      date: d.date,
    }));

    // Area
    const gradient = ctx.createLinearGradient(0, padTop, 0, H);
    gradient.addColorStop(0, color.replace("1)", "0.12)"));
    gradient.addColorStop(1, color.replace("1)", "0.0)"));
    ctx.beginPath();
    ctx.moveTo(points[0].x, H - padBottom);
    points.forEach((p) => ctx.lineTo(p.x, p.y));
    ctx.lineTo(points[points.length - 1].x, H - padBottom);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Line
    ctx.beginPath();
    ctx.strokeStyle = color;
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
      ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    });

    // X labels
    ctx.fillStyle = "rgba(255,255,255,0.25)";
    ctx.font = "10px -apple-system, sans-serif";
    ctx.textAlign = "center";
    const step = Math.max(1, Math.floor(points.length / 5));
    for (let i = 0; i < points.length; i += step) {
      ctx.fillText(
        points[i].date.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
        points[i].x,
        H - 6
      );
    }
    if (points.length > 1) {
      const last = points[points.length - 1];
      ctx.fillText(
        last.date.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
        last.x,
        H - 6
      );
    }
  }

  useEffect(() => {
    if (reports.length < 2) return;

    const chronological = [...reports].reverse();

    if (healthCanvasRef.current) {
      drawLineChart(
        healthCanvasRef.current,
        chronological.map((r) => ({ value: r.health_score, date: new Date(r.created_at) })),
        "rgba(99, 102, 241, 1)",
        100,
        "Health"
      );
    }

    if (riskCanvasRef.current) {
      drawLineChart(
        riskCanvasRef.current,
        chronological.map((r) => ({ value: r.risks?.length ?? 0, date: new Date(r.created_at) })),
        "rgba(239, 68, 68, 1)",
        Math.max(...chronological.map((r) => r.risks?.length ?? 0), 5),
        "Risks"
      );
    }
  }, [reports]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-[var(--accent)]/30 border-t-[var(--accent)]" />
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <>
        <PageHeader title="Analytics" description="Track your startup's trajectory over time." />
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-8 text-center sm:p-12">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent-subtle)]">
            <svg className="h-5 w-5 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="mb-1.5 text-[15px] font-medium text-white">No Analytics Data</h3>
          <p className="mx-auto max-w-sm text-[13px] text-[var(--text-secondary)]">
            Run your first startup analysis from the Dashboard to populate this page with intelligence.
          </p>
        </div>
      </>
    );
  }

  const current = reports[0];
  const previous = reports.length > 1 ? reports[1] : null;
  const healthScore = current.health_score;
  const healthDiff = previous ? healthScore - previous.health_score : 0;
  const riskCount = current.risks?.length ?? 0;
  const oppCount = current.opportunities?.length ?? 0;
  const actionCount = current.next_actions?.length ?? 0;
  const prevRiskCount = previous?.risks?.length ?? 0;
  const prevOppCount = previous?.opportunities?.length ?? 0;

  const metrics = [
    {
      label: "Health Score",
      value: `${healthScore}`,
      suffix: "/ 100",
      diff: previous ? healthDiff : null,
      variant: (healthScore >= 80 ? "success" : healthScore >= 50 ? "warning" : "risk") as "success" | "warning" | "risk",
    },
    {
      label: "Risks Found",
      value: `${riskCount}`,
      suffix: "",
      diff: previous ? riskCount - prevRiskCount : null,
      variant: "risk" as const,
      invertDiff: true, // more risks is bad
    },
    {
      label: "Opportunities",
      value: `${oppCount}`,
      suffix: "",
      diff: previous ? oppCount - prevOppCount : null,
      variant: "success" as const,
    },
    {
      label: "Active Actions",
      value: `${actionCount}`,
      suffix: "",
      diff: null,
      variant: "info" as const,
    },
  ];

  return (
    <>
      <PageHeader title="Analytics" description="Track your startup's trajectory over time." />

      {/* Key Metrics */}
      <section className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="Key metrics">
        {metrics.map((m) => (
          <div key={m.label} className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-4">
            <div className="mb-1 text-[12px] font-medium text-[var(--text-secondary)]">{m.label}</div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold tracking-tight text-white">{m.value}</span>
              {m.suffix && <span className="text-[13px] text-[var(--text-tertiary)]">{m.suffix}</span>}
            </div>
            {m.diff !== null && m.diff !== 0 && (
              <div className="mt-1.5">
                <Badge variant={
                  m.invertDiff
                    ? (m.diff > 0 ? "risk" : "success")
                    : (m.diff > 0 ? "success" : "risk")
                }>
                  {m.diff > 0 ? "+" : ""}{m.diff} from last
                </Badge>
              </div>
            )}
          </div>
        ))}
      </section>

      {/* Health Trend Chart */}
      <section className="mb-6" aria-label="Health trend">
        <h2 className="mb-3 text-[13px] font-medium text-[var(--text-secondary)]">Health Trend</h2>
        {reports.length >= 2 ? (
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-4">
            <canvas
              ref={healthCanvasRef}
              className="h-48 w-full sm:h-56"
              role="img"
              aria-label="Health score trend over time"
            />
          </div>
        ) : (
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-5">
            <p className="text-[14px] text-[var(--text-secondary)]">
              Run one more analysis to start tracking your health trend. Each analysis adds a data point.
            </p>
          </div>
        )}
      </section>

      {/* Risk Trend Chart */}
      <section className="mb-6" aria-label="Risk trend">
        <h2 className="mb-3 text-[13px] font-medium text-[var(--text-secondary)]">Risk Trend</h2>
        {reports.length >= 2 ? (
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-4">
            <canvas
              ref={riskCanvasRef}
              className="h-40 w-full sm:h-48"
              role="img"
              aria-label="Risk count trend over time"
            />
          </div>
        ) : (
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-5">
            <p className="text-[14px] text-[var(--text-secondary)]">
              Need at least two analyses to show risk trend.
            </p>
          </div>
        )}
      </section>

      {/* Analysis Comparison */}
      {previous && (
        <section className="mb-6" aria-label="Analysis comparison">
          <h2 className="mb-3 text-[13px] font-medium text-[var(--text-secondary)]">Latest vs Previous Analysis</h2>
          <div className="overflow-hidden rounded-xl border border-[var(--border-subtle)]">
            <table className="w-full text-[14px]">
              <thead>
                <tr className="border-b border-[var(--border-subtle)] bg-[var(--surface-raised)]">
                  <th className="px-4 py-3 text-left font-medium text-[var(--text-secondary)]">Metric</th>
                  <th className="px-4 py-3 text-right font-medium text-[var(--text-secondary)]">Current</th>
                  <th className="px-4 py-3 text-right font-medium text-[var(--text-secondary)]">Previous</th>
                  <th className="px-4 py-3 text-right font-medium text-[var(--text-secondary)]">Change</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: "Health Score", cur: current.health_score, prev: previous.health_score },
                  { label: "Risks", cur: riskCount, prev: prevRiskCount, invert: true },
                  { label: "Opportunities", cur: oppCount, prev: prevOppCount },
                  { label: "Actions", cur: actionCount, prev: previous.next_actions?.length ?? 0 },
                ].map((row) => {
                  const diff = row.cur - row.prev;
                  const isGood = row.invert ? diff < 0 : diff > 0;
                  return (
                    <tr key={row.label} className="border-b border-[var(--border-subtle)] last:border-0">
                      <td className="px-4 py-3 text-white">{row.label}</td>
                      <td className="px-4 py-3 text-right font-medium text-white">{row.cur}</td>
                      <td className="px-4 py-3 text-right text-[var(--text-secondary)]">{row.prev}</td>
                      <td className="px-4 py-3 text-right">
                        {diff !== 0 && (
                          <span className={`text-[13px] font-medium ${isGood ? "text-emerald-400" : "text-rose-400"}`}>
                            {diff > 0 ? "+" : ""}{diff}
                          </span>
                        )}
                        {diff === 0 && <span className="text-[13px] text-[var(--text-tertiary)]">—</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Opportunity Trend (textual for now, canvas if enough data) */}
      <section aria-label="Opportunity insights">
        <h2 className="mb-3 text-[13px] font-medium text-[var(--text-secondary)]">Opportunity Insights</h2>
        {current.opportunities && current.opportunities.length > 0 ? (
          <div className="space-y-2">
            {current.opportunities.map((opp: string, i: number) => (
              <div key={i} className="flex items-start gap-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-4 py-3">
                <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                <span className="text-[14px] text-white/90">{opp}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-5">
            <p className="text-[14px] text-[var(--text-secondary)]">No opportunities identified in the latest analysis.</p>
          </div>
        )}
      </section>
    </>
  );
}