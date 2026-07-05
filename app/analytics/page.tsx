"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AnalyticsPage() {
  const [report, setReport] = useState<any>(null);

  useEffect(() => {
  async function loadAnalytics() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;


    const { data, error } = await supabase
      .from("reports")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", {
        ascending: false,
      })
      .limit(1)
      .single();


    if (error) {
      console.log(error);
      return;
    }


    setReport(data);
  }


  loadAnalytics();

}, []);

  if (!report) {
    return (
      <main className="min-h-screen px-8 py-10 text-white">
        <h1 className="shimmer-text text-5xl font-bold">
          Analytics
        </h1>

        <p className="mt-6 text-gray-400">
          No analysis found.
        </p>
      </main>
    );
  }

  const cards = [
    ["Health Score", `${report.health_score}/100`],
    ["Risks Found", report.risks?.length ?? 0],
    ["Opportunities", report.opportunities?.length ?? 0],
    ["Actions", report.next_actions?.length ?? 0],
    ["Roadmap Steps", report.roadmap?.length ?? 0],
  ];

  return (
    <main className="min-h-screen px-8 py-10 text-white">

      <div className="mb-10">
        <h1 className="shimmer-text text-5xl font-bold">
          Analytics
        </h1>

        <p className="mt-3 text-gray-400">
          Founder intelligence dashboard.
        </p>
      </div>


      <div className="grid gap-6 md:grid-cols-3">

        {cards.map(([title, value]) => (
          <div
            key={title}
            className="
              glass rounded-3xl p-7
              transition-all duration-300
              hover:-translate-y-1
            "
          >

            <p className="text-sm uppercase tracking-widest text-gray-500">
              {title}
            </p>

            <h2 className="mt-5 text-5xl font-bold">
              {value}
            </h2>

          </div>
        ))}

      </div>


      <div className="glass mt-8 rounded-3xl p-8">

        <p className="mb-3 text-gray-400">
          Startup Health
        </p>

        <div className="h-4 rounded-full bg-white/[0.06]">
          <div
            className="
              h-4 rounded-full
              bg-gradient-to-r from-cyan-400 to-indigo-500
            "
            style={{ width: `${report.health_score}%` }}
          />
        </div>

      </div>

    </main>
  );
}