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
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <h1 className="text-4xl font-bold mb-2">
        AI Co-Founder
      </h1>

      <p className="text-gray-400 mb-8">
        Ask anything about your startup.
      </p>

      <div className="rounded-xl bg-slate-900 border border-slate-700 h-[500px] overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <p className="text-gray-500">
            Start a conversation...
          </p>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`rounded-lg p-4 ${
              message.role === "user"
                ? "bg-blue-600 ml-auto max-w-xl"
                : "bg-slate-800 max-w-xl"
            }`}
          >
            {message.content}
          </div>
        ))}

        {loading && (
          <p className="text-gray-400">
            Thinking...
          </p>
        )}
      </div>

      <div className="flex gap-4 mt-6">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
          placeholder="Ask your AI co-founder..."
          className="flex-1 rounded-lg bg-slate-900 border border-slate-700 p-4"
        />

        <button
          onClick={sendMessage}
          disabled={loading}
          className="rounded-lg bg-blue-600 px-6 hover:bg-blue-700 disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </main>
  );
}