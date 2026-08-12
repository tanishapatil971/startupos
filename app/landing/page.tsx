"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

/* ────────────────────────────────────────────────────────────────────────
   ICONS — all inline SVG, zero external dependencies
──────────────────────────────────────────────────────────────────────── */
const I = {
  layers: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>
    </svg>
  ),
  arrow: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  ),
  arrowRight: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  ),
  check: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5"/>
    </svg>
  ),
  x: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18M6 6l12 12"/>
    </svg>
  ),
  minus: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14"/>
    </svg>
  ),
  shield: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  lock: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  ),
  brain: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/>
    </svg>
  ),
  target: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
    </svg>
  ),
  zap: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>
    </svg>
  ),
  map: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"/><path d="M15 5.764v15M9 3.236v15"/>
    </svg>
  ),
  history: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/>
    </svg>
  ),
  chat: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/>
    </svg>
  ),
  plus: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5v14"/>
    </svg>
  ),
  chevronDown: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6"/>
    </svg>
  ),
  spark: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    </svg>
  ),
  server: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><path d="M6 6h.01M6 18h.01"/>
    </svg>
  ),
  eye: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  notification: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
    </svg>
  ),
  search: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
    </svg>
  ),
  filter: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
    </svg>
  ),
};

/* ────────────────────────────────────────────────────────────────────────
   DESIGN TOKENS (supplement globals.css)
──────────────────────────────────────────────────────────────────────── */
const t = {
  indigo: "#6366f1",
  violet: "#8b5cf6",
  cyan: "#22d3ee",
  rose: "#f43f5e",
  emerald: "#10b981",
  amber: "#f59e0b",

  indigoSoft: "rgba(99,102,241,0.12)",
  indigoBorder: "rgba(99,102,241,0.28)",
  violetSoft: "rgba(139,92,246,0.12)",
  violetBorder: "rgba(139,92,246,0.28)",
  cyanSoft: "rgba(34,211,238,0.08)",
  cyanBorder: "rgba(34,211,238,0.22)",
  roseSoft: "rgba(244,63,94,0.1)",
  roseBorder: "rgba(244,63,94,0.22)",
  emeraldSoft: "rgba(16,185,129,0.1)",
  emeraldBorder: "rgba(16,185,129,0.22)",
  amberSoft: "rgba(245,158,11,0.1)",
  amberBorder: "rgba(245,158,11,0.22)",

  surface: "rgba(255,255,255,0.03)",
  surfaceHover: "rgba(255,255,255,0.055)",
  border: "rgba(255,255,255,0.08)",
  borderStrong: "rgba(255,255,255,0.14)",
  muted: "#9295a3",
  faint: "#5d6070",
  fg: "#f4f4f6",
} as const;

const MAX_W = "1120px";
const SECTION_PAD = "clamp(4rem, 8vw, 6rem) 1.5rem";

/* ────────────────────────────────────────────────────────────────────────
   SHARED COMPONENTS
──────────────────────────────────────────────────────────────────────── */
function SectionLabel({ children }: { children: string }) {
  return (
    <div style={{ fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.13em", textTransform: "uppercase", color: t.indigo, marginBottom: "0.875rem" }}>
      {children}
    </div>
  );
}

function SectionHeading({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <h2 style={{ fontSize: "clamp(1.875rem, 4vw, 2.625rem)", fontWeight: 800, letterSpacing: "-0.038em", color: t.fg, lineHeight: 1.15, ...style }}>
      {children}
    </h2>
  );
}

function SectionSubtext({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <p style={{ fontSize: "clamp(0.9375rem, 1.5vw, 1.0625rem)", lineHeight: 1.7, color: t.muted, ...style }}>
      {children}
    </p>
  );
}

function Divider() {
  return <div style={{ height: "1px", background: `linear-gradient(90deg, transparent, ${t.border}, transparent)`, maxWidth: MAX_W, margin: "0 auto" }} />;
}

function Tag({ color, icon, children }: { color: string; icon: React.ReactNode; children: string }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.325rem 0.75rem", borderRadius: "9999px", border: `1px solid ${color}40`, background: `${color}10`, fontSize: "0.8rem", fontWeight: 500, color, marginBottom: "1.25rem" }}>
      {icon}{children}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────
   FADE UP BLUR REVEAL WRAPPER
──────────────────────────────────────────────────────────────────────── */
function ScrollReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────────────────
   PREMIUM CANVAS PARTICLE NETWORK
──────────────────────────────────────────────────────────────────────── */
function CanvasParticles() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = 680);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = 680;
    };

    window.addEventListener("resize", handleResize);

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
    }> = [];

    const numParticles = Math.min(35, Math.floor(width / 40));
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        r: Math.random() * 1.5 + 0.5,
      });
    }

    let isVisible = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    const draw = () => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Draw particles
      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(139, 92, 246, 0.14)";
        ctx.fill();

        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${0.05 * (1 - dist / 130)})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
    };
  }, [shouldReduceMotion]);

  if (shouldReduceMotion) return null;

  return (
    <div ref={containerRef} style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 0, pointerEvents: "none" }}>
      <canvas ref={canvasRef} style={{ display: "block", opacity: 0.85 }} />
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────
   INTERACTIVE LIVE PRODUCT DEMO (dashboard simulation)
──────────────────────────────────────────────────────────────────────── */
function ProductDemo() {
  const [activeTab, setActiveTab] = useState<"analysis" | "roadmap" | "chat">("analysis");
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Auto-play state machine logic
  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      setActiveTab((prev) => {
        if (prev === "analysis") return "roadmap";
        if (prev === "roadmap") return "chat";
        return "analysis";
      });
    }, 11000);

    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <section
      style={{ padding: SECTION_PAD, maxWidth: MAX_W, margin: "0 auto" }}
      id="demo"
      ref={containerRef}
    >
      <ScrollReveal>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <SectionLabel>Live Product Experience</SectionLabel>
          <SectionHeading>Designed for founders, trusted by boards.</SectionHeading>
          <SectionSubtext style={{ maxWidth: 540, margin: "1rem auto 0" }}>
            Experience StartupOS&apos;s active strategic engine. Autoplays through different views. Hover anywhere to pause and interact manually.
          </SectionSubtext>
        </div>
      </ScrollReveal>

      {/* Main dashboard frame */}
      <motion.div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ position: "relative" }}
        whileHover={{ y: -3 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Ambient glow backing */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: "-1px",
            borderRadius: "20px",
            background: "linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(139,92,246,0.1) 50%, rgba(34,211,238,0.1) 100%)",
            filter: "blur(2px)",
            zIndex: 0,
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            borderRadius: "20px",
            border: `1px solid ${t.border}`,
            background: "rgba(10, 11, 15, 0.96)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            overflow: "hidden",
            boxShadow: "0 24px 60px -15px rgba(0, 0, 0, 0.6)",
          }}
        >
          {/* Browser header bar */}
          <div
            style={{
              padding: "0.75rem 1.25rem",
              borderBottom: `1px solid ${t.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "rgba(255, 255, 255, 0.01)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              {["#ef4444", "#f59e0b", "#22c55e"].map((c) => (
                <div key={c} style={{ width: 9, height: 9, borderRadius: "50%", background: c, opacity: 0.65 }} />
              ))}
              <div
                style={{
                  marginLeft: "0.75rem",
                  width: "160px",
                  height: "22px",
                  borderRadius: "6px",
                  background: "rgba(255,255,255,0.03)",
                  border: `1px solid ${t.border}`,
                  display: "flex",
                  alignItems: "center",
                  padding: "0 0.5rem",
                }}
              >
                <span style={{ fontSize: "0.7rem", color: t.faint }}>startupos.app/workspace</span>
              </div>
            </div>
            {/* Topbar User Indicator */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <span style={{ display: "flex", color: t.muted }}>{I.notification}</span>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.25rem 0.6rem", borderRadius: "8px", background: "rgba(255,255,255,0.02)", border: `1px solid ${t.border}` }}>
                <div style={{ width: 14, height: 14, borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", fontSize: "0.55rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>S</div>
                <span style={{ fontSize: "0.75rem", fontWeight: 500, color: t.muted }}>Sandbox OS</span>
              </div>
            </div>
          </div>

          {/* SaaS Workspace Layout: Sidebar + main workspace panel */}
          <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", minHeight: "440px" }}>
            {/* Sidebar element for realism */}
            <div style={{ borderRight: `1px solid ${t.border}`, background: "rgba(0,0,0,0.15)", padding: "1.25rem 1rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div>
                <span style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: t.faint }}>Workspace</span>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem", marginTop: "0.5rem" }}>
                  {["Overview", "Strategy Team", "Knowledge Base"].map((item, idx) => (
                    <div key={item} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.4rem 0.5rem", borderRadius: "8px", background: idx === 0 ? "rgba(255,255,255,0.02)" : "transparent", color: idx === 0 ? t.fg : t.muted, fontSize: "0.75rem", cursor: "default" }}>
                      <span style={{ width: 5, height: 5, borderRadius: "50%", background: idx === 0 ? t.indigo : "transparent" }} />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <span style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: t.faint }}>Navigation tabs</span>
                {/* Active Tabs Controls inside the sidebar */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem", marginTop: "0.5rem" }}>
                  {[
                    { id: "analysis", label: "AI Strategic Analysis", icon: I.brain },
                    { id: "roadmap", label: "Interactive Roadmap", icon: I.map },
                    { id: "chat", label: "AI Co-Founder Chat", icon: I.chat },
                  ].map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as "analysis" | "roadmap" | "chat")}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.6rem",
                          width: "100%",
                          padding: "0.5rem",
                          borderRadius: "8px",
                          border: "none",
                          background: isActive ? t.indigoSoft : "transparent",
                          color: isActive ? "#818cf8" : t.muted,
                          fontSize: "0.75rem",
                          fontWeight: 500,
                          cursor: "pointer",
                          textAlign: "left",
                          transition: "all 0.2s ease",
                        }}
                      >
                        <span style={{ display: "flex", flexShrink: 0 }}>{tab.icon}</span>
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Status bar */}
              <div style={{ marginTop: "auto", padding: "0.5rem", borderRadius: "8px", background: "rgba(255,255,255,0.01)", border: `1px solid ${t.border}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: t.emerald, display: "inline-block", boxShadow: `0 0 6px 1px ${t.emerald}55` }} />
                  <span style={{ fontSize: "0.65rem", color: t.faint }}>Engine synchronized</span>
                </div>
              </div>
            </div>

            {/* Main content viewport */}
            <div style={{ padding: "1.5rem", background: "rgba(255,255,255,0.005)", minHeight: "440px" }}>
              <AnimatePresence mode="wait">
                {activeTab === "analysis" && (
                  <motion.div
                    key="analysis"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <DemoAnalysis isActive={activeTab === "analysis"} />
                  </motion.div>
                )}
                {activeTab === "roadmap" && (
                  <motion.div
                    key="roadmap"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <DemoRoadmap isActive={activeTab === "roadmap"} />
                  </motion.div>
                )}
                {activeTab === "chat" && (
                  <motion.div
                    key="chat"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <DemoChat isActive={activeTab === "chat"} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────
   SUB-COMPONENT: TAB 1: DEMO ANALYSIS
──────────────────────────────────────────────────────────────────────── */
const DEMO_ANALYSIS_STEPS = [64, 72, 81, 87, 91];

function DemoAnalysis({ isActive }: { isActive: boolean }) {
  const [score, setScore] = useState(64);

  useEffect(() => {
    if (!isActive) return;
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < DEMO_ANALYSIS_STEPS.length - 1) {
        idx++;
        setScore(DEMO_ANALYSIS_STEPS[idx]);
      } else {
        clearInterval(interval);
      }
    }, 1800);

    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      {/* Workspace Subheading / Search filters */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontSize: "0.875rem", fontWeight: 700, color: t.fg }}>Overview Report</span>
          <span style={{ fontSize: "0.6875rem", padding: "0.15rem 0.4rem", borderRadius: "4px", background: "rgba(255,255,255,0.05)", border: `1px solid ${t.border}`, color: t.muted }}>v2.4</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", padding: "0.25rem 0.5rem", borderRadius: "6px", background: "rgba(255,255,255,0.02)", border: `1px solid ${t.border}`, color: t.faint, fontSize: "0.7rem" }}>
            {I.search} <span style={{ color: t.muted }}>Search metrics...</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", padding: "0.25rem 0.5rem", borderRadius: "6px", background: "rgba(255,255,255,0.02)", border: `1px solid ${t.border}`, color: t.muted, fontSize: "0.7rem" }}>
            {I.filter} Filter
          </div>
        </div>
      </div>

      {/* Goal details bar */}
      <div style={{ padding: "0.75rem 1rem", borderRadius: "10px", border: `1px solid ${t.border}`, background: t.surface, display: "flex", alignItems: "center", gap: "0.6rem", fontSize: "0.8rem" }}>
        <span style={{ color: t.faint, fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>Goal</span>
        <span style={{ color: t.fg, opacity: 0.9 }}>Acquire 100 recurring customers in Q3</span>
      </div>

      {/* Core metrics row: score + chart */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        {/* Dynamic circular indicator card */}
        <div style={{ padding: "1.25rem", borderRadius: 14, border: `1px solid ${t.border}`, background: "rgba(255,255,255,0.01)", display: "flex", alignItems: "center", gap: "1.25rem" }}>
          {/* Radial indicator */}
          <div style={{ position: "relative", width: 76, height: 76, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="76" height="76" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="38" cy="38" r="32" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="6" />
              <motion.circle
                cx="38"
                cy="38"
                r="32"
                fill="none"
                stroke="url(#indigoGrad)"
                strokeWidth="6"
                strokeLinecap="round"
                initial={{ strokeDasharray: "201", strokeDashoffset: "201" }}
                animate={{ strokeDashoffset: 201 - (201 * score) / 100 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              />
              <defs>
                <linearGradient id="indigoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#22d3ee" />
                </linearGradient>
              </defs>
            </svg>
            <div style={{ position: "absolute", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <span style={{ fontSize: "1.25rem", fontWeight: 800, color: t.fg, letterSpacing: "-0.02em", lineHeight: 1 }}>{score}</span>
              <span style={{ fontSize: "0.55rem", color: t.faint, fontWeight: 600 }}>HEALTH</span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: t.faint, marginBottom: "0.25rem" }}>Strategic Index</div>
            <p style={{ fontSize: "0.75rem", color: t.muted, lineHeight: 1.4, margin: 0 }}>
              Recalculating momentum against target goal.
            </p>
          </div>
        </div>

        {/* Growth line graph */}
        <div style={{ padding: "1rem 1.25rem", borderRadius: 14, border: `1px solid ${t.border}`, background: "rgba(255,255,255,0.01)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: t.faint }}>Monthly growth run-rate</span>
            <span style={{ fontSize: "0.75rem", fontWeight: 600, color: t.emerald }}>+18.4%</span>
          </div>

          <div style={{ height: "48px", position: "relative", marginTop: "0.4rem" }}>
            <svg width="100%" height="48" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgba(99, 102, 241, 0.24)" />
                  <stop offset="100%" stopColor="rgba(99, 102, 241, 0.0)" />
                </linearGradient>
              </defs>
              {/* Grid lines */}
              <line x1="0%" y1="20%" x2="100%" y2="20%" stroke="rgba(255,255,255,0.02)" />
              <line x1="0%" y1="60%" x2="100%" y2="60%" stroke="rgba(255,255,255,0.02)" />
              {/* Graph area path */}
              <path d="M 0 45 Q 30 35 60 40 T 120 20 T 180 25 T 240 10 L 320 8 L 320 48 L 0 48 Z" fill="url(#chartGrad)" />
              {/* Graph line */}
              <motion.path
                d="M 0 45 Q 30 35 60 40 T 120 20 T 180 25 T 240 10 L 320 8"
                fill="none"
                stroke="#6366f1"
                strokeWidth="1.75"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.6, ease: "easeInOut" }}
              />
              {/* Dot pulsers */}
              <circle cx="95%" cy="8" r="3" fill="#22d3ee" />
              <circle cx="95%" cy="8" r="6" fill="none" stroke="#22d3ee" strokeWidth="1" style={{ transformOrigin: "240px 10px", animation: "pulse-ring 2s infinite" }} />
            </svg>
          </div>
        </div>
      </div>

      {/* Structured report data grids */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
        {[
          {
            label: "Surfaced risks",
            color: t.rose,
            badge: "Blocking",
            items: ["Activation conversion rate dropped to 18%", "Pricing tier structures feel confusing to leads", "Direct competitive pricing matches model"],
          },
          {
            label: "Strategic opportunities",
            color: t.emerald,
            badge: "Growth",
            items: ["Launch an organic B2B partner incentive", "Adopt direct post-demo automated onboarding", "Repackage standard tier with high-value features"],
          },
        ].map((block) => (
          <div key={block.label} style={{ padding: "1rem", borderRadius: 12, border: `1px solid ${t.border}`, background: t.surface }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.625rem" }}>
              <span style={{ fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: t.faint }}>{block.label}</span>
              <span style={{ fontSize: "0.65rem", padding: "0.1rem 0.35rem", borderRadius: "4px", background: `${block.color}15`, color: block.color, border: `1px solid ${block.color}25` }}>{block.badge}</span>
            </div>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {block.items.map((item, idx) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.25 + 0.3, duration: 0.4 }}
                  style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", fontSize: "0.8rem", color: t.muted }}
                >
                  <span style={{ marginTop: 5, width: 4, height: 4, borderRadius: "50%", background: block.color, flexShrink: 0 }} />
                  {item}
                </motion.li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Task checklist panel */}
      <div style={{ padding: "1rem", borderRadius: 12, border: `1px solid ${t.border}`, background: t.surface }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
          <span style={{ fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: t.faint }}>Prioritized Execution Items</span>
          <span style={{ fontSize: "0.75rem", color: t.muted }}>2 of 4 done</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
          {[
            { text: "Launch pricing simplified layout", done: true },
            { text: "Refine post-demo onboarding sequences", done: true },
            { text: "Deploy standard incentive campaigns", done: false },
            { text: "Interview top 5 active customer base", done: false },
          ].map((item) => (
            <div key={item.text} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.4rem 0.6rem", borderRadius: "8px", background: "rgba(255,255,255,0.01)", border: `1px solid ${t.border}` }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 14, height: 14, borderRadius: "4px", border: `1px solid ${item.done ? t.indigo : t.faint}`, background: item.done ? t.indigoSoft : "transparent", color: t.indigo, flexShrink: 0 }}>
                {item.done && I.check}
              </div>
              <span style={{ fontSize: "0.75rem", color: item.done ? t.muted : t.fg, textDecoration: item.done ? "line-through" : "none" }}>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────
   SUB-COMPONENT: TAB 2: DEMO ROADMAP
──────────────────────────────────────────────────────────────────────── */
function DemoRoadmap(_props: { isActive: boolean }) {
  const milestones = [
    { week: "Week 1–2", title: "Plug Onboarding Activation Leak", desc: "Redesign core flow, targets 40% conversion metrics. Direct interview on churn paths.", status: "completed" },
    { week: "Week 3–4", title: "Build Viral Growth Loops", desc: "Embed organic referral code flow inside the dashboard interface. Rewards system integration.", status: "current" },
    { week: "Week 5–8", title: "Deploy Distribution Channels", desc: "Position weekly update content calendar. Target 2 key directory placements.", status: "upcoming" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      {/* Title info */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
        <span style={{ fontSize: "0.875rem", fontWeight: 700, color: t.fg }}>Tactical Roadmap</span>
        <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: t.indigo }} />
          <span style={{ fontSize: "0.7rem", color: t.muted }}>Q3 Timeline</span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", position: "relative" }}>
        {/* Growing SVG track line in behind */}
        <div style={{ position: "absolute", left: 21, top: 20, bottom: 20, width: 1, background: `linear-gradient(to bottom, ${t.indigo} 30%, ${t.border} 70%)` }} />

        {milestones.map((m, idx) => {
          const isCurrent = m.status === "current";
          const isCompleted = m.status === "completed";

          return (
            <motion.div
              key={m.week}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.2, duration: 0.5 }}
              style={{
                display: "flex",
                gap: "1.25rem",
                padding: "1rem",
                borderRadius: 12,
                border: `1px solid ${isCurrent ? t.indigoBorder : t.border}`,
                background: isCurrent ? t.indigoSoft : t.surface,
                alignItems: "flex-start",
                zIndex: 1,
              }}
            >
              {/* Dot marker */}
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  background: isCompleted ? t.indigo : isCurrent ? t.indigoSoft : "rgba(0,0,0,0.3)",
                  border: `1px solid ${isCompleted || isCurrent ? t.indigo : t.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.7rem",
                  fontWeight: 800,
                  color: isCompleted ? "#fff" : isCurrent ? "#818cf8" : t.faint,
                  flexShrink: 0,
                  marginTop: 2,
                }}
              >
                {isCompleted ? I.check : idx + 1}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem", marginBottom: "0.25rem" }}>
                  <span style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.05em", color: isCurrent ? "#818cf8" : t.faint, textTransform: "uppercase" }}>{m.week}</span>
                  <span
                    style={{
                      fontSize: "0.65rem",
                      padding: "0.15rem 0.45rem",
                      borderRadius: "99px",
                      background: isCompleted ? "rgba(16,185,129,0.12)" : isCurrent ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.03)",
                      color: isCompleted ? t.emerald : isCurrent ? "#818cf8" : t.muted,
                      fontWeight: 600,
                      border: `1px solid ${isCompleted ? "rgba(16,185,129,0.25)" : isCurrent ? t.indigoBorder : t.border}`,
                    }}
                  >
                    {isCompleted ? "Completed" : isCurrent ? "Active Sprint" : "Scheduled"}
                  </span>
                </div>
                <div style={{ fontSize: "0.875rem", fontWeight: 700, color: t.fg, marginBottom: "0.125rem" }}>{m.title}</div>
                <p style={{ fontSize: "0.75rem", color: t.muted, lineHeight: 1.5, margin: 0 }}>{m.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────
   SUB-COMPONENT: TAB 3: DEMO CHAT
──────────────────────────────────────────────────────────────────────── */
const DEMO_FULL_CONVERSATION = [
  { role: "user" as const, text: "Leads report our pricing tiers are hard to evaluate. Advice?" },
  {
    role: "ai" as const,
    text: "Understood. The telemetry score shows pricing evaluate confusion has stalled 3 late-stage conversions.\n\nImmediate Action: Package into 3 explicit segments: Starter, Team, and Scale. Set a clear comparison block above the fold.\n\nNext Step: Run an automated post-demo email offering 14 days standard trial terms. Keep it frictionless.",
  },
];

function DemoChat({ isActive }: { isActive: boolean }) {
  const [messages, setMessages] = useState<Array<{ role: "user" | "ai"; text: string }>>([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!isActive) {
      const resetTimer = setTimeout(() => {
        setMessages([]);
        setIsTyping(false);
      }, 0);
      return () => clearTimeout(resetTimer);
    }

    const t1 = setTimeout(() => {
      setMessages([DEMO_FULL_CONVERSATION[0]]);
      setIsTyping(true);
    }, 800);

    const t2 = setTimeout(() => {
      setIsTyping(false);
      setMessages([DEMO_FULL_CONVERSATION[0], DEMO_FULL_CONVERSATION[1]]);
    }, 3800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [isActive]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem", minHeight: "320px", maxHeight: "360px", overflowY: "auto", paddingRight: "0.25rem" }}>
      {/* Header bar info */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${t.border}`, paddingBottom: "0.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <span style={{ display: "flex", color: "#a78bfa" }}>{I.spark}</span>
          <span style={{ fontSize: "0.8rem", fontWeight: 700, color: t.fg }}>Co-Founder Assistant</span>
        </div>
        <span style={{ fontSize: "0.65rem", color: t.faint }}>Current Session Context Active</span>
      </div>

      {messages.map((m, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ display: "flex", gap: "0.75rem", flexDirection: m.role === "user" ? "row-reverse" : "row" }}
        >
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.6rem",
              fontWeight: 700,
              background: m.role === "user" ? "rgba(99,102,241,0.2)" : "rgba(139,92,246,0.2)",
              color: m.role === "user" ? "#818cf8" : "#c4b5fd",
              border: `1px solid ${m.role === "user" ? t.indigoBorder : t.violetBorder}`,
            }}
          >
            {m.role === "user" ? "F" : "AI"}
          </div>
          <div
            style={{
              maxWidth: "80%",
              padding: "0.75rem 0.875rem",
              borderRadius: m.role === "user" ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
              background: m.role === "user" ? t.indigoSoft : t.surface,
              border: `1px solid ${m.role === "user" ? t.indigoBorder : t.border}`,
              fontSize: "0.75rem",
              lineHeight: 1.6,
              color: t.fg,
              whiteSpace: "pre-line",
            }}
          >
            {m.text}
          </div>
        </motion.div>
      ))}

      {isTyping && (
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <div style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(139,92,246,0.2)", display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${t.violetBorder}` }}>
            <span style={{ display: "flex", color: "#c4b5fd" }}>{I.spark}</span>
          </div>
          {/* Pulsing visual indicator */}
          <div style={{ display: "flex", gap: "0.25rem", padding: "0.5rem 0.75rem", borderRadius: "10px", background: t.surface, border: `1px solid ${t.border}` }}>
            {[1, 2, 3].map((dot) => (
              <span
                key={dot}
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: t.faint,
                  animation: `glow-pulse 1.4s ease-in-out infinite`,
                  animationDelay: `${dot * 0.2}s`,
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────
   SECTION 4 — PROBLEM STATEMENT
──────────────────────────────────────────────────────────────────────── */
function ProblemSection() {
  const pains = [
    { label: "Too much advice,\nnot enough signal", detail: "Investors say one thing. Advisors say another. Communities say a third. You spend more time filtering opinions than making decisions." },
    { label: "No one knows\nyour context", detail: "Generic AI tools give generic answers. They don't know your industry, your stage, your customers, or what you tried last month." },
    { label: "The urgent\ncrowds out the strategic", detail: "Customer support, bugs, sales calls. The day disappears. You never get the two quiet hours you need to actually think about where the company is going." },
    { label: "Progress is hard\nto measure", detail: "Is momentum building or stalling? Is the risk you worried about last quarter still real? Without a consistent framework, it's impossible to know." },
  ];

  return (
    <section style={{ padding: SECTION_PAD, maxWidth: MAX_W, margin: "0 auto" }}>
      <ScrollReveal>
        <div style={{ marginBottom: "3.5rem" }}>
          <SectionLabel>The problem</SectionLabel>
          <SectionHeading style={{ maxWidth: 680 }}>
            Founders have more information than ever.<br />
            <span style={{ color: t.muted, fontWeight: 600 }}>And less clarity than ever before.</span>
          </SectionHeading>
          <SectionSubtext style={{ maxWidth: 560, marginTop: "1.125rem" }}>
            You are not short of opinions. You are short of a clear, consistent, context-aware read on where your startup actually stands — and what to do about it.
          </SectionSubtext>
        </div>
      </ScrollReveal>

      <ScrollReveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1px", borderRadius: 20, overflow: "hidden", border: `1px solid ${t.border}`, background: t.border }}>
          {pains.map((p, i) => (
            <div key={i} style={{ padding: "2rem 1.75rem", background: "var(--background)", position: "relative" }}>
              <div style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.04em", color: t.roseSoft.replace("0.1)", "0.25)"), marginBottom: "1rem", fontVariantNumeric: "tabular-nums" }}>
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 style={{ fontSize: "1.0625rem", fontWeight: 700, letterSpacing: "-0.025em", color: t.fg, lineHeight: 1.35, marginBottom: "0.625rem", whiteSpace: "pre-line" }}>
                {p.label}
              </h3>
              <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: t.muted }}>
                {p.detail}
              </p>
              {i === 0 && <div aria-hidden="true" style={{ position: "absolute", top: 0, right: 0, width: 80, height: 80, background: "radial-gradient(ellipse at top right, rgba(244,63,94,0.12), transparent)", borderRadius: "0 20px 0 80px" }} />}
            </div>
          ))}
        </div>
      </ScrollReveal>

      {/* Bridge to solution */}
      <ScrollReveal>
        <div style={{ marginTop: "3rem", padding: "2rem 2.25rem", borderRadius: 16, border: `1px solid ${t.indigoBorder}`, background: t.indigoSoft, display: "flex", alignItems: "flex-start", gap: "1.25rem" }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: t.indigo, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#fff" }}>
            {I.brain}
          </div>
          <div>
            <div style={{ fontSize: "1rem", fontWeight: 700, color: t.fg, marginBottom: "0.375rem", letterSpacing: "-0.02em" }}>
              StartupOS is the strategic layer that connects all of it.
            </div>
            <p style={{ fontSize: "0.9375rem", color: t.muted, lineHeight: 1.65, margin: 0 }}>
              It builds a persistent understanding of your company, then applies that context to every analysis — so you always know where you stand, not just what someone thinks in the abstract.
            </p>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────
   SECTION 5 — HOW IT WORKS
──────────────────────────────────────────────────────────────────────── */
function HowItWorks() {
  const steps = [
    {
      n: "01", color: t.indigo, bg: t.indigoSoft, bd: t.indigoBorder,
      title: "Build your Company Brain",
      detail: "Answer 8 questions about your startup: industry, stage, business model, target customers, main challenge, revenue model, current goal. This creates a persistent, structured profile that every analysis is grounded in.",
      aside: ["Takes 5 minutes", "Saved permanently", "Powers every analysis"],
    },
    {
      n: "02", color: "#8b5cf6", bg: t.violetSoft, bd: t.violetBorder,
      title: "Share your current context",
      detail: "Paste in whatever is relevant right now: meeting notes, investor feedback, customer complaints, competitor news, product updates. No format required — just drop it in as-is.",
      aside: ["No formatting needed", "Works with messy notes", "The more detail, the sharper the output"],
    },
    {
      n: "03", color: t.cyan, bg: t.cyanSoft, bd: t.cyanBorder,
      title: "Get a structured strategic read",
      detail: "StartupOS analyses your context against your company brain and produces a Health Score, top risks, surface opportunities, and a prioritised action list — specific to your situation, not generic advice.",
      aside: ["Health score 0–100", "Risk & opportunity breakdown", "Actionable priority list"],
    },
    {
      n: "04", color: t.emerald, bg: t.emeraldSoft, bd: t.emeraldBorder,
      title: "Refine with your AI Co-Founder",
      detail: "Every analysis opens a dialogue. Ask follow-up questions, stress-test a decision, explore a pivot hypothesis. Your AI Co-Founder knows your full history — it never gives you a generic answer.",
      aside: ["Persistent context across sessions", "Ask anything strategy-related", "Built for founder decisions"],
    },
  ];

  return (
    <section style={{ padding: SECTION_PAD, maxWidth: MAX_W, margin: "0 auto" }} id="how-it-works">
      <ScrollReveal>
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <SectionLabel>How it works</SectionLabel>
          <SectionHeading>From noise to clarity in four steps.</SectionHeading>
          <SectionSubtext style={{ maxWidth: 480, margin: "1rem auto 0" }}>
            The entire workflow is designed to get a sharp read fast — and build toward deeper insight over time.
          </SectionSubtext>
        </div>
      </ScrollReveal>

      <div style={{ display: "grid", gap: "1.25rem" }}>
        {steps.map((s, i) => (
          <ScrollReveal key={s.n} delay={i * 0.1}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "2rem", padding: "2rem 2.25rem", borderRadius: 18, border: `1px solid ${s.bd}`, background: s.bg, alignItems: "start" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.875rem", marginBottom: "0.875rem" }}>
                  <div style={{ width: 34, height: 34, borderRadius: "50%", background: s.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8125rem", fontWeight: 800, color: "#fff", flexShrink: 0 }}>
                    {i + 1}
                  </div>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: s.color }}>{s.n}</span>
                </div>
                <h3 style={{ fontSize: "1.1875rem", fontWeight: 700, letterSpacing: "-0.025em", color: t.fg, marginBottom: "0.625rem" }}>{s.title}</h3>
                <p style={{ fontSize: "0.9375rem", lineHeight: 1.7, color: t.muted, maxWidth: 560 }}>{s.detail}</p>
              </div>
              <ul style={{ listStyle: "none", margin: 0, padding: "1rem 1.25rem", background: "rgba(0,0,0,0.2)", borderRadius: 12, display: "flex", flexDirection: "column", gap: "0.5rem", minWidth: 200, flexShrink: 0 }}>
                {s.aside.map((a) => (
                  <li key={a} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8125rem", color: t.muted }}>
                    <span style={{ color: s.color, display: "flex", flexShrink: 0 }}>{I.check}</span>
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────
   SECTION 6 — CORE FEATURES
──────────────────────────────────────────────────────────────────────── */
function CoreFeatures() {
  const features = [
    {
      icon: I.brain, color: t.indigo, bg: t.indigoSoft, bd: t.indigoBorder,
      title: "Company Brain",
      headline: "Your startup has memory.",
      body: "Every analysis is grounded in your persistent company profile. StartupOS doesn't start fresh each time — it builds a compounding understanding of your business, industry, stage, and goals.",
      bullets: ["8-field structured profile", "Industry & stage context", "Updates as your startup evolves"],
    },
    {
      icon: I.target, color: "#f87171", bg: t.roseSoft, bd: t.roseBorder,
      title: "Health Score",
      headline: "A number you can trust.",
      body: "The Health Score is a 0–100 composite of your momentum, risk profile, and strategic clarity. It's recalculated with every analysis — giving you a consistent metric to track over time.",
      bullets: ["Tracks progress across sessions", "Based on your actual context", "Identifies momentum shifts early"],
    },
    {
      icon: I.zap, color: t.violet, bg: t.violetSoft, bd: t.violetBorder,
      title: "AI Analysis Engine",
      headline: "Structured output, not chat soup.",
      body: "Every analysis returns a consistent structure: overview, risks, opportunities, next actions, roadmap. No walls of text. No need to parse. Just a clear, prioritised breakdown you can act on immediately.",
      bullets: ["Consistent output format", "Risk & opportunity breakdown", "Prioritised action list"],
    },
    {
      icon: I.map, color: t.cyan, bg: t.cyanSoft, bd: t.cyanBorder,
      title: "Strategic Roadmap",
      headline: "Know what to do, and when.",
      body: "Beyond the analysis, StartupOS generates a week-by-week roadmap tied to your current goal — concrete milestones, not vague suggestions. Regenerate it anytime your context changes.",
      bullets: ["Goal-tied milestones", "Regeneratable on demand", "Prioritised by impact"],
    },
    {
      icon: I.chat, color: t.emerald, bg: t.emeraldSoft, bd: t.emeraldBorder,
      title: "AI Co-Founder Chat",
      headline: "A strategist who knows your company.",
      body: "Ask anything — should we raise now, how do we handle this customer complaint, what does our competitor's move mean for us. Your AI Co-Founder brings your full company context to every answer.",
      bullets: ["Context-aware conversations", "Strategy, pricing, positioning", "No hallucinated generics"],
    },
    {
      icon: I.history, color: t.amber, bg: t.amberSoft, bd: t.amberBorder,
      title: "Analysis History",
      headline: "A strategic record, not a chat log.",
      body: "Every analysis is saved as a structured report. Review how your health score has evolved, compare risks across months, and see which actions you actually shipped — and which stalled.",
      bullets: ["Full analysis archive", "Health score trend", "Decision accountability"],
    },
  ];

  return (
    <section style={{ padding: SECTION_PAD, background: "rgba(0,0,0,0.2)" }} id="features">
      <div style={{ maxWidth: MAX_W, margin: "0 auto" }}>
        <ScrollReveal>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <SectionLabel>Core features</SectionLabel>
            <SectionHeading>Everything a founder needs in one place.</SectionHeading>
            <SectionSubtext style={{ maxWidth: 480, margin: "1rem auto 0" }}>
              Not a bundle of disconnected tools. A single coherent system built for how early-stage founders actually think.
            </SectionSubtext>
          </div>
        </ScrollReveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.25rem" }}>
          {features.map((f, i) => (
            <ScrollReveal key={f.title} delay={i * 0.05}>
              <motion.div
                whileHover={{ y: -4, borderColor: t.borderStrong }}
                style={{
                  height: "100%",
                  padding: "1.875rem",
                  borderRadius: 18,
                  border: `1px solid ${f.bd}`,
                  background: f.bg,
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                  transition: "border-color 0.2s ease",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: `${f.color}20`, border: `1px solid ${f.bd}`, display: "flex", alignItems: "center", justifyContent: "center", color: f.color, flexShrink: 0 }}>
                    {f.icon}
                  </div>
                  <span style={{ fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: f.color }}>
                    {f.title}
                  </span>
                </div>
                <div>
                  <h3 style={{ fontSize: "1.0625rem", fontWeight: 700, letterSpacing: "-0.022em", color: t.fg, marginBottom: "0.5rem" }}>{f.headline}</h3>
                  <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: t.muted }}>{f.body}</p>
                </div>
                <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "0.375rem", marginTop: "auto" }}>
                  {f.bullets.map((b) => (
                    <li key={b} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8125rem", color: t.muted }}>
                      <span style={{ color: f.color, display: "flex", flexShrink: 0 }}>{I.arrowRight}</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────
   SECTION 7 — WHY NOT CHATGPT?
──────────────────────────────────────────────────────────────────────── */
function WhyNotChatGPT() {
  const rows = [
    { feature: "Knows your company", chatgpt: "none", startupos: "full" },
    { feature: "Remembers past analyses", chatgpt: "none", startupos: "full" },
    { feature: "Structured founder output", chatgpt: "none", startupos: "full" },
    { feature: "Health score over time", chatgpt: "none", startupos: "full" },
    { feature: "Goal-tied roadmap", chatgpt: "none", startupos: "full" },
    { feature: "Startup-specific reasoning", chatgpt: "partial", startupos: "full" },
    { feature: "General knowledge & writing", chatgpt: "full", startupos: "partial" },
    { feature: "Code generation", chatgpt: "full", startupos: "none" },
  ];

  function Cell({ val }: { val: "full" | "partial" | "none" }) {
    if (val === "full") return <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: "50%", background: t.emeraldSoft, border: `1px solid ${t.emeraldBorder}`, color: t.emerald }}>{I.check}</span>;
    if (val === "partial") return <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: "50%", background: t.amberSoft, border: `1px solid ${t.amberBorder}`, color: t.amber }}>{I.minus}</span>;
    return <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: "50%", background: t.roseSoft, border: `1px solid ${t.roseBorder}`, color: "#f87171" }}>{I.x}</span>;
  }

  return (
    <section style={{ padding: SECTION_PAD, maxWidth: MAX_W, margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "4rem", alignItems: "start" }}>
        {/* Left: copy */}
        <ScrollReveal>
          <div>
            <SectionLabel>Why not ChatGPT?</SectionLabel>
            <SectionHeading style={{ marginBottom: "1.25rem" }}>
              ChatGPT is a brilliant generalist.<br />
              <span style={{ color: t.muted, fontWeight: 600 }}>StartupOS is your strategist.</span>
            </SectionHeading>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginTop: "1.5rem" }}>
              {[
                { heading: "ChatGPT doesn't know your company", text: "Every conversation starts from zero. It doesn't know your stage, your customers, your industry, or what you tried last week. You spend half the prompt establishing context." },
                { heading: "Generic input produces generic output", text: "Ask ChatGPT \"what should my startup do?\" and you'll get a textbook answer. StartupOS answers based on your health score, your risks, and your current context." },
                { heading: "Decisions need structure, not chat", text: "Founder decisions are too important for free-text replies. StartupOS outputs consistent, structured analysis every time — so you can compare, track, and act." },
              ].map((item) => (
                <div key={item.heading} style={{ display: "flex", gap: "0.875rem" }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", background: t.indigoSoft, border: `1px solid ${t.indigoBorder}`, display: "flex", alignItems: "center", justifyContent: "center", color: t.indigo, flexShrink: 0, marginTop: 2 }}>
                    {I.arrowRight}
                  </div>
                  <div>
                    <div style={{ fontSize: "0.9375rem", fontWeight: 600, color: t.fg, marginBottom: "0.25rem" }}>{item.heading}</div>
                    <div style={{ fontSize: "0.875rem", lineHeight: 1.7, color: t.muted }}>{item.text}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: "1.75rem", padding: "1rem 1.25rem", borderRadius: 12, border: `1px solid ${t.border}`, background: t.surface, fontSize: "0.875rem", color: t.muted, lineHeight: 1.65 }}>
              <strong style={{ color: t.fg, fontWeight: 600 }}>The honest take: </strong>
              ChatGPT is a great complementary tool for writing, research, and coding. StartupOS is purpose-built for the specific job of strategic founder decision-making. They serve different needs.
            </div>
          </div>
        </ScrollReveal>

        {/* Right: comparison table */}
        <ScrollReveal>
          <div>
            <div style={{ borderRadius: 18, border: `1px solid ${t.border}`, overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 100px 120px", background: "rgba(0,0,0,0.3)" }}>
                <div style={{ padding: "0.875rem 1.25rem", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: t.faint }}>Capability</div>
                <div style={{ padding: "0.875rem 1rem", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: t.faint, textAlign: "center" }}>ChatGPT</div>
                <div style={{ padding: "0.875rem 1rem", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#818cf8", textAlign: "center" }}>StartupOS</div>
              </div>
              {rows.map((r, i) => (
                <div key={r.feature} style={{ display: "grid", gridTemplateColumns: "1fr 100px 120px", borderTop: `1px solid ${t.border}`, background: i % 2 === 0 ? "transparent" : "rgba(0,0,0,0.1)", alignItems: "center" }}>
                  <div style={{ padding: "0.75rem 1.25rem", fontSize: "0.875rem", color: t.muted }}>{r.feature}</div>
                  <div style={{ display: "flex", justifyContent: "center", padding: "0.75rem 0" }}><Cell val={r.chatgpt as "full" | "partial" | "none"} /></div>
                  <div style={{ display: "flex", justifyContent: "center", padding: "0.75rem 0" }}><Cell val={r.startupos as "full" | "partial" | "none"} /></div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: "1.25rem", marginTop: "0.875rem", padding: "0 0.25rem" }}>
              {[{ icon: I.check, color: t.emerald, label: "Supported" }, { icon: I.minus, color: t.amber, label: "Partial" }, { icon: I.x, color: "#f87171", label: "Not supported" }].map((l) => (
                <div key={l.label} style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.75rem", color: t.faint }}>
                  <span style={{ color: l.color, display: "flex" }}>{l.icon}</span>{l.label}
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────
   SECTION 8 — PRIVACY & SECURITY
──────────────────────────────────────────────────────────────────────── */
function PrivacySection() {
  const points = [
    { icon: I.lock, color: t.emerald, bg: t.emeraldSoft, bd: t.emeraldBorder, title: "Your data is never used for training", body: "The context you share with StartupOS — your company details, your notes, your analyses — is never used to train AI models. Not ours, not the underlying model providers we use." },
    { icon: I.shield, color: t.indigo, bg: t.indigoSoft, bd: t.indigoBorder, title: "Private by default", body: "Every analysis, every chat message, every company profile is stored under your account and visible only to you. There is no shared data, no leaderboards, no community feed." },
    { icon: I.server, color: t.cyan, bg: t.cyanSoft, bd: t.cyanBorder, title: "Secure infrastructure", body: "Authentication is handled by Supabase — a battle-tested, SOC 2-aligned platform. We use Google OAuth so your credentials are never stored directly by StartupOS." },
    { icon: I.eye, color: t.violet, bg: t.violetSoft, bd: t.violetBorder, title: "You control your data", body: "You can delete your company profile and all associated analyses at any time. There are no hidden backups or retention windows — deletion is permanent." },
  ];

  return (
    <section style={{ padding: SECTION_PAD, background: "rgba(0,0,0,0.2)" }}>
      <div style={{ maxWidth: MAX_W, margin: "0 auto" }}>
        <ScrollReveal>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <Tag color={t.emerald} icon={I.shield}>Privacy & Security</Tag>
            <SectionHeading>You are sharing your startup&apos;s most sensitive ideas.</SectionHeading>
            <SectionSubtext style={{ maxWidth: 540, margin: "1rem auto 0" }}>
              We designed StartupOS knowing that. Here is exactly how we handle your data — with no marketing language.
            </SectionSubtext>
          </div>
        </ScrollReveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.25rem" }}>
          {points.map((p, i) => (
            <ScrollReveal key={p.title} delay={i * 0.05}>
              <div style={{ height: "100%", padding: "1.75rem", borderRadius: 16, border: `1px solid ${p.bd}`, background: p.bg }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: `${p.bg}`, border: `1px solid ${p.bd}`, display: "flex", alignItems: "center", justifyContent: "center", color: p.color, marginBottom: "1.125rem" }}>
                  {p.icon}
                </div>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, letterSpacing: "-0.02em", color: t.fg, marginBottom: "0.5rem", lineHeight: 1.4 }}>{p.title}</h3>
                <p style={{ fontSize: "0.875rem", lineHeight: 1.7, color: t.muted, margin: 0 }}>{p.body}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* No false claims note */}
        <ScrollReveal>
          <div style={{ marginTop: "2rem", padding: "1.25rem 1.5rem", borderRadius: 12, border: `1px solid ${t.border}`, background: t.surface, display: "flex", alignItems: "flex-start", gap: "0.875rem" }}>
            <span style={{ fontSize: "1.125rem", flexShrink: 0 }}>💬</span>
            <p style={{ fontSize: "0.875rem", lineHeight: 1.7, color: t.muted, margin: 0 }}>
              <strong style={{ color: t.fg, fontWeight: 600 }}>A note on transparency: </strong>
              We are an early-stage product. We do not claim SOC 2 certification or enterprise-grade compliance audits. What we do claim is that we take privacy seriously, design with it in mind, and will always be honest about our practices. As we grow, our security posture will evolve — and we will document it.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────
   SECTION 9 — AI CAPABILITIES
──────────────────────────────────────────────────────────────────────── */
function AICapabilities() {
  return (
    <section style={{ padding: SECTION_PAD, maxWidth: MAX_W, margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "4rem", alignItems: "center" }}>
        <ScrollReveal>
          <div>
            <SectionLabel>AI capabilities</SectionLabel>
            <SectionHeading style={{ marginBottom: "1.25rem" }}>
              Built for decisions,<br />not just questions.
            </SectionHeading>
            <SectionSubtext style={{ marginBottom: "2rem" }}>
              Most AI products are wrappers around a chat interface. StartupOS uses AI differently — as a reasoning layer that operates within a structured framework designed specifically for early-stage founders.
            </SectionSubtext>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {[
                { title: "Context-aware reasoning", body: "Every AI call includes your full company profile, your stated goal, and your current context. The model has everything it needs to reason specifically about your situation — not a hypothetical startup." },
                { title: "Structured output enforcement", body: "We do not let the model free-write. Every analysis returns a deterministic structure: health score, risks array, opportunities array, next actions, roadmap steps. This means output is always comparable, always actionable." },
                { title: "Additive session memory", body: "Your analysis history is not just an archive — it informs future analyses. StartupOS tracks how your health score and risk profile shift over time, giving the AI a longitudinal view of your startup's trajectory." },
                { title: "Founder-mode prompting", body: "The AI is instructed to think like a board-level advisor, not a cheerleader. It will surface uncomfortable risks. It will challenge your framing. It will tell you what most advisors won't." },
              ].map((item) => (
                <div key={item.title} style={{ paddingLeft: "1rem", borderLeft: `2px solid ${t.indigoBorder}` }}>
                  <div style={{ fontSize: "0.9375rem", fontWeight: 600, color: t.fg, marginBottom: "0.3rem", letterSpacing: "-0.015em" }}>{item.title}</div>
                  <div style={{ fontSize: "0.875rem", lineHeight: 1.7, color: t.muted }}>{item.body}</div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Visual: AI output anatomy */}
        <ScrollReveal>
          <div style={{ borderRadius: 18, border: `1px solid ${t.border}`, background: t.surface, padding: "1.75rem", backdropFilter: "blur(16px)" }}>
            <div style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: t.indigo, marginBottom: "1.25rem" }}>
              Anatomy of a StartupOS analysis
            </div>

            {[
              { label: "Input", color: t.faint, items: ["Your company brain (persistent)", "Your current goal", "Today's context (pasted notes)"] },
              { label: "Processing", color: t.violet, items: ["Company profile + context merged", "Structured reasoning prompt applied", "Output schema enforced (not free text)"] },
              { label: "Output", color: t.emerald, items: ["Health Score 0–100", "Top 3–5 Risks (specific)", "Top 3–5 Opportunities (specific)", "Prioritised Next Actions", "Week-by-week Roadmap"] },
            ].map((block) => (
              <div key={block.label} style={{ marginBottom: "1.25rem" }}>
                <div style={{ fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: block.color, marginBottom: "0.5rem" }}>{block.label}</div>
                {block.items.map((item) => (
                  <div key={item} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 0.75rem", borderRadius: 8, marginBottom: "0.25rem", background: "rgba(0,0,0,0.2)", border: `1px solid ${t.border}`, fontSize: "0.8125rem", color: t.muted }}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: block.color, flexShrink: 0 }} />
                    {item}
                  </div>
                ))}
              </div>
            ))}

            <div style={{ padding: "0.75rem 1rem", borderRadius: 10, background: t.indigoSoft, border: `1px solid ${t.indigoBorder}`, fontSize: "0.8125rem", color: "#a5b4fc", lineHeight: 1.6 }}>
              💡 The health score and all outputs update every time you run an analysis — giving you a live, comparable view of your startup&apos;s trajectory.
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────
   SECTION 10 — FAQ
──────────────────────────────────────────────────────────────────────── */
const FAQ_ITEMS = [
  {
    q: "Is StartupOS just another AI wrapper?",
    a: "No. A wrapper is a chat interface sitting on top of a general model. StartupOS is a structured application: it maintains a persistent company profile, enforces a specific output schema, tracks health scores over time, and applies a founder-specific reasoning framework to every analysis. The AI is one part of the system — not the whole product.",
  },
  {
    q: "What if I'm pre-revenue or pre-product?",
    a: "StartupOS is designed for early-stage founders at any point before Series A. Pre-revenue and even pre-product stages are specifically supported — the company brain captures your stage, and the AI reasoning adjusts accordingly. Many of the most valuable analyses happen before you have data, when strategic clarity matters most.",
  },
  {
    q: "How much context do I need to provide?",
    a: "You can get value with as little as a one-paragraph update. The more specific you are, the sharper the analysis — but StartupOS is designed to work with messy, unformatted notes, not polished decks. Just paste in whatever is on your mind. Meeting notes, customer quotes, investor feedback, competitor updates — all of it is valid.",
  },
  {
    q: "How is this different from hiring a startup advisor or consultant?",
    a: "Advisors are expensive, opinionated, and often unavailable when you need them. StartupOS gives you on-demand strategic analysis grounded in your company's specific context — available at 2am before a board meeting or on Sunday when you're rethinking your pricing. It's not a replacement for human mentors, but it's always there, always informed, and never bills by the hour.",
  },
  {
    q: "Will my startup data be used to train AI models?",
    a: "No. Your company details, context notes, and analyses are never used for AI training — by us or by the underlying model providers we use. Your data is yours. See our Privacy section for full details.",
  },
  {
    q: "How often should I run an analysis?",
    a: "Weekly is the sweet spot for most founders. Running an analysis after significant events — a batch of customer interviews, a fundraising meeting, a product release, a competitor announcement — is when it adds the most value. The health score becomes meaningful when you can track it across multiple sessions.",
  },
  {
    q: "Can I compare analyses over time?",
    a: "Yes. Every analysis is saved to your Reports history. You can review past health scores, compare risk profiles between sessions, and see which actions you completed versus which stalled. This longitudinal view is one of StartupOS's most distinctive capabilities.",
  },
  {
    q: "What does StartupOS not do?",
    a: "StartupOS is not a CRM, a project management tool, or a code generator. It doesn't integrate with your Stripe or analytics dashboards (yet). It doesn't write your investor emails. It's a strategic reasoning layer — it helps you think clearly, prioritise correctly, and act with confidence. For everything else, you'll still need your existing tools.",
  },
];

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section style={{ padding: SECTION_PAD, maxWidth: "820px", margin: "0 auto" }} id="faq">
      <ScrollReveal>
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <SectionLabel>FAQ</SectionLabel>
          <SectionHeading>Questions founders actually ask.</SectionHeading>
          <SectionSubtext style={{ maxWidth: 440, margin: "1rem auto 0" }}>
            We&apos;ve answered the real questions, not the marketing-friendly ones.
          </SectionSubtext>
        </div>
      </ScrollReveal>

      <ScrollReveal>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {FAQ_ITEMS.map((item, i) => {
            const open = openIndex === i;
            return (
              <div key={i} style={{ borderRadius: 14, border: `1px solid ${open ? t.indigoBorder : t.border}`, background: open ? t.indigoSoft : t.surface, overflow: "hidden", transition: "border-color 0.2s ease, background 0.2s ease" }}>
                <button
                  onClick={() => setOpenIndex(open ? null : i)}
                  aria-expanded={open}
                  style={{ width: "100%", padding: "1.125rem 1.375rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", cursor: "pointer", background: "none", border: "none", textAlign: "left" }}
                >
                  <span style={{ fontSize: "0.9375rem", fontWeight: 600, color: t.fg, letterSpacing: "-0.015em", lineHeight: 1.4 }}>{item.q}</span>
                  <span style={{ color: open ? t.indigo : t.faint, transition: "transform 0.2s ease, color 0.2s ease", transform: open ? "rotate(180deg)" : "rotate(0deg)", flexShrink: 0 }}>
                    {I.chevronDown}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div style={{ padding: "0 1.375rem 1.25rem", borderTop: `1px solid ${t.border}` }}>
                        <p style={{ fontSize: "0.9rem", lineHeight: 1.75, color: t.muted, margin: 0, paddingTop: "0.75rem" }}>{item.a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </ScrollReveal>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────
   MAIN PAGE EXPORT
──────────────────────────────────────────────────────────────────────── */
export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 32);

      // Track active section for nav highlight
      const sections = ["demo", "features", "how-it-works", "faq"];
      let current = "";
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom >= 120) {
            current = section;
            break;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(ellipse 90% 50% at 50% -10%, rgba(99,102,241,0.18), transparent), var(--background)", backgroundAttachment: "fixed", overflowX: "hidden" }}>

      {/* ── 1. NAVIGATION BAR ───────────────────────────────────────────── */}
      <nav className={`landing-nav ${scrolled ? "scrolled" : ""}`}>
        <div style={{ width: "100%", maxWidth: MAX_W, margin: "0 auto", padding: "0 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Logo wordmark */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
            <div aria-hidden="true" style={{ width: 30, height: 30, borderRadius: 8, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 0 1px rgba(255,255,255,0.08), 0 4px 12px -4px rgba(99,102,241,0.5)", flexShrink: 0, color: "#fff" }}>
              {I.layers}
            </div>
            <span style={{ fontSize: "1.0625rem", fontWeight: 700, letterSpacing: "-0.03em", color: t.fg }}>StartupOS</span>
          </div>

          {/* Nav links */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
            {[
              { label: "Demo", id: "demo" },
              { label: "Features", id: "features" },
              { label: "How it works", id: "how-it-works" },
            ].map(link => {
              const active = activeSection === link.id;
              return (
                <Link
                  key={link.id}
                  href={`#${link.id}`}
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color: active ? "#818cf8" : t.muted,
                    textDecoration: "none",
                    padding: "0.4rem 0.75rem",
                    borderRadius: 8,
                    transition: "color 0.18s ease",
                  }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.color = t.fg; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.color = t.muted; }}
                >
                  {link.label}
                </Link>
              );
            })}
            <div style={{ width: 1, height: 18, background: t.border, margin: "0 0.5rem" }} />
            <Link
              href="/login"
              id="nav-signin"
              style={{
                fontSize: "0.875rem",
                fontWeight: 500,
                color: t.muted,
                textDecoration: "none",
                padding: "0.4rem 0.75rem",
                borderRadius: 8,
                transition: "color 0.18s ease",
              }}
              onMouseEnter={e => (e.currentTarget.style.color = t.fg)}
              onMouseLeave={e => (e.currentTarget.style.color = t.muted)}
            >
              Sign in
            </Link>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Link href="/login" id="nav-cta" className="cta-btn" style={{ padding: "0.5rem 1rem", fontSize: "0.875rem", marginLeft: "0.25rem" }}>
                Get started {I.arrow}
              </Link>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* ── 2. HERO SECTION ────────────────────────────────────────────── */}
      <section style={{ paddingTop: "calc(var(--nav-height) + 6rem)", paddingBottom: "5.5rem", paddingLeft: "1.5rem", paddingRight: "1.5rem", textAlign: "center", position: "relative" }}>
        {/* Particle drift background */}
        <CanvasParticles />

        {/* Floating background gradient light */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: 800,
            height: 500,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.04) 70%, transparent 100%)",
            filter: "blur(80px)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 840, margin: "0 auto" }}>
          {/* Eyebrow badge */}
          <ScrollReveal>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.375rem 0.875rem", borderRadius: 9999, border: `1px solid rgba(139,92,246,0.25)`, background: "rgba(139,92,246,0.06)", fontSize: "0.8125rem", fontWeight: 600, color: "#a78bfa", marginBottom: "1.875rem" }}>
              {I.spark} AI-powered strategic clarity for founders
            </div>
          </ScrollReveal>

          {/* Heading */}
          <ScrollReveal delay={0.05}>
            <h1 style={{ fontSize: "clamp(2.75rem, 6.5vw, 4.5rem)", fontWeight: 900, letterSpacing: "-0.045em", lineHeight: 1.08, marginBottom: "1.5rem", color: t.fg }}>
              Know where your startup stands.
              <br />
              <span style={{ background: "linear-gradient(135deg, #818cf8, #c4b5fd 45%, #67e8f9)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
                Know what to do next.
              </span>
            </h1>
          </ScrollReveal>

          {/* Description */}
          <ScrollReveal delay={0.1}>
            <p style={{ fontSize: "clamp(1.0625rem, 2vw, 1.25rem)", lineHeight: 1.65, color: t.muted, maxWidth: 600, margin: "0 auto 2.75rem", letterSpacing: "-0.01em" }}>
              StartupOS is the AI co-founder you don&apos;t have yet. It builds a persistent brain for your company, then gives you a clear strategic read — health score, risks, opportunities, and a prioritised action plan — every time you update your context.
            </p>
          </ScrollReveal>

          {/* Action CTAs */}
          <ScrollReveal delay={0.15}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.875rem", justifyContent: "center", alignItems: "center", marginBottom: "2.25rem" }}>
              <motion.div whileHover={{ scale: 1.025 }} whileTap={{ scale: 0.985 }}>
                <Link href="/login" id="hero-cta-primary" className="cta-btn" style={{ fontSize: "1rem", padding: "1rem 2rem" }}>
                  Build your Company Brain {I.arrow}
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.025 }} whileTap={{ scale: 0.985 }}>
                <a href="#demo" className="ghost-btn" id="hero-cta-secondary" style={{ fontSize: "1rem", padding: "1rem 1.75rem" }}>
                  See it in action
                </a>
              </motion.div>
            </div>
          </ScrollReveal>

          {/* Secure trust chips list */}
          <ScrollReveal delay={0.2}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", justifyContent: "center" }}>
              {[
                { icon: I.check, text: "Free to start" },
                { icon: I.lock, text: "Your data stays private" },
                { icon: I.check, text: "No credit card required" },
                { icon: I.check, text: "Ready in 5 minutes" },
              ].map(c => (
                <span key={c.text} className="trust-chip">
                  <span style={{ color: t.indigo, display: "flex" }}>{c.icon}</span>
                  {c.text}
                </span>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── 3. PRODUCT DEMO ─────────────────────────────────────────────── */}
      <Divider />
      <ProductDemo />

      {/* ── 4. PROBLEM STATEMENT ────────────────────────────────────────── */}
      <Divider />
      <ProblemSection />

      {/* ── 5. HOW IT WORKS ─────────────────────────────────────────────── */}
      <Divider />
      <HowItWorks />

      {/* ── 6. CORE FEATURES ────────────────────────────────────────────── */}
      <Divider />
      <CoreFeatures />

      {/* ── 7. WHY NOT CHATGPT ──────────────────────────────────────────── */}
      <Divider />
      <WhyNotChatGPT />

      {/* ── 8. PRIVACY & SECURITY ───────────────────────────────────────── */}
      <Divider />
      <PrivacySection />

      {/* ── 9. AI CAPABILITIES ──────────────────────────────────────────── */}
      <Divider />
      <AICapabilities />

      {/* ── 10. FAQ SECTION ─────────────────────────────────────────────── */}
      <Divider />
      <FAQSection />

      {/* ── 11. FINAL CTA SECTION ───────────────────────────────────────── */}
      <Divider />
      <ScrollReveal>
        <section style={{ padding: "clamp(5rem, 10vw, 8rem) 1.5rem", textAlign: "center", position: "relative" }}>
          <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(99,102,241,0.14), transparent)", pointerEvents: "none" }} />
          <div style={{ position: "relative", zIndex: 1, maxWidth: 640, margin: "0 auto" }}>
            <SectionLabel>Start today</SectionLabel>
            <SectionHeading style={{ marginBottom: "1.25rem" }}>
              Your startup deserves<br />a strategic foundation.
            </SectionHeading>
            <p style={{ fontSize: "clamp(1rem, 1.5vw, 1.125rem)", lineHeight: 1.7, color: t.muted, marginBottom: "2.5rem" }}>
              Set up your Company Brain in 5 minutes. Run your first analysis immediately. See exactly where you stand and what to do next — with no guesswork.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "center", marginBottom: "2rem" }}>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <Link href="/login" id="final-cta" className="cta-btn" style={{ fontSize: "1.0625rem", padding: "1.0625rem 2.25rem" }}>
                  Get started for free {I.arrow}
                </Link>
              </motion.div>
            </div>
            <p style={{ fontSize: "0.875rem", color: t.faint }}>
              No credit card. No setup fees. Cancel anytime.
            </p>
          </div>
        </section>
      </ScrollReveal>

      {/* ── 12. FOOTER ──────────────────────────────────────────────────── */}
      <footer style={{ borderTop: `1px solid ${t.border}`, padding: "3rem 1.5rem 2rem" }}>
        <div style={{ maxWidth: MAX_W, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "3rem", marginBottom: "3rem" }}>
            {/* Brand column */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.875rem" }}>
                <div aria-hidden="true" style={{ width: 26, height: 26, borderRadius: 7, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                  {I.layers}
                </div>
                <span style={{ fontSize: "1rem", fontWeight: 700, letterSpacing: "-0.025em", color: t.fg }}>StartupOS</span>
              </div>
              <p style={{ fontSize: "0.875rem", lineHeight: 1.7, color: t.faint, maxWidth: 280, margin: 0 }}>
                AI-powered strategic clarity for early-stage founders. Know where you stand. Know what to do next.
              </p>
            </div>

            {/* Product links */}
            <div>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: t.faint, marginBottom: "1rem" }}>Product</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                {[
                  { label: "Dashboard", href: "/login" },
                  { label: "AI Analysis", href: "/login" },
                  { label: "Roadmap", href: "/login" },
                  { label: "Reports", href: "/login" },
                  { label: "AI Chat", href: "/login" },
                ].map(l => (
                  <Link key={l.label} href={l.href} style={{ fontSize: "0.875rem", color: t.faint, textDecoration: "none", transition: "color 0.15s ease" }}
                    onMouseEnter={e => (e.currentTarget.style.color = t.muted)}
                    onMouseLeave={e => (e.currentTarget.style.color = t.faint)}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Learning resources */}
            <div>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: t.faint, marginBottom: "1rem" }}>Learn</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                {[
                  { label: "How it works", href: "#how-it-works" },
                  { label: "Features", href: "#features" },
                  { label: "Product demo", href: "#demo" },
                  { label: "FAQ", href: "#faq" },
                ].map(l => (
                  <Link key={l.label} href={l.href} style={{ fontSize: "0.875rem", color: t.faint, textDecoration: "none", transition: "color 0.15s ease" }}
                    onMouseEnter={e => (e.currentTarget.style.color = t.muted)}
                    onMouseLeave={e => (e.currentTarget.style.color = t.faint)}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Account settings links */}
            <div>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: t.faint, marginBottom: "1rem" }}>Account</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                {[
                  { label: "Sign in", href: "/login" },
                  { label: "Create account", href: "/login" },
                ].map(l => (
                  <Link key={l.label} href={l.href} style={{ fontSize: "0.875rem", color: t.faint, textDecoration: "none", transition: "color 0.15s ease" }}
                    onMouseEnter={e => (e.currentTarget.style.color = t.muted)}
                    onMouseLeave={e => (e.currentTarget.style.color = t.faint)}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom copyright details bar */}
          <div style={{ borderTop: `1px solid ${t.border}`, paddingTop: "1.5rem", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
            <span style={{ fontSize: "0.8125rem", color: t.faint }}>
              © {new Date().getFullYear()} StartupOS. Built for founders.
            </span>
            <div style={{ display: "flex", gap: "1.25rem" }}>
              {["Privacy Policy", "Terms of Service", "Security"].map(l => (
                <span key={l} style={{ fontSize: "0.8125rem", color: t.faint, cursor: "pointer", transition: "color 0.15s ease" }}>{l}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
