"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ActionsPage() {
  const [actions, setActions] = useState<
    { text: string; completed: boolean }[]
  >([]);

  useEffect(() => {
  async function loadActions() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;


    const { data, error } = await supabase
      .from("reports")
      .select("next_actions")
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


    setActions(
      (data?.next_actions || []).map((item: string) => ({
        text: item,
        completed: false,
      }))
    );
  }


  loadActions();

}, []);

  const toggle = (index: number) => {
    setActions((prev) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, completed: !item.completed }
          : item
      )
    );
  };

  const completed = actions.filter((a) => a.completed).length;

  const progress =
    actions.length === 0
      ? 0
      : Math.round((completed / actions.length) * 100);


  return (
    <main className="min-h-screen px-8 py-10 text-white">

      <div className="mb-10">
        <h1 className="shimmer-text text-5xl font-bold">
          Action Tracker
        </h1>

        <p className="mt-3 text-gray-400">
          Execute AI recommended growth tasks.
        </p>
      </div>


      <div className="glass mb-8 rounded-3xl p-8">

        <div className="mb-4 flex justify-between">
          <p className="text-gray-400">
            Execution Progress
          </p>

          <p className="font-bold text-indigo-300">
            {progress}%
          </p>
        </div>


        <div className="h-4 overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className="
              h-full rounded-full
              bg-gradient-to-r from-cyan-400 to-indigo-500
              transition-all duration-700
            "
            style={{ width: `${progress}%` }}
          />
        </div>

      </div>


      <div className="space-y-5">

        {actions.map((action, index) => (
          <label
            key={index}
            className="
              glass flex cursor-pointer items-center
              gap-5 rounded-3xl p-6
              transition-all duration-300
              hover:-translate-y-1
            "
          >

            <input
              type="checkbox"
              checked={action.completed}
              onChange={() => toggle(index)}
              className="h-5 w-5 accent-indigo-500"
            />


            <span
              className={
                action.completed
                  ? "text-gray-500 line-through"
                  : "text-white"
              }
            >
              {action.text}
            </span>

          </label>
        ))}

      </div>

    </main>
  );
}