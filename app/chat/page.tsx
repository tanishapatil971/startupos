"use client";

import { useState } from "react";
import PageHeader from "@/components/PageHeader";

export default function ChatPage() {
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const suggestedPrompts = [
    "What is the biggest risk in my current strategy?",
    "What should I prioritize this week?",
    "Challenge my current business model.",
    "How should I approach customer acquisition?"
  ];

  async function sendMessage(text = input) {
    if (!text.trim()) return;

    const userMessage = {
      role: "user" as const,
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
        }),
      });

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Something went wrong.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageHeader 
        title="AI Co-Founder" 
        description="Your strategic startup advisor powered by AI." 
      />

      <div className="glass flex h-[600px] flex-col rounded-[24px] p-6 fade-up">
        <div className="flex-1 overflow-y-auto space-y-6 pr-2">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center p-8 text-center">
              <div className="mb-6 rounded-full bg-indigo-500/10 p-4 text-indigo-400">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-medium text-white">How can I help you today?</h3>
              <p className="mb-8 max-w-sm text-sm text-[var(--text-muted)]">
                Ask me about growth, strategy, or have me challenge your assumptions.
              </p>
              
              <div className="grid w-full max-w-2xl gap-3 sm:grid-cols-2">
                {suggestedPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => sendMessage(prompt)}
                    className="flex text-left items-center rounded-xl border border-white/5 bg-white/[0.02] p-4 text-sm text-[var(--text-muted)] transition-all hover:bg-white/[0.06] hover:text-white"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-5 py-4 sm:max-w-[75%] ${
                      message.role === "user"
                        ? "bg-indigo-600 text-white"
                        : "border border-white/10 bg-white/[0.04] text-gray-100"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-[var(--text-muted)] sm:max-w-[75%]">
                    <span className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-400" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-400" style={{ animationDelay: "0.2s" }} />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-400" style={{ animationDelay: "0.4s" }} />
                    </span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="mt-6 flex gap-3 sm:gap-4">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
            disabled={loading}
            placeholder="Ask your AI co-founder..."
            className="flex-1 rounded-2xl border border-[var(--border-subtle)] bg-white/[0.03] px-4 py-3.5 text-[15px] outline-none transition-colors focus:border-indigo-500/50 disabled:opacity-50"
          />
          <button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            className="flex items-center justify-center rounded-2xl bg-indigo-500 px-6 font-medium text-white transition-all hover:bg-indigo-600 disabled:opacity-50 disabled:hover:bg-indigo-500 sm:px-8"
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
}