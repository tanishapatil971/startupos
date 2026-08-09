"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
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
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500/30 border-t-indigo-500" />
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
        <EmptyState
          title="No Actions Pending"
          description="You have no recommended actions. Run an analysis in the Command Center."
          icon="✅"
        />
      ) : (
        <>
          <div className="glass mb-8 rounded-[24px] p-6 sm:p-8 fade-up">
            <div className="mb-4 flex items-end justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-widest text-[var(--text-muted)]">
                  Execution Progress
                </p>
                <p className="mt-1 text-sm text-[var(--text-faint)]">
                  {completedCount} of {actions.length} tasks completed
                </p>
              </div>
              <p className="text-3xl font-bold tracking-tight text-indigo-400">
                {progress}%
              </p>
            </div>

            <div className="h-4 overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500 transition-all duration-700 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="space-y-4">
            {actions.map((action, index) => {
              // Simple heuristic to assign priority based on index (assuming AI orders by importance)
              const priority = index === 0 ? "High" : index < 3 ? "Medium" : "Low";
              const variant = priority === "High" ? "risk" : priority === "Medium" ? "warning" : "default";

              return (
                <label
                  key={index}
                  className={`glass group flex cursor-pointer items-start gap-4 rounded-[20px] p-5 transition-all duration-300 hover:-translate-y-0.5 sm:items-center sm:gap-6 sm:p-6 ${
                    action.completed ? "opacity-60 grayscale" : "hover:border-indigo-500/30 hover:bg-white/[0.04]"
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="relative flex h-6 w-6 shrink-0 items-center justify-center pt-1 sm:pt-0">
                    <input
                      type="checkbox"
                      checked={action.completed}
                      onChange={() => toggle(index)}
                      className="peer absolute h-6 w-6 cursor-pointer opacity-0"
                    />
                    <div className="pointer-events-none flex h-6 w-6 items-center justify-center rounded-lg border-2 border-[var(--border-strong)] transition-all peer-checked:border-indigo-500 peer-checked:bg-indigo-500">
                      <svg className={`h-4 w-4 text-white transition-opacity ${action.completed ? "opacity-100" : "opacity-0"}`} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <span
                      className={`text-[15px] transition-all duration-300 ${
                        action.completed ? "text-[var(--text-faint)] line-through" : "text-white"
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
        </>
      )}
    </>
  );
}