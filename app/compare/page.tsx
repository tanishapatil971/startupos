"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ComparePage() {
  const [reports, setReports] = useState<any[]>([]);
  const [first, setFirst] = useState<any>(null);
  const [second, setSecond] = useState<any>(null);

  useEffect(() => {
    async function loadReports() {
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
        });

      if (error) {
        console.log(error);
        return;
      }

      setReports(data || []);
    }

    loadReports();
  }, []);


  return (
    <main className="min-h-screen px-8 py-10 text-white">

      <div className="mb-10">
        <h1 className="shimmer-text text-5xl font-bold">
          Compare Analyses
        </h1>

        <p className="mt-3 text-gray-400">
          Track how your startup strategy improves over time.
        </p>
      </div>


      <div className="grid md:grid-cols-2 gap-4 mb-8">

        <select
          className="
            glass
            rounded-2xl
            p-4
            outline-none
            bg-slate-900
            text-white
          "
          onChange={(e) =>
            setFirst(
              reports.find(
                (r) => r.id.toString() === e.target.value
              )
            )
          }
        >

          <option className="bg-slate-900 text-white">
            Select First Report
          </option>

          {reports.map((r) => (
            <option
              className="bg-slate-900 text-white"
              key={r.id}
              value={r.id}
            >
              {r.goal}
            </option>
          ))}

        </select>


        <select
          className="
            glass
            rounded-2xl
            p-4
            outline-none
            bg-slate-900
            text-white
          "
          onChange={(e) =>
            setSecond(
              reports.find(
                (r) => r.id.toString() === e.target.value
              )
            )
          }
        >

          <option className="bg-slate-900 text-white">
            Select Second Report
          </option>

          {reports.map((r) => (
            <option
              className="bg-slate-900 text-white"
              key={r.id}
              value={r.id}
            >
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
              className="
                glass
                rounded-3xl
                p-7
                transition-all
                duration-300
                hover:-translate-y-1
              "
            >

              <h2 className="text-xl font-bold mb-4">
                {report.goal}
              </h2>


              <p>
                <strong>Health Score:</strong>{" "}
                {report.health_score}/100
              </p>


              <div className="mt-4">

                <strong>Risks</strong>

                <ul className="list-disc ml-6 mt-2">
                  {(report.risks || []).map(
                    (risk: string) => (
                      <li key={risk}>
                        {risk}
                      </li>
                    )
                  )}
                </ul>

              </div>


              <div className="mt-4">

                <strong>Opportunities</strong>

                <ul className="list-disc ml-6 mt-2">
                  {(report.opportunities || []).map(
                    (item: string) => (
                      <li key={item}>
                        {item}
                      </li>
                    )
                  )}
                </ul>

              </div>


              <div className="mt-4">

                <strong>Next Actions</strong>

                <ul className="list-disc ml-6 mt-2">
                  {(report.next_actions || []).map(
                    (action: string) => (
                      <li key={action}>
                        {action}
                      </li>
                    )
                  )}
                </ul>

              </div>


            </div>

          ))}

        </div>
      )}

    </main>
  );
}