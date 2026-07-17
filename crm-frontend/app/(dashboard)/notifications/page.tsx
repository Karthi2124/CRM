"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Bell, CheckCheck } from "lucide-react";
import { notificationsApi } from "@/lib/api";
import { Notification } from "@/types";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/lib/providers";
import { format } from "date-fns";

export default function NotificationsPage() {
  const qc = useQueryClient();
  const { success } = useToast();

  const { data, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => notificationsApi.list({ limit: 50 }),
  });

  const rows = (data?.data?.data ?? []) as Notification[];

  const markReadMutation = useMutation({
    mutationFn: (id: string) => notificationsApi.markRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const markAllMutation = useMutation({
    mutationFn: () => notificationsApi.markAllRead(),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["notifications"] }); success("All notifications marked as read"); },
  });

  const unreadCount = rows.filter((n) => !n.is_read).length;

  return (
    <div>
      <PageHeader
        title="Notifications"
        subtitle={`${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`}
        action={
          unreadCount > 0 ? (
            <Button variant="secondary" onClick={() => markAllMutation.mutate()} loading={markAllMutation.isPending}>
              <CheckCheck size={15} /> Mark all read
            </Button>
          ) : undefined
        }
      />

      {isLoading ? (
        <div style={{ padding: "2rem", color: "var(--text-muted)", textAlign: "center" }}>Loading notifications…</div>
      ) : rows.length === 0 ? (
        <div className="glass-card" style={{ padding: "3rem", textAlign: "center" }}>
          <Bell size={40} style={{ color: "var(--text-muted)", margin: "0 auto 1rem" }} />
          <p style={{ color: "var(--text-muted)" }}>No notifications yet</p>
        </div>
      ) : (
        <div className="glass-card" style={{ overflow: "hidden" }}>
          {rows.map((n, idx) => (
            <div
              key={n.id}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "1rem",
                padding: "1rem 1.25rem",
                borderBottom: idx < rows.length - 1 ? "1px solid var(--border-subtle)" : "none",
                background: n.is_read ? "transparent" : "rgba(99,102,241,0.04)",
                cursor: n.is_read ? "default" : "pointer",
                transition: "background 0.15s",
              }}
              onClick={() => { if (!n.is_read) markReadMutation.mutate(n.id); }}
            >
              {/* Unread Dot */}
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: n.is_read ? "transparent" : "var(--accent-primary)", flexShrink: 0, marginTop: "5px" }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: n.is_read ? 400 : 600, color: "var(--text-primary)", fontSize: "0.875rem" }}>{n.title}</div>
                <div style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", marginTop: "2px" }}>{n.message}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>
                  {format(new Date(n.created_at), "dd MMM yyyy, HH:mm")}
                </div>
              </div>
              <span className={`badge badge-neutral`} style={{ fontSize: "0.6875rem" }}>{n.type?.replace(/_/g, " ")}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
