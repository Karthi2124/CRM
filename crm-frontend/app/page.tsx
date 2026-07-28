"use client";

import Link from "next/link";
import {
  Building2, ArrowRight, Shield, Zap, Sparkles, Layers,
  Users, Target, Handshake, Package, FileText, Receipt,
  CheckSquare, Calendar, Bell, BarChart2, HardDrive, UserCog,
  Check, Lock, Activity, RefreshCw, Smartphone, Code, Play
} from "lucide-react";
import { useEffect, useState } from "react";
import { getToken } from "@/lib/auth";

export default function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!getToken());
  }, []);

  return (
    <div
      style={{
        background: "var(--bg-base)",
        minHeight: "100vh",
        color: "var(--text-primary)",
        fontFamily: "var(--font-inter), sans-serif",
        overflowX: "hidden",
      }}
    >
      {/* ─── Global Glowing Lights ─────────────────────────────────────────────── */}
      <div style={{ position: "absolute", top: "5%", left: "10%", width: "400px", height: "400px", background: "radial-gradient(circle, rgba(79, 70, 229, 0.04) 0%, transparent 70%)", filter: "blur(60px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "40%", right: "10%", width: "500px", height: "500px", background: "radial-gradient(circle, rgba(124, 58, 237, 0.03) 0%, transparent 70%)", filter: "blur(80px)", pointerEvents: "none" }} />

      {/* ─── Header Navigation ────────────────────────────────────────────────── */}
      <header
        style={{
          borderBottom: "1px solid var(--border-subtle)",
          background: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(12px)",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0.875rem 1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(79, 70, 229, 0.2)",
              }}
            >
              <Building2 size={18} color="white" />
            </div>
            <span style={{ fontWeight: 800, fontSize: "1.125rem", letterSpacing: "-0.03em" }}>
              Enterprise CRM
            </span>
          </div>

          <nav style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <a href="#features" style={{ color: "var(--text-secondary)", fontSize: "0.875rem", fontWeight: 500, transition: "color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.color = "var(--accent-primary)"} onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-secondary)"}>Features</a>
            <a href="#architecture" style={{ color: "var(--text-secondary)", fontSize: "0.875rem", fontWeight: 500, transition: "color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.color = "var(--accent-primary)"} onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-secondary)"}>Architecture</a>
            <a href="#preview" style={{ color: "var(--text-secondary)", fontSize: "0.875rem", fontWeight: 500, transition: "color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.color = "var(--accent-primary)"} onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-secondary)"}>Workspace</a>

            <div style={{ width: "1px", height: "20px", background: "var(--border-subtle)" }} />

            {isLoggedIn ? (
              <Link href="/dashboard" className="btn btn-primary btn-sm" style={{ boxShadow: "0 4px 12px rgba(79, 70, 229, 0.2)" }}>
                Go to Workspace <ArrowRight size={14} />
              </Link>
            ) : (
              <>
                <Link href="/login" style={{ color: "var(--text-secondary)", fontSize: "0.875rem", fontWeight: 500 }}>
                  Sign In
                </Link>
                <Link href="/login" className="btn btn-primary btn-sm" style={{ boxShadow: "0 4px 12px rgba(79, 70, 229, 0.2)" }}>
                  Start Trial
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* ─── Hero Section ──────────────────────────────────────────────────────── */}
      <section style={{ position: "relative", padding: "6rem 1.5rem 5rem", textAlign: "center" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "rgba(79, 70, 229, 0.06)",
              border: "1px solid rgba(79, 70, 229, 0.15)",
              borderRadius: "100px",
              padding: "0.4rem 1rem",
              fontSize: "0.75rem",
              fontWeight: 600,
              color: "var(--accent-primary)",
              marginBottom: "2rem",
            }}
          >
            <Sparkles size={12} />
            <span>Enterprise Grade Client Workspace</span>
          </div>

          <h1
            style={{
              fontSize: "3.75rem",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 1.1,
              marginBottom: "1.5rem",
            }}
          >
            High-Performance CRM for <br />
            <span style={{ background: "linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Data-Driven Growth Teams
            </span>
          </h1>

          <p
            style={{
              fontSize: "1.25rem",
              color: "var(--text-secondary)",
              lineHeight: 1.6,
              maxWidth: "680px",
              margin: "0 auto 2.5rem",
            }}
          >
            A cohesive monorepo combining robust SQL indexing, safe try-catch migration files,
            XSS parameter sanitizers, and a gorgeous, responsive interface.
          </p>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginBottom: "4rem" }}>
            <Link href={isLoggedIn ? "/dashboard" : "/login"} className="btn btn-primary btn-lg" style={{ padding: "0.875rem 2rem", boxShadow: "0 6px 20px rgba(79, 70, 229, 0.25)" }}>
              {isLoggedIn ? "Access Dashboard" : "Sign In to System"} <ArrowRight size={16} />
            </Link>
            <a href="#features" className="btn btn-secondary btn-lg" style={{ padding: "0.875rem 2rem" }}>
              Explore Capabilities
            </a>
          </div>
        </div>
      </section>

      {/* ─── Interactive UI Preview Mockup ──────────────────────────────────────── */}
      <section id="preview" style={{ maxWidth: "1100px", margin: "0 auto 6rem", padding: "0 1.5rem" }}>
        <div
          className="glass-card"
          style={{
            padding: "0.5rem",
            borderRadius: "var(--radius-xl)",
            background: "rgba(255, 255, 255, 0.4)",
            boxShadow: "0 20px 50px rgba(15, 23, 42, 0.08)",
          }}
        >
          {/* Mock Window Header */}
          <div
            style={{
              background: "var(--bg-elevated)",
              borderTopLeftRadius: "var(--radius-lg)",
              borderTopRightRadius: "var(--radius-lg)",
              padding: "0.75rem 1.25rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1px solid var(--border-subtle)",
            }}
          >
            <div style={{ display: "flex", gap: "6px" }}>
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ef4444" }} />
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#f59e0b" }} />
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#10b981" }} />
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "monospace" }}>
              crm-workspace://dashboard
            </div>
            <div style={{ width: "40px" }} />
          </div>

          {/* Mock Content Layout */}
          <div
            style={{
              background: "var(--bg-base)",
              borderBottomLeftRadius: "var(--radius-lg)",
              borderBottomRightRadius: "var(--radius-lg)",
              height: "450px",
              display: "flex",
              overflow: "hidden",
            }}
          >
            {/* Sidebar Mock */}
            <div style={{ width: "200px", borderRight: "1px solid var(--border-subtle)", background: "var(--bg-surface)", padding: "1rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <div style={{ width: "22px", height: "22px", borderRadius: "6px", background: "var(--accent-primary)" }} />
                <div style={{ width: "70px", height: "10px", background: "var(--text-muted)", borderRadius: "4px" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <div style={{ width: "14px", height: "14px", background: "var(--accent-primary)", borderRadius: "3px", opacity: 0.8 }} />
                  <div style={{ width: "80px", height: "8px", background: "var(--text-primary)", borderRadius: "4px" }} />
                </div>
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <div style={{ width: "14px", height: "14px", background: "var(--text-muted)", borderRadius: "3px", opacity: 0.4 }} />
                    <div style={{ width: "60px", height: "8px", background: "var(--text-secondary)", borderRadius: "4px", opacity: 0.6 }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Main Area Mock */}
            <div style={{ flex: 1, padding: "1.5rem", overflow: "hidden", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {/* KPIs Row */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
                <div className="glass-card" style={{ padding: "1rem", background: "var(--bg-surface)" }}>
                  <div style={{ width: "50px", height: "6px", background: "var(--text-muted)", borderRadius: "3px", marginBottom: "8px" }} />
                  <div style={{ fontSize: "1.25rem", fontWeight: 700 }}>₹14,50,000</div>
                  <div style={{ width: "80px", height: "5px", background: "var(--accent-emerald)", borderRadius: "3px", marginTop: "6px" }} />
                </div>
                <div className="glass-card" style={{ padding: "1rem", background: "var(--bg-surface)" }}>
                  <div style={{ width: "50px", height: "6px", background: "var(--text-muted)", borderRadius: "3px", marginBottom: "8px" }} />
                  <div style={{ fontSize: "1.25rem", fontWeight: 700 }}>24 Active</div>
                  <div style={{ width: "60px", height: "5px", background: "var(--accent-primary)", borderRadius: "3px", marginTop: "6px" }} />
                </div>
                <div className="glass-card" style={{ padding: "1rem", background: "var(--bg-surface)" }}>
                  <div style={{ width: "50px", height: "6px", background: "var(--text-muted)", borderRadius: "3px", marginBottom: "8px" }} />
                  <div style={{ fontSize: "1.25rem", fontWeight: 700 }}>12 Pending</div>
                  <div style={{ width: "70px", height: "5px", background: "var(--accent-amber)", borderRadius: "3px", marginTop: "6px" }} />
                </div>
              </div>

              {/* Layout Content Mock */}
              <div style={{ display: "flex", gap: "1rem", flex: 1 }}>
                {/* List Container */}
                <div className="glass-card" style={{ flex: 2, background: "var(--bg-surface)", padding: "1rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div style={{ width: "90px", height: "10px", background: "var(--text-primary)", borderRadius: "4px" }} />
                    <div style={{ width: "50px", height: "18px", background: "var(--accent-primary)", borderRadius: "4px" }} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", borderTop: "1px solid var(--border-subtle)", paddingTop: "0.75rem" }}>
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                          <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "var(--bg-elevated)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem" }}>U</div>
                          <div style={{ width: "70px", height: "8px", background: "var(--text-secondary)", borderRadius: "4px" }} />
                        </div>
                        <div style={{ width: "40px", height: "12px", background: "rgba(16, 185, 129, 0.1)", borderRadius: "100px" }} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chart Container */}
                <div className="glass-card" style={{ flex: 1, background: "var(--bg-surface)", padding: "1rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div style={{ width: "80px", height: "10px", background: "var(--text-primary)", borderRadius: "4px" }} />
                  <div style={{ flex: 1, position: "relative", display: "flex", alignItems: "flex-end", justifyItems: "center", gap: "12px", padding: "10px 0" }}>
                    <div style={{ flex: 1, height: "80%", background: "linear-gradient(to top, var(--accent-primary), var(--accent-secondary))", borderRadius: "4px" }} />
                    <div style={{ flex: 1, height: "45%", background: "linear-gradient(to top, var(--accent-primary), var(--accent-secondary))", borderRadius: "4px" }} />
                    <div style={{ flex: 1, height: "90%", background: "linear-gradient(to top, var(--accent-primary), var(--accent-secondary))", borderRadius: "4px" }} />
                    <div style={{ flex: 1, height: "60%", background: "linear-gradient(to top, var(--accent-primary), var(--accent-secondary))", borderRadius: "4px" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Detailed System Modules Catalog ───────────────────────────────────── */}
      <section id="features" style={{ borderTop: "1px solid var(--border-subtle)", padding: "6rem 1.5rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "4.5rem" }}>
            <h2 style={{ fontSize: "2.25rem", fontWeight: 800, letterSpacing: "-0.03em" }}>Unified Module Catalog</h2>
            <p style={{ color: "var(--text-secondary)", marginTop: "0.5rem", maxWidth: "600px", margin: "0.5rem auto 0", fontSize: "1rem" }}>
              Explore the detailed schema operations and sub-modules mapped directly inside our CRM system.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "2rem" }}>
            {/* CRM Module Card */}
            <div className="glass-card" style={{ padding: "2rem", borderTop: "4px solid var(--accent-primary)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
                <Users size={20} color="var(--accent-primary)" />
                <h3 style={{ fontSize: "1.25rem", fontWeight: 700 }}>Client Relationships</h3>
              </div>
              <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "1.5rem", lineHeight: 1.5 }}>
                Track user directories, manage individual and business accounts, and monitor sales deals pipelines.
              </p>
              <ul style={{ display: "flex", flexDirection: "column", gap: "0.75rem", padding: 0, margin: 0, listStyle: "none" }}>
                <li style={{ fontSize: "0.8125rem", display: "flex", gap: "8px", alignItems: "center" }}>
                  <Check size={14} color="var(--accent-emerald)" />
                  <span><strong>Customers Directory:</strong> Track individual/business types & status.</span>
                </li>
                <li style={{ fontSize: "0.8125rem", display: "flex", gap: "8px", alignItems: "center" }}>
                  <Check size={14} color="var(--accent-emerald)" />
                  <span><strong>Leads Tracker:</strong> Segment by source, priority (high/medium/low) & status.</span>
                </li>
                <li style={{ fontSize: "0.8125rem", display: "flex", gap: "8px", alignItems: "center" }}>
                  <Check size={14} color="var(--accent-emerald)" />
                  <span><strong>Opportunities Stage:</strong> Win/loss probability calculations & target dates.</span>
                </li>
              </ul>
            </div>

            {/* Sales & Billing Card */}
            <div className="glass-card" style={{ padding: "2rem", borderTop: "4px solid var(--accent-secondary)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
                <Receipt size={20} color="var(--accent-secondary)" />
                <h3 style={{ fontSize: "1.25rem", fontWeight: 700 }}>Sales Operations</h3>
              </div>
              <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "1.5rem", lineHeight: 1.5 }}>
                Complete order estimates, print PDFs, and log customer invoices, balances, and payment terms.
              </p>
              <ul style={{ display: "flex", flexDirection: "column", gap: "0.75rem", padding: 0, margin: 0, listStyle: "none" }}>
                <li style={{ fontSize: "0.8125rem", display: "flex", gap: "8px", alignItems: "center" }}>
                  <Check size={14} color="var(--accent-emerald)" />
                  <span><strong>Product SKU Catalog:</strong> Track stock quantity, unit prices, and category tags.</span>
                </li>
                <li style={{ fontSize: "0.8125rem", display: "flex", gap: "8px", alignItems: "center" }}>
                  <Check size={14} color="var(--accent-emerald)" />
                  <span><strong>Quotation System:</strong> Auto-calculate totals, valid-until dates & PDF outputs.</span>
                </li>
                <li style={{ fontSize: "0.8125rem", display: "flex", gap: "8px", alignItems: "center" }}>
                  <Check size={14} color="var(--accent-emerald)" />
                  <span><strong>Invoice Ledger:</strong> Record card/upi/transfer payments & overdue balance tracking.</span>
                </li>
              </ul>
            </div>

            {/* Productivity Card */}
            <div className="glass-card" style={{ padding: "2rem", borderTop: "4px solid var(--accent-emerald)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
                <CheckSquare size={20} color="var(--accent-emerald)" />
                <h3 style={{ fontSize: "1.25rem", fontWeight: 700 }}>Operations Workspace</h3>
              </div>
              <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "1.5rem", lineHeight: 1.5 }}>
                Dispatch team assignments, schedule client demo calendar events, and trigger system notifications.
              </p>
              <ul style={{ display: "flex", flexDirection: "column", gap: "0.75rem", padding: 0, margin: 0, listStyle: "none" }}>
                <li style={{ fontSize: "0.8125rem", display: "flex", gap: "8px", alignItems: "center" }}>
                  <Check size={14} color="var(--accent-emerald)" />
                  <span><strong>Shared Calendar:</strong> Set location-specific meetings, demonstrations, or calls.</span>
                </li>
                <li style={{ fontSize: "0.8125rem", display: "flex", gap: "8px", alignItems: "center" }}>
                  <Check size={14} color="var(--accent-emerald)" />
                  <span><strong>Task Priorities:</strong> Mark tasks urgent, in_progress, completed, or cancelled.</span>
                </li>
                <li style={{ fontSize: "0.8125rem", display: "flex", gap: "8px", alignItems: "center" }}>
                  <Check size={14} color="var(--accent-emerald)" />
                  <span><strong>System Notifications:</strong> Instantly dispatch system-wide warnings & activity logs.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Technical Architecture Specifications ───────────────────────────── */}
      <section id="architecture" style={{ borderTop: "1px solid var(--border-subtle)", padding: "6rem 1.5rem", background: "var(--bg-elevated)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "4.5rem" }}>
            <h2 style={{ fontSize: "2.25rem", fontWeight: 800, letterSpacing: "-0.03em" }}>Architectural Hardening</h2>
            <p style={{ color: "var(--text-secondary)", marginTop: "0.5rem", maxWidth: "600px", margin: "0.5rem auto 0", fontSize: "1rem" }}>
              Explore the technical configurations designed to maintain extreme performance and database security.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
            {/* Cache Card */}
            <div className="glass-card" style={{ padding: "1.75rem", background: "var(--bg-surface)" }}>
              <Activity size={24} color="var(--accent-primary)" style={{ marginBottom: "1rem" }} />
              <h4 style={{ fontWeight: 700, fontSize: "1rem" }}>Hybrid Caching</h4>
              <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", marginTop: "6px", lineHeight: 1.5 }}>
                Connects to `ioredis` cache client. Automatically falls back to a locally managed in-memory TTL caching Map store to prevent startup blocks if Redis is offline.
              </p>
            </div>

            {/* Indexes Card */}
            <div className="glass-card" style={{ padding: "1.75rem", background: "var(--bg-surface)" }}>
              <BarChart2 size={24} color="var(--accent-secondary)" style={{ marginBottom: "1rem" }} />
              <h4 style={{ fontWeight: 700, fontSize: "1rem" }}>SQL Query Optimization</h4>
              <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", marginTop: "6px", lineHeight: 1.5 }}>
                Configured Sequelize indexes mapped directly to search-critical columns (status, assigned user, date limits) preventing database table scans under high load.
              </p>
            </div>

            {/* Security Guard */}
            <div className="glass-card" style={{ padding: "1.75rem", background: "var(--bg-surface)" }}>
              <Lock size={24} color="var(--accent-emerald)" style={{ marginBottom: "1rem" }} />
              <h4 style={{ fontWeight: 700, fontSize: "1rem" }}>Security Sanitizers</h4>
              <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", marginTop: "6px", lineHeight: 1.5 }}>
                Recursively strips script tags and generic HTML fields across body, query, and path parameters, neutralizing SQL injection and XSS exploits.
              </p>
            </div>

            {/* Automated Testing */}
            <div className="glass-card" style={{ padding: "1.75rem", background: "var(--bg-surface)" }}>
              <Code size={24} color="var(--accent-cyan)" style={{ marginBottom: "1rem" }} />
              <h4 style={{ fontWeight: 700, fontSize: "1rem" }}>Jest + Supertest</h4>
              <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", marginTop: "6px", lineHeight: 1.5 }}>
                Pre-configured test environment checking router responses, validations, parameter strips, and authentication guards before code compilation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Frequently Asked Questions ────────────────────────────────────────── */}
      <section style={{ borderTop: "1px solid var(--border-subtle)", padding: "6rem 1.5rem" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "2.25rem", fontWeight: 800, letterSpacing: "-0.03em", textAlign: "center", marginBottom: "4rem" }}>
            Frequently Asked Questions
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <div>
              <h4 style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)" }}>
                How does the application manage offline caching?
              </h4>
              <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "6px", lineHeight: 1.5 }}>
                Our custom Cache Service automatically checks if a Redis connection is online. If offline, the client seamlessly routes calls to a built-in RAM map. The transition is completely transparent to the controllers.
              </p>
            </div>

            <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "1.5rem" }}>
              <h4 style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)" }}>
                Is there an integrated document vault?
              </h4>
              <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "6px", lineHeight: 1.5 }}>
                Yes! The platform contains a files storage sub-module. Admins and team members can securely upload contracts, receipts, or attachments directly to disk storage and retrieve them securely via API downloads.
              </p>
            </div>

            <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "1.5rem" }}>
              <h4 style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-primary)" }}>
                How do I initialize demo dataset seeds?
              </h4>
              <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "6px", lineHeight: 1.5 }}>
                We've provided a demo seeder file inside the repository. To populate lead stats, opportunity stages, customers, and invoice mockups, just run `npm run db:seed` in your terminal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer CTA ───────────────────────────────────────────────────────── */}
      <footer style={{ borderTop: "1px solid var(--border-subtle)", padding: "5rem 1.5rem 3rem", background: "var(--bg-elevated)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          {/* Main CTA Block */}
          <div style={{ textAlign: "center", marginBottom: "5rem" }}>
            <h2 style={{ fontSize: "2.25rem", fontWeight: 800, marginBottom: "0.75rem", letterSpacing: "-0.03em" }}>
              Ready to Connect Your Team?
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "1rem", maxWidth: "520px", margin: "0 auto 2rem", lineHeight: 1.5 }}>
              Access the secure workspace dashboard instantly to manage system settings, log in, or review team audit logs.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
              <Link href={isLoggedIn ? "/dashboard" : "/login"} className="btn btn-primary btn-lg" style={{ boxShadow: "0 6px 20px rgba(79, 70, 229, 0.2)" }}>
                {isLoggedIn ? "Access Dashboard" : "Sign In to Workspace"} <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* Grid Layout Footer Details */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "2.5rem",
              borderTop: "1px solid var(--border-subtle)",
              paddingTop: "4rem",
              paddingBottom: "3rem",
              textAlign: "left",
            }}
          >
            {/* Column 1: Company Logo / Address */}
            <div style={{ gridColumn: "span 2", minWidth: "250px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "8px",
                    background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Building2 size={15} color="white" />
                </div>
                <span style={{ fontWeight: 800, fontSize: "1rem", letterSpacing: "-0.03em" }}>
                  Loopline
                </span>
              </div>
              <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "1.5rem" }}>
                Loopline Technologies designs high-performance operational infrastructures, robust CRM interfaces, and secure data storage schemas for growing business operations.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.75rem", color: "var(--text-muted)" }}>
                <div>📍 Loopline HQ, Tech Park Phase-II, Bangalore, India</div>
                <div>✉️ support@loopline.co</div>
                <div>📞 +91 80 4912 3456</div>
              </div>
            </div>

            {/* Column 2: Solutions */}
            <div>
              <h5 style={{ fontWeight: 700, fontSize: "0.8125rem", color: "var(--text-primary)", marginBottom: "1.25rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Solutions
              </h5>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.8125rem" }}>
                <a href="#features" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Enterprise CRM</a>
                <a href="#features" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Document Vault</a>
                <a href="#features" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Invoicing Ledger</a>
                <a href="#features" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Team Calendars</a>
              </div>
            </div>

            {/* Column 3: Platform */}
            <div>
              <h5 style={{ fontWeight: 700, fontSize: "0.8125rem", color: "var(--text-primary)", marginBottom: "1.25rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Technology
              </h5>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.8125rem" }}>
                <a href="#architecture" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Next.js App Router</a>
                <a href="#architecture" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Tailwind CSS v4</a>
                <a href="#architecture" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Redis TTL Cache</a>
                <a href="#architecture" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Security Headers</a>
              </div>
            </div>

            {/* Column 4: Links */}
            <div>
              <h5 style={{ fontWeight: 700, fontSize: "0.8125rem", color: "var(--text-primary)", marginBottom: "1.25rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Company
              </h5>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.8125rem" }}>
                <span style={{ color: "var(--text-secondary)" }}>About Us</span>
                <span style={{ color: "var(--text-secondary)" }}>Terms of Service</span>
                <span style={{ color: "var(--text-secondary)" }}>Privacy Policy</span>
                <span style={{ color: "var(--text-secondary)" }}>Developer API</span>
              </div>
            </div>
          </div>

          {/* Bottom Copyright bar */}
          <div
            style={{
              borderTop: "1px solid var(--border-subtle)",
              paddingTop: "2rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "0.75rem",
              color: "var(--text-muted)",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div>
              © 2026 Loopline Technologies Private Limited. All rights reserved.
            </div>
            <div>
              Designed with security, hybrid caching, and database index optimization.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
