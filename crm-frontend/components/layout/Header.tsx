"use client";

import { Bell, LogOut, User, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { authApi } from "@/lib/api";
import { clearAuth, getStoredUser } from "@/lib/auth";
import { useToast } from "@/lib/providers";

export function Header() {
  const router = useRouter();
  const { success } = useToast();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [user, setUser] = useState<{ first_name?: string; last_name?: string; email?: string } | null>(null);

  useEffect(() => {
    const rawUser = getStoredUser();
    if (rawUser) {
      setUser(rawUser as any);
    }
  }, []);

  const initials = user
    ? `${user.first_name?.[0] ?? ""}${user.last_name?.[0] ?? ""}`.toUpperCase()
    : "U";

  const fullName = user
    ? `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim()
    : "User";

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch { /* ignore */ }
    clearAuth();
    success("Logged out", "See you again soon.");
    router.push("/login");
  };

  return (
    <div className="app-header">
      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Notification Bell */}
      <button
        className="btn btn-ghost btn-icon"
        style={{ position: "relative" }}
        onClick={() => router.push("/notifications")}
        title="Notifications"
      >
        <Bell size={18} />
        {/* Unread dot */}
        <span
          style={{
            position: "absolute",
            top: "6px",
            right: "6px",
            width: "7px",
            height: "7px",
            borderRadius: "50%",
            background: "var(--accent-red)",
            border: "2px solid var(--bg-surface)",
          }}
        />
      </button>

      {/* Divider */}
      <div
        style={{
          width: "1px",
          height: "24px",
          background: "var(--border-subtle)",
        }}
      />

      {/* User Dropdown */}
      <div ref={dropdownRef} style={{ position: "relative" }}>
        <button
          className="btn btn-ghost"
          style={{ gap: "0.5rem", padding: "0.375rem 0.5rem" }}
          onClick={() => setDropdownOpen((o) => !o)}
        >
          <div className="avatar" style={{ width: "30px", height: "30px", fontSize: "0.7rem" }}>
            {initials}
          </div>
          <span
            style={{
              fontSize: "0.875rem",
              fontWeight: 500,
              color: "var(--text-primary)",
              maxWidth: "120px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {fullName}
          </span>
          <ChevronDown size={14} color="var(--text-muted)" />
        </button>

        {dropdownOpen && (
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 8px)",
              right: 0,
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-default)",
              borderRadius: "var(--radius-md)",
              minWidth: "180px",
              boxShadow: "var(--shadow-lg)",
              zIndex: 50,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "0.75rem 1rem",
                borderBottom: "1px solid var(--border-subtle)",
              }}
            >
              <div className="font-medium text-sm text-primary">{fullName}</div>
              <div className="text-xs text-muted" style={{ marginTop: "2px" }}>
                {user?.email}
              </div>
            </div>
            <button
              className="btn btn-ghost"
              style={{
                width: "100%",
                justifyContent: "flex-start",
                borderRadius: 0,
                padding: "0.625rem 1rem",
                gap: "0.625rem",
                color: "var(--text-secondary)",
              }}
              onClick={() => {
                setDropdownOpen(false);
                router.push("/users");
              }}
            >
              <User size={14} />
              <span>Profile</span>
            </button>
            <div className="divider" style={{ margin: 0 }} />
            <button
              className="btn btn-ghost"
              style={{
                width: "100%",
                justifyContent: "flex-start",
                borderRadius: 0,
                padding: "0.625rem 1rem",
                gap: "0.625rem",
                color: "var(--accent-red)",
              }}
              onClick={handleLogout}
            >
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
