"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, Target, Handshake, Package, FileText,
  Receipt, CheckSquare, Calendar, Bell, BarChart2, HardDrive,
  Shield, Settings, UserCog, ChevronLeft, ChevronRight, Building2,
  ScrollText,
} from "lucide-react";
import { useState } from "react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard size={17} /> },
    ],
  },
  {
    label: "CRM",
    items: [
      { label: "Customers", href: "/customers", icon: <Users size={17} /> },
      { label: "Leads", href: "/leads", icon: <Target size={17} /> },
      { label: "Opportunities", href: "/opportunities", icon: <Handshake size={17} /> },
    ],
  },
  {
    label: "Sales",
    items: [
      { label: "Products", href: "/products", icon: <Package size={17} /> },
      { label: "Quotations", href: "/quotations", icon: <FileText size={17} /> },
      { label: "Invoices", href: "/invoices", icon: <Receipt size={17} /> },
    ],
  },
  {
    label: "Productivity",
    items: [
      { label: "Tasks", href: "/tasks", icon: <CheckSquare size={17} /> },
      { label: "Calendar", href: "/calendar", icon: <Calendar size={17} /> },
      { label: "Notifications", href: "/notifications", icon: <Bell size={17} /> },
    ],
  },
  {
    label: "Analytics",
    items: [
      { label: "Reports", href: "/reports", icon: <BarChart2 size={17} /> },
      { label: "Files", href: "/files", icon: <HardDrive size={17} /> },
    ],
  },
  {
    label: "Admin",
    items: [
      { label: "Users", href: "/users", icon: <UserCog size={17} /> },
      { label: "Roles", href: "/roles", icon: <Shield size={17} /> },
      { label: "Audit Logs", href: "/audit-logs", icon: <ScrollText size={17} /> },
      { label: "Settings", href: "/settings", icon: <Settings size={17} /> },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  return (
    <div className={`app-sidebar ${collapsed ? "collapsed" : ""}`}>
      {/* Logo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          padding: "1rem 1rem 0.75rem",
          borderBottom: "1px solid var(--border-subtle)",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "8px",
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Building2 size={17} color="white" />
        </div>
        {!collapsed && (
          <div>
            <div
              className="sidebar-logo-text"
              style={{
                fontWeight: 700,
                fontSize: "0.9375rem",
                color: "var(--text-primary)",
                lineHeight: 1.2,
              }}
            >
              Enterprise CRM
            </div>
            <div style={{ fontSize: "0.6875rem", color: "var(--text-muted)" }}>
              v1.0.0
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0.5rem 0", paddingBottom: "1rem" }}>
        {navGroups.map((group) => (
          <div key={group.label}>
            {!collapsed && (
              <div className="nav-group-label">{group.label}</div>
            )}
            {group.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item ${isActive(item.href) ? "active" : ""}`}
                title={collapsed ? item.label : undefined}
              >
                <span
                  className="nav-icon"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexShrink: 0,
                    color: isActive(item.href) ? "var(--accent-primary)" : "currentColor",
                  }}
                >
                  {item.icon}
                </span>
                {!collapsed && (
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                    {item.label}
                  </span>
                )}
              </Link>
            ))}
          </div>
        ))}
      </div>

      {/* Collapse Toggle */}
      <div
        style={{
          padding: "0.75rem",
          borderTop: "1px solid var(--border-subtle)",
          flexShrink: 0,
        }}
      >
        <button
          className="btn btn-ghost btn-icon"
          onClick={() => setCollapsed((c) => !c)}
          style={{ width: "100%", justifyContent: collapsed ? "center" : "flex-end" }}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    </div>
  );
}
