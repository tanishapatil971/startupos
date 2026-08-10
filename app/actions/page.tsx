"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import PageHeader from "@/components/PageHeader";
import Badge from "@/components/Badge";

export default function ActionsPage() {
  const [actions, setActions] = useState<{ text: string; completed: boolean }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadActions() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("reports")
        .select("next_actions")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (!error && data) {
        setActions(
          (data.next_actions || []).map((item: string) => ({
            text: item,
            completed: false,
          }))
        );
      }
      setLoading(false);
    }
    loadActions();
  }, []);

  const toggle = (index: number) => {
    setActions((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const completedCount = actions.filter((a) => a.completed).length;
  const progress = actions.length === 0 ? 0 : Math.round((completedCount / actions.length) * 100);

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
        title="Action Tracker" 
        description="Execute AI-recommended growth tasks to improve your startup health." 
      />

      {actions.length === 0 ? (
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-8 text-center sm:p-12">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent-subtle)]">
            <svg className="h-5 w-5 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="mb-1.5 text-[15px] font-medium text-white">No Actions Pending</h3>
          <p className="mx-auto max-w-sm text-[13px] text-[var(--text-secondary)]">
            Run an analysis from the Dashboard to generate recommended actions.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-5 sm:p-6">
            <div className="mb-4 flex items-end justify-between">
              <div>
                <p className="text-[12px] font-medium text-[var(--text-secondary)]">
                  Execution Progress
                </p>
                <p className="mt-0.5 text-[14px] text-white">
                  {completedCount} of {actions.length} tasks completed
                </p>
              </div>
              <p className="text-2xl font-bold tracking-tight text-[var(--accent)]">
                {progress}%
              </p>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className="h-full rounded-full bg-[var(--accent)] transition-all duration-700 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-raised)]">
            {actions.map((action, index) => {
              const priority = index === 0 ? "High" : index < 3 ? "Medium" : "Low";
              const variant = priority === "High" ? "risk" : priority === "Medium" ? "warning" : "default";

              return (
                <label
                  key={index}
                  className={`group flex cursor-pointer items-start gap-4 px-5 py-4 transition-colors hover:bg-white/[0.02] sm:items-center ${
                    index !== actions.length - 1 ? "border-b border-[var(--border-subtle)]" : ""
                  } ${action.completed ? "opacity-60" : ""}`}
                >
                  <div className="relative flex h-5 w-5 shrink-0 items-center justify-center pt-0.5 sm:pt-0">
                    <input
                      type="checkbox"
                      checked={action.completed}
                      onChange={() => toggle(index)}
                      className="peer absolute h-5 w-5 cursor-pointer opacity-0"
                    />
                    <div className="pointer-events-none flex h-5 w-5 items-center justify-center rounded-[4px] border border-[var(--border-strong)] transition-all peer-checked:border-[var(--accent)] peer-checked:bg-[var(--accent)]">
                      <svg className={`h-3.5 w-3.5 text-white transition-opacity ${action.completed ? "opacity-100" : "opacity-0"}`} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <span
                      className={`text-[14px] transition-all ${
                        action.completed ? "text-[var(--text-tertiary)] line-through" : "text-white/90"
                      }`}
                    >
                      {action.text}
                    </span>
                    
                    <div className="shrink-0">
                      <Badge variant={action.completed ? "default" : variant}>
                        {priority} Priority
                      </Badge>
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}