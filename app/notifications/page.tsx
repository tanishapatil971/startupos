"use client";

import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New Analysis Complete",
      message: "Your latest startup health report is ready to view.",
      time: "2 hours ago",
      read: false,
      type: "success",
    },
    {
      id: 2,
      title: "Risk Alert: Burn Rate",
      message: "Your current trajectory suggests runway may end sooner than expected.",
      time: "1 day ago",
      read: true,
      type: "risk",
    },
    {
      id: 3,
      title: "Weekly Roadmap Updated",
      message: "AI has generated new tasks for the upcoming sprint.",
      time: "3 days ago",
      read: true,
      type: "info",
    }
  ]);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "success": return "✅";
      case "risk": return "⚠️";
      default: return "ℹ️";
    }
  };

  return (
    <>
      <PageHeader 
        title="Notifications" 
        description="Stay updated on your startup's strategic changes and AI alerts." 
        action={
          <button 
            onClick={markAllRead}
            className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Mark all as read
          </button>
        }
      />

      {notifications.length === 0 ? (
        <EmptyState 
          title="All Caught Up" 
          description="You have no new notifications right now."
          icon="🔔"
        />
      ) : (
        <div className="grid gap-4">
          {notifications.map((notif, index) => (
            <div 
              key={notif.id}
              className={`glass flex gap-4 rounded-2xl p-5 transition-all hover:bg-white/[0.04] ${notif.read ? "opacity-60" : "border-l-4 border-l-indigo-500"}`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/[0.05] text-lg">
                {getIcon(notif.type)}
              </div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <h3 className={`font-medium ${notif.read ? "text-[var(--text-muted)]" : "text-white"}`}>
                    {notif.title}
                  </h3>
                  <span className="shrink-0 text-xs text-[var(--text-faint)]">
                    {notif.time}
                  </span>
                </div>
                <p className="mt-1 text-sm text-[var(--text-muted)]">
                  {notif.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}