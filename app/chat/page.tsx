"use client";

import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import PageHeader from "@/components/PageHeader";
import { useAuth } from "@/components/AuthProvider";

export default function ChatPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load company data for contextual prompts
  useEffect(() => {
    async function loadContext() {
      if (!user) return;
      const { data } = await supabase
        .from("companies")
        .select("name")
        .eq("user_id", user.id)
        .single();
      if (data) setCompanyName(data.name);
    }
    loadContext();
  }, [user]);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const suggestedPrompts = [
    "What is the biggest risk in my current strategy?",
    "What should I prioritize this week?",
    "Challenge my current business model.",
    "How should I approach customer acquisition?"
  ];

  async function sendMessage(text = input) {
    if (!text.trim() || loading) return;

    const userMessage = {
      role: "user" as const,
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setError(null);

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

      if (!response.ok) {
        let errMsg = `Request failed (${response.status})`;
        try {
          const errData = await response.json();
          if (errData.error) errMsg = errData.error;
        } catch {}
        throw new Error(errMsg);
      }

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply,
        },
      ]);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Something went wrong.";
      setError(errMsg);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function retryLast() {
    // Find the last user message and resend
    const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
    if (!lastUserMsg) return;
    // Remove the failed assistant response
    setMessages((prev) => {
      const newMsgs = [...prev];
      if (newMsgs.length > 0 && newMsgs[newMsgs.length - 1].role === "assistant") {
        newMsgs.pop();
      }
      // Also remove the user message since sendMessage will re-add it
      if (newMsgs.length > 0 && newMsgs[newMsgs.length - 1].role === "user") {
        newMsgs.pop();
      }
      return newMsgs;
    });
    setError(null);
    sendMessage(lastUserMsg.content);
  }

  return (
    <div className="flex h-[calc(100vh-var(--topbar-height)-3rem)] flex-col sm:h-[calc(100vh-var(--topbar-height)-4rem)]">
      <PageHeader
        title="AI Chat"
        description="Strategic startup advisor powered by AI."
      />

      {/* Chat container */}
      <div className="flex min-h-0 flex-1 flex-col rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-raised)]">
        
        {/* Messages area */}
        <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center px-4">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent-subtle)]">
                <svg className="h-5 w-5 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="mb-1 text-[15px] font-medium text-white">
                {companyName ? `How can I help ${companyName}?` : "How can I help your startup?"}
              </h3>
              <p className="mb-6 max-w-md text-center text-[13px] text-[var(--text-secondary)]">
                I can help with strategy, growth, market analysis, fundraising, product decisions, and challenging your assumptions. Ask me anything about your startup.
              </p>
              
              <div className="grid w-full max-w-lg gap-2 sm:grid-cols-2">
                {suggestedPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => sendMessage(prompt)}
                    className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] px-3.5 py-2.5 text-left text-[13px] text-[var(--text-secondary)] transition-colors hover:border-[var(--accent)]/30 hover:text-white"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl px-4 py-3 text-[14px] leading-relaxed sm:max-w-[72%] ${
                      message.role === "user"
                        ? "bg-[var(--accent)] text-white"
                        : "border border-[var(--border-subtle)] bg-[var(--surface)] text-[var(--text-primary)]"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <div className="mb-1 text-[11px] font-medium text-[var(--accent)]">StartupOS AI</div>
                    )}
                    <div className="whitespace-pre-wrap">{message.content}</div>
                  </div>
                </div>
              ))}
              
              {/* Typing indicator */}
              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] px-4 py-3">
                    <div className="mb-1 text-[11px] font-medium text-[var(--accent)]">StartupOS AI</div>
                    <span className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] typing-dot" />
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] typing-dot" />
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] typing-dot" />
                    </span>
                  </div>
                </div>
              )}

              {/* Error/retry */}
              {error && !loading && (
                <div className="flex justify-center">
                  <button
                    onClick={retryLast}
                    className="rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 py-1.5 text-[12px] font-medium text-rose-400 transition-colors hover:bg-rose-500/20"
                  >
                    Request failed — Retry
                  </button>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Composer */}
        <div className="border-t border-[var(--border-subtle)] px-4 py-3 sm:px-6">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              disabled={loading}
              placeholder="Ask your AI advisor..."
              className="flex-1 rounded-lg border border-[var(--border-subtle)] bg-white/[0.03] px-3.5 py-2.5 text-[14px] outline-none transition-colors placeholder:text-[var(--text-tertiary)] focus:border-[var(--accent)]/50 disabled:opacity-50"
              id="chat-input"
              aria-label="Chat message input"
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              className="flex items-center justify-center rounded-lg bg-[var(--accent)] px-4 text-[13px] font-medium text-white transition-colors hover:bg-[var(--accent-hover)] disabled:opacity-50 disabled:hover:bg-[var(--accent)] sm:px-6"
              aria-label="Send message"
              id="chat-send-btn"
            >
              <svg className="h-4 w-4 sm:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}