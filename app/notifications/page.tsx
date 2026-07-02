"use client";

import { useEffect, useState } from "react";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<string[]>([]);

  useEffect(() => {
    const reports = JSON.parse(localStorage.getItem("reports") || "[]");

    if (reports.length === 0) return;

    const latest = reports[0];
    const alerts: string[] = [];

    if (latest.healthScore < 60) {
      alerts.push("🔴 Your startup health score is below 60. Immediate action recommended.");
    }

    (latest.risks || []).forEach((risk: string) => {
      alerts.push(`⚠️ Risk: ${risk}`);
    });

    (latest.nextActions || []).forEach((action: string) => {
      alerts.push(`📌 Action: ${action}`);
    });

    setNotifications(alerts);
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <h1 className="text-4xl font-bold mb-2">
        Notifications
      </h1>

      <p className="text-gray-400 mb-8">
        AI-generated alerts and reminders.
      </p>

      {notifications.length === 0 ? (
        <p>No notifications.</p>
      ) : (
        <div className="space-y-4">
          {notifications.map((item, index) => (
            <div
              key={index}
              className="rounded-xl border border-slate-700 bg-slate-900 p-5"
            >
              {item}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}