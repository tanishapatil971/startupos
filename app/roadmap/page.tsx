"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import PageHeader from "@/components/PageHeader";
import Badge from "@/components/Badge";
import { useAuth } from "@/components/AuthProvider";

interface RoadmapItem {
  week: string;
  title: string;
  status: string;
}

export default function RoadmapPage() {
  const { user } = useAuth();
  const [roadmap, setRoadmap] = useState<RoadmapItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRoadmap() {
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
  }, [user]);

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
        title="Execution Roadmap" 
        description="Your strategic timeline broken down by milestones and target phases." 
      />

      {roadmap.length === 0 ? (
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-8 text-center sm:p-12">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent-subtle)]">
            <svg className="h-5 w-5 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <h3 className="mb-1.5 text-[15px] font-medium text-white">No Roadmap Generated</h3>
          <p className="mx-auto max-w-sm text-[13px] text-[var(--text-secondary)]">
            Run an analysis from the Dashboard to generate a strategic timeline.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-raised)]">
          {roadmap.map((item, index) => (
            <div
              key={index}
              className={`flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between ${
                index !== roadmap.length - 1 ? "border-b border-[var(--border-subtle)]" : ""
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-subtle)] text-[13px] font-bold text-[var(--accent)]">
                  {index + 1}
                </div>

                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                    {item.week}
                  </p>
                  <h2 className="mt-0.5 text-[15px] font-medium text-white">
                    {item.title}
                  </h2>
                </div>
              </div>

              <div className="pl-14 sm:pl-0">
                <Badge variant="default">{item.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}