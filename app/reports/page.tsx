"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function ReportsPage() {
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    const savedReports = JSON.parse(
      localStorage.getItem("reports") || "[]"
    );
    setReports(savedReports);
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <h1 className="text-4xl font-bold mb-2">Reports</h1>
      <p className="text-gray-400 mb-8">
        Click any report to view the complete analysis.
      </p>

      {reports.length === 0 ? (
        <p className="text-gray-400">No reports available.</p>
      ) : (
        <div className="space-y-6">
          {reports.map((report) => (
            <Link
              key={report.id}
              href={`/reports/${report.id}`}
              className="block rounded-xl border border-slate-700 bg-slate-900 p-6 transition hover:border-blue-500 hover:bg-slate-800"
            >
              <h2 className="text-xl font-semibold">{report.goal}</h2>

              <p className="text-gray-400 mt-1">{report.date}</p>

              <p className="mt-4">
                <strong>Health Score:</strong> {report.healthScore}/100
              </p>

              <div className="mt-4">
                <strong>Top Risks:</strong>

                <ul className="list-disc ml-6 mt-2">
                  {(report.risks || []).slice(0, 3).map((risk: string) => (
                    <li key={risk}>{risk}</li>
                  ))}
                </ul>
              </div>

              <p className="mt-4 text-blue-400 font-medium">
                View Full Report →
              </p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}