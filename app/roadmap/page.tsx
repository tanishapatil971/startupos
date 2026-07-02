"use client";

import { useEffect, useState } from "react";

export default function RoadmapPage() {
  const [roadmap, setRoadmap] = useState<any[]>([]);

  useEffect(() => {
    const reports = JSON.parse(localStorage.getItem("reports") || "[]");

    if (reports.length > 0) {
      setRoadmap(reports[0].roadmap || []);
    }
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <h1 className="text-4xl font-bold mb-2">AI Roadmap</h1>
      <p className="text-gray-400 mb-8">
        Personalized execution plan generated from your latest analysis.
      </p>

      {roadmap.length === 0 ? (
        <p className="text-gray-400">
          Run a startup analysis to generate a roadmap.
        </p>
      ) : (
        <div className="space-y-6">
          {roadmap.map((item: any, index: number) => (
            <div
              key={index}
              className="rounded-xl border border-slate-700 bg-slate-900 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-400 font-semibold">{item.week}</p>
                  <h2 className="text-xl font-bold mt-1">{item.title}</h2>
                </div>

                <span className="rounded-full bg-blue-600 px-4 py-1 text-sm">
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}