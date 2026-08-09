"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import PageHeader from "@/components/PageHeader";
import Card from "@/components/Card";
import EmptyState from "@/components/EmptyState";
import Badge from "@/components/Badge";

export default function AnalyticsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("reports")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(2); // Fetch last 2 to calculate trend

      if (!error && data) {
        setReports(data);
      }
      setLoading(false);
    }

    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500/30 border-t-indigo-500" />
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <>
        <PageHeader title="Analytics" description="Founder intelligence dashboard." />
        <EmptyState
          title="No Analytics Data"
          description="Run your first startup analysis to populate this dashboard with intelligence."
          icon="📊"
        />
      </>
    );
  }

  const current = reports[0];
  const previous = reports.length > 1 ? reports[1] : null;

  const healthScore = current.health_score;
  const healthDiff = previous ? healthScore - previous.health_score : 0;
  
  const cards = [
    {
      title: "Health Score",
      value: `${healthScore}/100`,
      trend: previous ? (
        <Badge variant={healthDiff > 0 ? "success" : healthDiff < 0 ? "risk" : "default"}>
          {healthDiff > 0 ? "+" : ""}{healthDiff} from last analysis
        </Badge>
      ) : null
    },
    {
      title: "Risks Found",
      value: current.risks?.length ?? 0,
    },
    {
      title: "Opportunities",
      value: current.opportunities?.length ?? 0,
    },
    {
      title: "Active Actions",
      value: current.next_actions?.length ?? 0,
    },
  ];

  return (
    <>
      <PageHeader title="Analytics" description="Founder intelligence dashboard." />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, i) => (
          <Card key={card.title} title={card.title} className="hover:-translate-y-1">
            <h2 className="mt-2 text-4xl font-bold tracking-tight text-white">
              {card.value}
            </h2>
            {card.trend && <div className="mt-4">{card.trend}</div>}
          </Card>
        ))}
      </div>

      <Card title="Startup Health Trend" className="mt-8">
        <div className="mb-2 flex justify-between text-sm">
          <span className="text-[var(--text-muted)]">Current Standing</span>
          <span className="font-bold text-indigo-400">{healthScore}%</span>
        </div>
        <div className="h-4 overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500 transition-all duration-1000 ease-out"
            style={{ width: `${healthScore}%` }}
          />
        </div>
      </Card>
    </>
  );
}