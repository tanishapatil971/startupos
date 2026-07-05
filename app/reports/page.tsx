"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ReportsPage() {
  const [reports, setReports] = useState<any[]>([]);

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
          Reports
        </h1>

        <p className="mt-3 text-gray-400">
          Review your previous startup intelligence reports.
        </p>
      </div>


      {reports.length === 0 ? (
        <div className="glass rounded-3xl p-10 text-center">
          <p className="text-gray-400">
            No reports generated yet.
          </p>
        </div>
      ) : (

        <div className="grid gap-6">

          {reports.map((report) => (

            <Link
              key={report.id}
              href={`/reports/${report.id}`}
              className="
                glass rounded-3xl p-7
                transition-all duration-300
                hover:-translate-y-1
              "
            >

              <div className="flex justify-between">

                <div>
                  <h2 className="text-2xl font-semibold">
                    {report.goal}
                  </h2>

                  <p className="mt-2 text-sm text-gray-500">
                    {new Date(report.created_at).toLocaleString()}
                  </p>
                </div>


                <div className="rounded-2xl bg-indigo-500/20 px-5 py-3">

                  <span className="text-2xl font-bold">
                    {report.health_score}
                  </span>

                  <span className="text-gray-400">
                    /100
                  </span>

                </div>

              </div>


              <div className="mt-6">

                <p className="mb-3 text-sm uppercase tracking-widest text-gray-500">
                  Top Risks
                </p>

                <div className="space-y-2">

                  {(report.risks || [])
                    .slice(0, 3)
                    .map((risk: string) => (

                    <p
                      key={risk}
                      className="
                        rounded-xl
                        bg-white/[0.04]
                        px-4 py-2
                        text-sm
                      "
                    >
                      {risk}
                    </p>

                  ))}

                </div>

              </div>


              <p className="mt-6 text-indigo-400">
                View full analysis →
              </p>


            </Link>

          ))}

        </div>
      )}

    </main>
  );
}