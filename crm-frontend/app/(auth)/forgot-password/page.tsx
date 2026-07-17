"use client";

import { useState } from "react";
import { Building2, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { authApi } from "@/lib/api";
import { AxiosError } from "axios";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authApi.forgotPassword(email);
      setSent(true);
    } catch (err) {
      const axiosErr = err as AxiosError<{ message: string }>;
      setError(axiosErr.response?.data?.message ?? "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <div className="login-logo-icon">
            <Building2 size={20} color="white" />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: "1.0625rem", color: "var(--text-primary)" }}>
              Enterprise CRM
            </div>
          </div>
        </div>

        {sent ? (
          <div style={{ textAlign: "center", padding: "1rem 0" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background: "rgba(16,185,129,0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1rem",
              }}
            >
              <span style={{ fontSize: "1.5rem" }}>✓</span>
            </div>
            <h2>Check your email</h2>
            <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "0.5rem" }}>
              We sent a password reset link to <strong>{email}</strong>
            </p>
            <Link href="/login" className="btn btn-secondary" style={{ marginTop: "1.5rem", display: "inline-flex" }}>
              Back to sign in
            </Link>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: "1.75rem" }}>
              <h2 style={{ fontWeight: 700, marginBottom: "0.25rem" }}>Reset password</h2>
              <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
                Enter your email and we'll send you a reset link.
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {error && (
                <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "var(--radius-md)", padding: "0.75rem", fontSize: "0.875rem", color: "var(--accent-red)" }}>
                  {error}
                </div>
              )}
              <div className="form-group">
                <label className="form-label" htmlFor="email">Email address</label>
                <input id="email" type="email" className="form-input" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading}>
                {loading && <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />}
                {loading ? "Sending…" : "Send reset link"}
              </button>
            </form>

            <Link href="/login" style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "1.5rem", color: "var(--text-secondary)", fontSize: "0.875rem", textDecoration: "none" }}>
              <ArrowLeft size={14} /> Back to sign in
            </Link>
          </>
        )}
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
