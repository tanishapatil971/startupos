"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ReportDetailsPage() {
  const { id } = useParams();

  const [report, setReport] = useState<any>(null);


  useEffect(() => {
    async function loadReport() {

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;


      const { data, error } = await supabase
        .from("reports")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();


      if (error) {
        console.log(error);
        return;
      }


      setReport(data);
    }


    loadReport();

  }, [id]);


  if (!report) {
    return (
      <main className="
        min-h-screen 
        flex 
        items-center 
        justify-center 
        text-white
      ">
        <h1>Report not found.</h1>
      </main>
    );
  }


  return (

    <main className="min-h-screen px-8 py-10 text-white">

      <h1 className="shimmer-text text-5xl font-bold mb-3">
        {report.goal}
      </h1>


      <p className="text-gray-400 mb-8">
        {new Date(report.created_at).toLocaleString()}
      </p>


      <div className="glass rounded-3xl p-8 space-y-8">


        <div>

          <h2 className="text-xl font-semibold mb-3">
            Health Score
          </h2>

          <p className="text-3xl font-bold text-indigo-300">
            {report.health_score}/100
          </p>

        </div>



        <div>

          <h2 className="text-xl font-semibold mb-3">
            Risks
          </h2>

          <ul className="list-disc ml-6 space-y-2">

            {(report.risks || []).map(
              (risk: string) => (
                <li key={risk}>
                  {risk}
                </li>
              )
            )}

          </ul>

        </div>



        <div>

          <h2 className="text-xl font-semibold mb-3">
            Opportunities
          </h2>


          <ul className="list-disc ml-6 space-y-2">

            {(report.opportunities || []).map(
              (item: string) => (

                <li key={item}>
                  {item}
                </li>

              )
            )}

          </ul>

        </div>



        <div>

          <h2 className="text-xl font-semibold mb-3">
            Next Actions
          </h2>


          <ul className="list-disc ml-6 space-y-2">

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

    </main>

  );
}