"use client";

import { useState } from "react";
import Card from "@/components/Card";
import { startupData } from "@/lib/mockData";

export default function Home() {
  const [analysis, setAnalysis] = useState<any>(null);

  const analyzeStartup = async () => {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        context: JSON.stringify(startupData),
      }),
    });

    const data = await response.json();
    setAnalysis(data.analysis);
  };

  return (
    <main className="min-h-screen p-8 bg-slate-50 text-black">
      <h1 className="text-4xl font-bold mb-8">StartupOS</h1>

      <button
        onClick={async () => {
          try {
            await analyzeStartup();
          } catch (err) {
            console.error(err);
          }
        }}
      >
        Analyze Startup
      </button>

      <div className="grid gap-4 md:grid-cols-2">
        <Card title="Goal">
          <p>{startupData.goal}</p>
        </Card>

        <Card title="Health Score">
          <p>{startupData.healthScore}/100</p>
        </Card>

        <Card title="Top Risks">
          <ul>
            {startupData.risks.map((risk) => (
              <li key={risk}>{risk}</li>
            ))}
          </ul>
        </Card>

        <Card title="Opportunities">
          <ul>
            {startupData.opportunities.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Card>

        <Card title="Next Actions">
          <ul>
            {startupData.nextActions.map((action) => (
            <li key={action}>{action}</li>
           ))}
          </ul>
        </Card>
      </div>

      {analysis && (
  <div className="mt-8 rounded bg-white p-6 shadow">
    <h2 className="mb-4 text-xl font-bold">AI Analysis</h2>

    <p>
      <strong>Health Score:</strong> {analysis.healthScore}
    </p>

    <p className="mt-3">
      <strong>Risks:</strong>
    </p>
    <ul>
      {analysis.risks?.map((risk: string) => (
        <li key={risk}>{risk}</li>
      ))}
    </ul>

    <p className="mt-3">
      <strong>Opportunities:</strong>
    </p>
    <ul>
      {analysis.opportunities?.map((item: string) => (
        <li key={item}>{item}</li>
      ))}
    </ul>

    <p className="mt-3">
      <strong>Next Actions:</strong>
    </p>
    <ul>
      {analysis.nextActions?.map((action: string) => (
        <li key={action}>{action}</li>
      ))}
    </ul>
  </div>
  )}
    </main>
  );
}