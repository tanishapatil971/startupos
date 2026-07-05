"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<string[]>([]);


  useEffect(() => {
    async function loadNotifications() {

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
        })
        .limit(1)
        .single();


      if (error) {
        console.log(error);
        return;
      }


      const alerts: string[] = [];


      if (data.health_score < 60) {
        alerts.push(
          "🔴 Your startup health score is below 60. Immediate action recommended."
        );
      }


      (data.risks || []).forEach((risk: string) => {
        alerts.push(`⚠️ Risk: ${risk}`);
      });


      (data.next_actions || []).forEach((action: string) => {
        alerts.push(`📌 Action: ${action}`);
      });


      setNotifications(alerts);
    }


    loadNotifications();

  }, []);


  return (
    <main className="min-h-screen px-8 py-10 text-white">

      <div className="mb-10">

        <h1 className="shimmer-text text-5xl font-bold">
          Notifications
        </h1>


        <p className="mt-3 text-gray-400">
          AI alerts, risks and execution reminders.
        </p>

      </div>


      {notifications.length === 0 ? (

        <div className="glass rounded-3xl p-10 text-gray-400">
          No notifications yet.
        </div>

      ) : (

        <div className="space-y-4">

          {notifications.map((item, index) => (

            <div
              key={index}
              className="
                glass 
                rounded-3xl 
                p-6 
                transition-all 
                duration-300 
                hover:-translate-y-1
              "
            >
              {item}
            </div>

          ))}

        </div>

      )}

    </main>
  );
}