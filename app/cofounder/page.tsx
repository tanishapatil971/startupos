"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface Message {
  role: "user" | "ai";
  text: string;
}

export default function CofounderPage() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function askAI() {
    if (!question.trim() || loading) return;

    setLoading(true);
    setError(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      // Fetch company and memory concurrently
      const [companyRes, memoryRes] = await Promise.all([
        supabase
          .from("companies")
          .select("id, name, industry, stage, description, target_customers, business_model, current_problem, main_goal")
          .eq("user_id", user.id)
          .single(),
        supabase
          .from("company_memory")
          .select("source, title, content")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(20)
      ]);

      const { data: company, error: companyError } = companyRes;
      const { data: memory, error: memoryError } = memoryRes;

      if (companyError || !company) {
        console.error("Failed to load company profile");
        setLoading(false);
        return;
      }

      if (memoryError) {
        console.error("Failed to load company memory");
      }

      // Build memory context
      let memoryContext = "No company memory available.";
      if (memory && memory.length > 0) {
        const fullContext = memory
          .map((m) => `\nSource: ${m.source}\n\nTitle: ${m.title}\n\nContent:\n${m.content}\n`)
          .join("\n----------------------\n");
        const MAX_MEMORY_CHARS = 10000;
        memoryContext = fullContext.length > MAX_MEMORY_CHARS
          ? fullContext.substring(0, MAX_MEMORY_CHARS) + "\n...[TRUNCATED]"
          : fullContext;
      }

      // Prompt
      const prompt = `
You are StartupOS, an AI Chief of Staff for founders.

You ONLY help with:
- startups
- business strategy
- growth
- marketing
- product decisions
- fundraising
- operations

Reject unrelated requests politely.

========================
COMPANY PROFILE
========================

Name:
${company.name}

Industry:
${company.industry}

Stage:
${company.stage}

Description:
${company.description}

Customers:
${company.target_customers}

Business Model:
${company.business_model}

Current Problem:
${company.current_problem}

Main Goal:
${company.main_goal}

========================
COMPANY MEMORY
========================

${memoryContext}

========================
FOUNDER QUESTION
========================

${question}

Instructions:
- Use the company profile.
- Use company memory whenever relevant.
- If company memory contains the answer, prioritize it.
- Give practical founder-level advice.
`;

      const response = await fetch("/api/cofounder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
        }),
      });

      if (!response.ok) {
        let errMsg = `Request failed (${response.status})`;
        try {
          const errData = await response.json();
          if (errData.error) errMsg = errData.error;
        } catch {}
        throw new Error(errMsg);
      }

      const result = await response.json();

      const answer = result.answer;

      // Save chat
      await supabase.from("ai_chats").insert({
        user_id: user.id,
        company_id: company.id,
        question,
        answer,
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          text: question,
        },
        {
          role: "ai",
          text: answer,
        },
      ]);

      setQuestion("");
    } catch (err) {
      console.error("Cofounder query failed:", err instanceof Error ? err.message : "Unknown error");
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen p-10 text-white">
      <h1 className="shimmer-text text-5xl font-bold leading-tight pb-2">
        AI Cofounder
      </h1>

      <p className="text-gray-400 mb-8">
        Ask StartupOS anything about your company.
      </p>

      <div className="space-y-5 mb-8">
        {messages.map((m, i) => (
          <div
            key={i}
            className="glass rounded-3xl p-5"
          >
            <b>{m.role === "ai" ? "StartupOS" : "You"}</b>

            <p className="mt-3 whitespace-pre-wrap">
              {m.text}
            </p>
          </div>
        ))}
      </div>

      <div className="glass rounded-3xl p-5 flex flex-col gap-4">
        <div className="flex gap-4">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                askAI();
              }
            }}
            placeholder="Ask your AI Cofounder..."
            className="flex-1 bg-transparent outline-none disabled:opacity-50"
            disabled={loading}
          />

          <button
            onClick={askAI}
            disabled={loading || !question.trim()}
            className="rounded-xl bg-indigo-500 px-6 py-3 font-semibold disabled:opacity-50"
          >
            {loading ? "Thinking..." : "Ask"}
          </button>
        </div>
        {error && (
          <div className="rounded-xl bg-rose-500/10 px-4 py-3 text-sm text-rose-400 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={askAI} className="underline font-medium hover:text-rose-300">
              Try Again
            </button>
          </div>
        )}
      </div>
    </main>
  );
}