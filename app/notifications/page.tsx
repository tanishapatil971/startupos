"use client";

import { useState } from "react";
import PageHeader from "@/components/PageHeader";

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
      case "success": return (
        <svg className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      );
      case "risk": return (
        <svg className="h-4 w-4 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      );
      default: return (
        <svg className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
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
            className="text-[13px] font-medium text-[var(--accent)] transition-colors hover:text-[var(--accent-hover)]"
          >
            Mark all as read
          </button>
        }
      />

      {notifications.length === 0 ? (
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-8 text-center sm:p-12">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent-subtle)]">
            <svg className="h-5 w-5 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <h3 className="mb-1.5 text-[15px] font-medium text-white">All Caught Up</h3>
          <p className="mx-auto max-w-sm text-[13px] text-[var(--text-secondary)]">
            You have no new notifications right now.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-raised)]">
          {notifications.map((notif, index) => (
            <div 
              key={notif.id}
              className={`flex gap-4 px-5 py-4 transition-colors hover:bg-white/[0.02] ${
                index !== notifications.length - 1 ? "border-b border-[var(--border-subtle)]" : ""
              } ${notif.read ? "opacity-60" : "bg-white/[0.01]"}`}
            >
              <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                notif.type === "success" ? "bg-emerald-500/10" :
                notif.type === "risk" ? "bg-rose-500/10" : "bg-blue-500/10"
              }`}>
                {getIcon(notif.type)}
              </div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <h3 className={`text-[14px] font-medium ${notif.read ? "text-[var(--text-secondary)]" : "text-white"}`}>
                    {notif.title}
                  </h3>
                  <span className="shrink-0 text-[12px] text-[var(--text-tertiary)]">
                    {notif.time}
                  </span>
                </div>
                <p className="mt-1 text-[13px] text-[var(--text-secondary)]">
                  {notif.message}
                </p>
              </div>
              
              {!notif.read && (
                <div className="mt-2 shrink-0">
                  <div className="h-2 w-2 rounded-full bg-[var(--accent)]" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}