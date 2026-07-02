"use client";

import { useEffect, useState } from "react";

export default function ActionsPage() {
  const [actions, setActions] = useState<
    { text: string; completed: boolean }[]
  >([]);

  useEffect(() => {
    const reports = JSON.parse(localStorage.getItem("reports") || "[]");

    if (reports.length > 0) {
      const saved = localStorage.getItem("actionProgress");

      if (saved) {
        setActions(JSON.parse(saved));
      } else {
        setActions(
          (reports[0].nextActions || []).map((item: string) => ({
            text: item,
            completed: false,
          }))
        );
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "actionProgress",
      JSON.stringify(actions)
    );
  }, [actions]);

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
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <h1 className="text-4xl font-bold mb-2">
        Action Tracker
      </h1>

      <p className="text-gray-400 mb-8">
        Complete AI-recommended tasks.
      </p>

      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>

        <div className="h-3 rounded-full bg-slate-800">
          <div
            className="h-3 rounded-full bg-blue-600 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="space-y-4">
        {actions.map((action, index) => (
          <label
            key={index}
            className="flex items-center gap-4 rounded-xl border border-slate-700 bg-slate-900 p-5 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={action.completed}
              onChange={() => toggle(index)}
            />

            <span
              className={
                action.completed
                  ? "line-through text-gray-500"
                  : ""
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