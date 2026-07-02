"use client";

import { useEffect, useState } from "react";

export default function AnalyticsPage() {
  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    const reports = JSON.parse(localStorage.getItem("reports") || "[]");
    if (reports.length > 0) {
      setReport(reports[0]);
    }
  }, []);

  if (!report) {
    return (
      <main className="min-h-screen bg-slate-950 text-white p-8">
        <h1 className="text-4xl font-bold mb-4">Analytics</h1>
        <p>No analysis found.</p>
      </main>
    );
  }

  const cards = [
    {
      title: "Health Score",
      value: `${report.healthScore}/100`,
    },
    {
      title: "Risks",
      value: report.risks?.length ?? 0,
    },
    {
      title: "Opportunities",
      value: report.opportunities?.length ?? 0,
    },
    {
      title: "Next Actions",
      value: report.nextActions?.length ?? 0,
    },
    {
      title: "Roadmap Tasks",
      value: report.roadmap?.length ?? 0,
    },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <h1 className="text-4xl font-bold mb-2">Analytics</h1>
      <p className="text-gray-400 mb-8">
        Overview of your latest startup analysis.
      </p>

      <div className="grid gap-6 md:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.title}
            className="rounded-xl border border-slate-700 bg-slate-900 p-6"
          >
            <p className="text-gray-400">{card.title}</p>
            <h2 className="mt-3 text-3xl font-bold">{card.value}</h2>
          </div>
        ))}
      </div>
    </main>
  );
}