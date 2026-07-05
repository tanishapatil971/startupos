"use client";

import { useState } from "react";

export default function ChatPage() {
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim()) return;

    const userMessage = {
      role: "user" as const,
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);

    const currentInput = input;
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: currentInput,
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
  <main className="min-h-screen px-8 py-12 text-white">

    <div className="mb-10">
      <h1 className="text-5xl font-bold shimmer-text">
        AI Co-Founder
      </h1>

      <p className="mt-3 text-gray-400">
        Your strategic startup advisor powered by AI.
      </p>
    </div>

    <div className="glass flex h-[600px] flex-col rounded-3xl p-6">

      <div className="flex-1 overflow-y-auto space-y-5 pr-2">

        {messages.length === 0 && (
          <div className="flex h-full items-center justify-center">
            <p className="text-gray-500">
              Ask about growth, strategy, risks, or execution...
            </p>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`max-w-2xl rounded-2xl px-5 py-4 ${
              message.role === "user"
                ? "ml-auto bg-indigo-500 text-white"
                : "bg-white/[0.06] border border-white/10"
            }`}
          >
            {message.content}
          </div>
        ))}

        {loading && (
          <p className="text-gray-400">
            AI is thinking...
          </p>
        )}

      </div>

      <div className="mt-6 flex gap-4">

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
          placeholder="Ask your AI co-founder..."
          className="flex-1 rounded-2xl border border-white/10 bg-white/[0.04] p-4 outline-none focus:border-indigo-400"
        />

        <button
          onClick={sendMessage}
          disabled={loading}
          className="rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 px-8 font-medium disabled:opacity-50"
        >
          Send
        </button>

      </div>

    </div>

  </main>
);
}