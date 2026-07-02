"use client";

import { useEffect, useState } from "react";

export default function ComparePage() {
  const [reports, setReports] = useState<any[]>([]);
  const [first, setFirst] = useState<any>(null);
  const [second, setSecond] = useState<any>(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("reports") || "[]");
    setReports(saved);
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <h1 className="text-4xl font-bold mb-8">Compare Analyses</h1>

      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <select
          className="bg-slate-900 border border-slate-700 rounded-lg p-3"
          onChange={(e) =>
            setFirst(reports.find((r) => r.id.toString() === e.target.value))
          }
        >
          <option>Select First Report</option>
          {reports.map((r) => (
            <option key={r.id} value={r.id}>
              {r.goal}
            </option>
          ))}
        </select>

        <select
          className="bg-slate-900 border border-slate-700 rounded-lg p-3"
          onChange={(e) =>
            setSecond(reports.find((r) => r.id.toString() === e.target.value))
          }
        >
          <option>Select Second Report</option>
          {reports.map((r) => (
            <option key={r.id} value={r.id}>
              {r.goal}
            </option>
          ))}
        </select>
      </div>

      {first && second && (
        <div className="grid md:grid-cols-2 gap-6">
          {[first, second].map((report, index) => (
            <div
              key={index}
              className="rounded-xl bg-slate-900 border border-slate-700 p-6"
            >
              <h2 className="text-xl font-bold mb-4">{report.goal}</h2>

              <p>
                <strong>Health Score:</strong> {report.healthScore}/100
              </p>

              <div className="mt-4">
                <strong>Risks</strong>
                <ul className="list-disc ml-6 mt-2">
                  {(report.risks || []).map((risk: string) => (
                    <li key={risk}>{risk}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-4">
                <strong>Opportunities</strong>
                <ul className="list-disc ml-6 mt-2">
                  {(report.opportunities || []).map((item: string) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-4">
                <strong>Next Actions</strong>
                <ul className="list-disc ml-6 mt-2">
                  {(report.nextActions || []).map((action: string) => (
                    <li key={action}>{action}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}