"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function RoadmapPage() {
  const [roadmap, setRoadmap] = useState<any[]>([]);

  useEffect(() => {
  async function loadRoadmap() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;


    const { data, error } = await supabase
      .from("reports")
      .select("roadmap")
      .eq("user_id", user.id)
      .order("created_at", {
        ascending: false,
      })
      .limit(1)
      .single();


    if (error) {
      console.log(error);
      return;
    }


    setRoadmap(data?.roadmap || []);
  }

  loadRoadmap();

}, []);

  return (
    <main className="min-h-screen px-8 py-10 text-white">

      <div className="mb-12">
        <h1 className="shimmer-text text-5xl font-bold">
          AI Roadmap
        </h1>

        <p className="mt-3 text-gray-400">
          Your personalized execution timeline.
        </p>
      </div>


      {roadmap.length === 0 ? (
        <div className="glass rounded-3xl p-10">
          <p className="text-gray-400">
            Run an analysis to generate your roadmap.
          </p>
        </div>
      ) : (
        <div className="relative space-y-6">

          {roadmap.map((item, index) => (
            <div
              key={index}
              className="
                glass relative rounded-3xl p-7
                transition-all duration-300
                hover:-translate-y-1
              "
            >

              <div className="flex items-center justify-between">

                <div className="flex gap-5 items-start">

                  <div className="
                    flex h-14 w-14 items-center justify-center
                    rounded-2xl bg-indigo-500/20
                    text-indigo-300 font-bold
                  ">
                    {index + 1}
                  </div>


                  <div>
                    <p className="text-sm text-indigo-400 font-medium">
                      {item.week}
                    </p>

                    <h2 className="mt-1 text-2xl font-semibold">
                      {item.title}
                    </h2>
                  </div>

                </div>


                <span className="
                  rounded-full border border-white/10
                  bg-white/[0.05]
                  px-5 py-2 text-sm
                  text-gray-300
                ">
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