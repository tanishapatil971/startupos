"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import Badge from "@/components/Badge";

export default function RoadmapPage() {
  const [roadmap, setRoadmap] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRoadmap() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("reports")
        .select("roadmap")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (!error && data) {
        setRoadmap(data.roadmap || []);
      }
      setLoading(false);
    }
    loadRoadmap();
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
        title="Execution Roadmap" 
        description="Your strategic timeline broken down by milestones and target phases." 
      />

      {roadmap.length === 0 ? (
        <EmptyState
          title="No Roadmap Generated"
          description="Run an analysis in the Command Center to generate a strategic timeline."
          icon="🗺️"
        />
      ) : (
        <div className="relative space-y-6 before:absolute before:inset-y-0 before:left-[35px] before:w-[2px] before:bg-white/[0.05]">
          {roadmap.map((item, index) => (
            <div
              key={index}
              className="glass relative z-10 flex flex-col gap-5 rounded-[24px] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/30 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-start gap-6">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-500/10 text-lg font-bold text-indigo-400 ring-4 ring-[var(--background)]">
                  {index + 1}
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                    {item.week}
                  </p>
                  <h2 className="mt-1 text-xl font-semibold text-white">
                    {item.title}
                  </h2>
                </div>
              </div>

              <div className="pl-[80px] sm:pl-0">
                <Badge variant="default">{item.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}