interface BadgeProps {
  variant?: "success" | "warning" | "danger" | "info" | "primary" | "neutral";
  children: React.ReactNode;
  dot?: boolean;
}

export function Badge({ variant = "neutral", children, dot }: BadgeProps) {
  return (
    <span className={`badge badge-${variant}`}>
      {dot && (
        <span
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: "currentColor",
            flexShrink: 0,
          }}
        />
      )}
      {children}
    </span>
  );
}

// ─── Status Badge Helpers ─────────────────────────────────────────────────────
export function statusBadge(status: string) {
  const map: Record<string, "success" | "warning" | "danger" | "info" | "primary" | "neutral"> = {
    // Generic
    active: "success",
    inactive: "neutral",
    pending: "warning",
    completed: "success",
    cancelled: "danger",
    // Lead/Opp status
    new: "info",
    contacted: "primary",
    qualified: "success",
    lost: "danger",
    won: "success",
    open: "info",
    // Invoice
    paid: "success",
    unpaid: "warning",
    partially_paid: "info",
    overdue: "danger",
    draft: "neutral",
    sent: "primary",
    accepted: "success",
    rejected: "danger",
    expired: "neutral",
    // Task
    in_progress: "info",
    // Calendar
    scheduled: "primary",
    // Suspended
    suspended: "danger",
    prospect: "info",
  };
  const variant = map[status?.toLowerCase()] ?? "neutral";
  return <Badge variant={variant} dot>{status?.replace(/_/g, " ")}</Badge>;
}

export function priorityBadge(priority: string) {
  const map: Record<string, "success" | "warning" | "danger" | "info" | "primary" | "neutral"> = {
    low: "success",
    medium: "warning",
    high: "danger",
    urgent: "danger",
  };
  const variant = map[priority?.toLowerCase()] ?? "neutral";
  return <Badge variant={variant}>{priority}</Badge>;
}
