"use client";

import Link from "next/link";
import {
  Building2, ArrowRight, Shield, Zap, Sparkles, Layers,
  Users, Target, Handshake, Package, FileText, Receipt,
  CheckSquare, Calendar, Bell, BarChart2, HardDrive, UserCog
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
      {/* ─── Header Navigation ────────────────────────────────────────────────── */}
      <header
        style={{
          borderBottom: "1px solid var(--border-subtle)",
          background: "rgba(255, 255, 255, 0.6)",
          backdropFilter: "blur(12px)",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
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
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Building2 size={17} color="white" />
            </div>
            <span style={{ fontWeight: 700, fontSize: "1.0625rem", letterSpacing: "-0.02em" }}>
              Enterprise CRM
            </span>
          </div>

          <nav style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            {isLoggedIn ? (
              <Link href="/dashboard" className="btn btn-primary btn-sm">
                Dashboard <ArrowRight size={14} />
              </Link>
            ) : (
              <>
                <Link href="/login" style={{ color: "var(--text-secondary)", fontSize: "0.875rem", fontWeight: 500 }}>
                  Sign In
                </Link>
                <Link href="/login" className="btn btn-primary btn-sm">
                  Get Started
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* ─── Hero Section ──────────────────────────────────────────────────────── */}
      <section style={{ position: "relative", padding: "5rem 1.5rem 4rem" }}>
        {/* Subtle mesh background glows */}
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "500px",
            height: "300px",
            background: "radial-gradient(circle, rgba(79, 70, 229, 0.08) 0%, transparent 70%)",
            filter: "blur(40px)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "100px",
              padding: "0.375rem 0.875rem",
              fontSize: "0.75rem",
              fontWeight: 600,
              color: "var(--accent-primary)",
              marginBottom: "1.5rem",
            }}
          >
            <Sparkles size={12} />
            <span>Introducing Version 1.0.0</span>
          </div>

          <h1
            style={{
              fontSize: "3.25rem",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              marginBottom: "1.25rem",
            }}
          >
            The Intelligent Engine for <br />
            <span style={{ background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Enterprise Relationships
            </span>
          </h1>

          <p
            style={{
              fontSize: "1.125rem",
              color: "var(--text-secondary)",
              lineHeight: 1.6,
              maxWidth: "600px",
              margin: "0 auto 2.25rem",
            }}
          >
            Streamline your customer operations, accelerate sales pipelines, automate invoice payments,
            and monitor performance metrics in a unified high-performance workspace.
          </p>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
            <Link href={isLoggedIn ? "/dashboard" : "/login"} className="btn btn-primary btn-lg">
              {isLoggedIn ? "Access Dashboard" : "Start Free Trial"} <ArrowRight size={16} />
            </Link>
            <a href="#features" className="btn btn-secondary btn-lg">
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* ─── Highlights Row ───────────────────────────────────────────────────── */}
      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 1.5rem 4rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "1.5rem",
          }}
        >
          <div className="glass-card" style={{ padding: "1.5rem", display: "flex", gap: "1rem", alignItems: "flex-start" }}>
            <div style={{ padding: "0.5rem", borderRadius: "8px", background: "rgba(79, 70, 229, 0.08)", color: "var(--accent-primary)" }}>
              <Zap size={18} />
            </div>
            <div>
              <h4 style={{ fontWeight: 600, fontSize: "0.9375rem" }}>Lightning-Fast Execution</h4>
              <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                Built on Next.js 16 with custom Redis caching, delivering instant query responses.
              </p>
            </div>
          </div>

          <div className="glass-card" style={{ padding: "1.5rem", display: "flex", gap: "1rem", alignItems: "flex-start" }}>
            <div style={{ padding: "0.5rem", borderRadius: "8px", background: "rgba(5, 150, 105, 0.08)", color: "var(--accent-emerald)" }}>
              <Shield size={18} />
            </div>
            <div>
              <h4 style={{ fontWeight: 600, fontSize: "0.9375rem" }}>Hardened Security</h4>
              <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                Includes SQL Injection protections, global XSS sanitizers, and comprehensive audit logs.
              </p>
            </div>
          </div>

          <div className="glass-card" style={{ padding: "1.5rem", display: "flex", gap: "1rem", alignItems: "flex-start" }}>
            <div style={{ padding: "0.5rem", borderRadius: "8px", background: "rgba(124, 58, 237, 0.08)", color: "var(--accent-secondary)" }}>
              <Layers size={18} />
            </div>
            <div>
              <h4 style={{ fontWeight: 600, fontSize: "0.9375rem" }}>Unified Monorepo</h4>
              <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                Perfect sync between backend controllers and a beautiful component-driven frontend.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── What We Provide (Features) ─────────────────────────────────────────── */}
      <section id="features" style={{ borderTop: "1px solid var(--border-subtle)", padding: "5rem 1.5rem" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <h2 style={{ fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.02em" }}>What We Provide</h2>
            <p style={{ color: "var(--text-secondary)", marginTop: "0.5rem", maxWidth: "500px", margin: "0.5rem auto 0" }}>
              Explore the core service pillars built into this enterprise customer management platform.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))",
              gap: "2rem",
            }}
          >
            {/* Pillar 1: CRM & Pipeline */}
            <div className="glass-card" style={{ padding: "2rem" }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--accent-primary)", marginBottom: "1rem" }}>
                1. Customer & Pipeline Management
              </h3>
              <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
                Keep track of contacts, follow up on deals, and organize communication trails in one place.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <Users size={15} color="var(--text-muted)" />
                  <span style={{ fontSize: "0.8125rem", fontWeight: 500 }}>Customers Directory</span>
                </div>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <Target size={15} color="var(--text-muted)" />
                  <span style={{ fontSize: "0.8125rem", fontWeight: 500 }}>Sales Leads Tracker</span>
                </div>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <Handshake size={15} color="var(--text-muted)" />
                  <span style={{ fontSize: "0.8125rem", fontWeight: 500 }}>Deal Opportunities</span>
                </div>
              </div>
            </div>

            {/* Pillar 2: Sales & Billing */}
            <div className="glass-card" style={{ padding: "2rem" }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--accent-secondary)", marginBottom: "1rem" }}>
                2. Products & Billing Operations
              </h3>
              <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
                Manage price listings, generate estimates, and log customer invoices and payments safely.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <Package size={15} color="var(--text-muted)" />
                  <span style={{ fontSize: "0.8125rem", fontWeight: 500 }}>Product Catalog</span>
                </div>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <FileText size={15} color="var(--text-muted)" />
                  <span style={{ fontSize: "0.8125rem", fontWeight: 500 }}>Quotations Estimator</span>
                </div>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <Receipt size={15} color="var(--text-muted)" />
                  <span style={{ fontSize: "0.8125rem", fontWeight: 500 }}>Invoices & Payments</span>
                </div>
              </div>
            </div>

            {/* Pillar 3: Productivity */}
            <div className="glass-card" style={{ padding: "2rem" }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--accent-emerald)", marginBottom: "1rem" }}>
                3. Operations & Productivity
              </h3>
              <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
                Optimize tasks checklists, schedule shared events, and dispatch alerts to active users.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <CheckSquare size={15} color="var(--text-muted)" />
                  <span style={{ fontSize: "0.8125rem", fontWeight: 500 }}>Team Tasks Tracker</span>
                </div>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <Calendar size={15} color="var(--text-muted)" />
                  <span style={{ fontSize: "0.8125rem", fontWeight: 500 }}>Shared Event Calendars</span>
                </div>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <Bell size={15} color="var(--text-muted)" />
                  <span style={{ fontSize: "0.8125rem", fontWeight: 500 }}>Real-time Notifications</span>
                </div>
              </div>
            </div>

            {/* Pillar 4: Analytics & Security */}
            <div className="glass-card" style={{ padding: "2rem" }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--accent-cyan)", marginBottom: "1rem" }}>
                4. Analytics, Auditing & Files
              </h3>
              <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
                Export analytical CSV data, secure customer document storage, and monitor auditing records.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <BarChart2 size={15} color="var(--text-muted)" />
                  <span style={{ fontSize: "0.8125rem", fontWeight: 500 }}>CSV Report Generators</span>
                </div>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <HardDrive size={15} color="var(--text-muted)" />
                  <span style={{ fontSize: "0.8125rem", fontWeight: 500 }}>Secure Files Vault</span>
                </div>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <UserCog size={15} color="var(--text-muted)" />
                  <span style={{ fontSize: "0.8125rem", fontWeight: 500 }}>Admin Settings & Logs</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Tech Stack Row ───────────────────────────────────────────────────── */}
      <section style={{ borderTop: "1px solid var(--border-subtle)", padding: "4rem 1.5rem", background: "var(--bg-elevated)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "1.5rem" }}>
            Powered by Next-Gen Technologies
          </div>
          <div style={{ display: "flex", gap: "2.5rem", justifyContent: "center", flexWrap: "wrap", opacity: 0.65 }}>
            <span style={{ fontWeight: 700, fontSize: "1.125rem" }}>Next.js 16</span>
            <span style={{ fontWeight: 700, fontSize: "1.125rem" }}>Tailwind CSS v4</span>
            <span style={{ fontWeight: 700, fontSize: "1.125rem" }}>Express 5</span>
            <span style={{ fontWeight: 700, fontSize: "1.125rem" }}>Sequelize ORM</span>
            <span style={{ fontWeight: 700, fontSize: "1.125rem" }}>Redis Caching</span>
            <span style={{ fontWeight: 700, fontSize: "1.125rem" }}>MySQL DB</span>
          </div>
        </div>
      </section>

      {/* ─── Footer CTA ───────────────────────────────────────────────────────── */}
      <footer style={{ borderTop: "1px solid var(--border-subtle)", padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "0.75rem", letterSpacing: "-0.02em" }}>
            Ready to Accelerate Your Operations?
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9375rem", maxWidth: "500px", margin: "0 auto 1.75rem" }}>
            Log in to the system to access your leads panel, check dashboard stats, and manage quotations.
          </p>
          <Link href={isLoggedIn ? "/dashboard" : "/login"} className="btn btn-primary btn-lg">
            {isLoggedIn ? "Go to Dashboard" : "Sign In to Workspace"} <ArrowRight size={16} />
          </Link>
          <div style={{ marginTop: "3rem", fontSize: "0.75rem", color: "var(--text-muted)" }}>
            © 2026 Enterprise CRM platform. Built with security, performance, and rich aesthetics.
          </div>
        </div>
      </footer>
    </div>
  );
}
