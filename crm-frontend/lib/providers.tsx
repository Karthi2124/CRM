"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, createContext, useContext, useCallback } from "react";
import { CheckCircle, XCircle, AlertTriangle, X } from "lucide-react";

// ─── Toast System ─────────────────────────────────────────────────────────────
interface Toast {
  id: string;
  type: "success" | "error" | "warning";
  title: string;
  message?: string;
}

interface ToastContextValue {
  toast: (opts: Omit<Toast, "id">) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within Providers");
  return ctx;
}

// ─── Providers ────────────────────────────────────────────────────────────────
export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            retry: 1,
          },
        },
      })
  );

  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((opts: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { ...opts, id }]);
    setTimeout(() => removeToast(id), 4000);
  }, [removeToast]);

  const toastCtx: ToastContextValue = {
    toast: addToast,
    success: (title, message) => addToast({ type: "success", title, message }),
    error: (title, message) => addToast({ type: "error", title, message }),
    warning: (title, message) => addToast({ type: "warning", title, message }),
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ToastContext.Provider value={toastCtx}>
        {children}
        {/* Toast Container */}
        <div className="toast-container">
          {toasts.map((t) => (
            <div key={t.id} className={`toast ${t.type}`}>
              <div style={{ flexShrink: 0, marginTop: "1px" }}>
                {t.type === "success" && <CheckCircle size={16} color="var(--accent-emerald)" />}
                {t.type === "error" && <XCircle size={16} color="var(--accent-red)" />}
                {t.type === "warning" && <AlertTriangle size={16} color="var(--accent-amber)" />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="font-medium text-primary" style={{ fontSize: "0.875rem" }}>{t.title}</div>
                {t.message && (
                  <div className="text-secondary" style={{ fontSize: "0.8125rem", marginTop: "2px" }}>
                    {t.message}
                  </div>
                )}
              </div>
              <button
                onClick={() => removeToast(t.id)}
                className="btn-ghost btn-icon"
                style={{ padding: "2px", flexShrink: 0 }}
              >
                <X size={14} color="var(--text-muted)" />
              </button>
            </div>
          ))}
        </div>
      </ToastContext.Provider>
    </QueryClientProvider>
  );
}
