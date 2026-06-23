"use client";

import { useState } from "react";
import Card from "@/components/Card";
import { startupData } from "@/lib/mockData";

export default function Home() {
  const [analysis, setAnalysis] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [context, setContext] = useState("");
  const [goal, setGoal] = useState("Reach 100 paying customers");
  const [loading, setLoading] = useState(false);

  const analyzeStartup = async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          goal,
          context,
        }),
      });

      const data = await response.json();

      console.log(data.analysis);

      setAnalysis(data.analysis);
      setHistory((prev) => [data.analysis, ...prev]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8 bg-slate-50 text-black">
      <h1 className="text-4xl font-bold mb-8">StartupOS</h1>

      <input
        type="text"
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        placeholder="Enter startup goal"
        className="w-full p-3 border rounded-lg mb-4"
      />

      <textarea
        value={context}
        onChange={(e) => setContext(e.target.value)}
        placeholder="Paste meeting notes, customer feedback, startup updates..."
        className="w-full p-4 border rounded-lg mb-4"
        rows={8}
      />

      <button
        onClick={analyzeStartup}
        disabled={loading}
        className="mb-6 rounded bg-black px-4 py-2 text-white"
      >
        {loading ? "Analyzing..." : "Analyze Startup"}
      </button>

      <div className="grid gap-4 md:grid-cols-2">
        <Card title="Goal">
          <p>{goal}</p>
        </Card>

        <Card title="Health Score">
          <p>{analysis?.healthScore ?? startupData.healthScore}/100</p>
        </Card>

        <Card title="Top Risks">
          <ul>
            {(analysis?.risks ?? startupData.risks).map((risk: string) => (
              <li key={risk}>{risk}</li>
            ))}
          </ul>
        </Card>

        <Card title="Opportunities">
          <ul>
            {(analysis?.opportunities ?? startupData.opportunities).map(
              (item: string) => (
                <li key={item}>{item}</li>
              )
            )}
          </ul>
        </Card>

        <Card title="Next Actions">
          <ul>
            {(analysis?.nextActions ?? startupData.nextActions).map(
              (action: string) => (
                <li key={action}>{action}</li>
              )
            )}
          </ul>
        </Card>
      </div>
    </main>
  );
}