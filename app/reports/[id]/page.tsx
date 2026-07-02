"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ReportDetailsPage() {
  const { id } = useParams();
  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    const reports = JSON.parse(localStorage.getItem("reports") || "[]");

    const selectedReport = reports.find(
      (item: any) => item.id.toString() === id
    );

    setReport(selectedReport);
  }, [id]);

  if (!report) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <h1>Report not found.</h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <h1 className="text-4xl font-bold mb-2">{report.goal}</h1>

      <p className="text-gray-400 mb-6">{report.date}</p>

      <div className="rounded-xl bg-slate-900 p-6 space-y-6">

        <div>
          <h2 className="font-semibold text-xl mb-2">
            Health Score
          </h2>
          <p>{report.healthScore}/100</p>
        </div>

        <div>
          <h2 className="font-semibold text-xl mb-2">
            Risks
          </h2>

          <ul className="list-disc ml-6">
            {report.risks.map((risk: string) => (
              <li key={risk}>{risk}</li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-semibold text-xl mb-2">
            Opportunities
          </h2>

          <ul className="list-disc ml-6">
            {report.opportunities.map((item: string) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-semibold text-xl mb-2">
            Next Actions
          </h2>

          <ul className="list-disc ml-6">
            {report.nextActions.map((action: string) => (
              <li key={action}>{action}</li>
            ))}
          </ul>
        </div>

      </div>
    </main>
  );
}