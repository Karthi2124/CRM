"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsApi } from "@/lib/api";
import { Setting } from "@/types";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/lib/providers";

const GROUPS = [
  { value: "company", label: "Company" },
  { value: "email", label: "Email / SMTP" },
  { value: "sms", label: "SMS" },
  { value: "tax", label: "Tax" },
  { value: "currency", label: "Currency" },
  { value: "localization", label: "Localization" },
];

export default function SettingsPage() {
  const qc = useQueryClient();
  const { success, error: toastError } = useToast();
  const [activeGroup, setActiveGroup] = useState("company");
  const [edits, setEdits] = useState<Record<string, string>>({});

  const { data, isLoading } = useQuery({
    queryKey: ["settings", activeGroup],
    queryFn: () => settingsApi.group(activeGroup),
  });

  // Reset edits whenever group changes (handled by state setter in nav click)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const settings = ((data as any)?.data?.data ?? []) as Setting[];

  const saveMutation = useMutation({
    mutationFn: () => settingsApi.update(activeGroup, edits),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["settings", activeGroup] }); success("Settings saved"); setEdits({}); },
    onError: () => toastError("Failed to save settings"),
  });

  const handleChange = (key: string, value: string) => {
    setEdits(e => ({ ...e, [key]: value }));
  };

  const getValue = (s: Setting) => edits[s.key] ?? s.value ?? "";

  return (
    <div>
      <PageHeader title="Settings" subtitle="Configure your CRM preferences" />

      <div className="settings-layout">
        {/* Settings Nav */}
        <div>
          <div className="glass-card" style={{ padding: "0.5rem" }}>
            <div className="settings-nav">
              {GROUPS.map((g) => (
                <button
                  key={g.value}
                  className={`settings-nav-item ${activeGroup === g.value ? "active" : ""}`}
                  onClick={() => { setActiveGroup(g.value); setEdits({}); }}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Settings Content */}
        <div className="glass-card" style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
            <div>
              <h3>{GROUPS.find(g => g.value === activeGroup)?.label} Settings</h3>
              <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginTop: "2px" }}>
                Configure {activeGroup} preferences
              </p>
            </div>
            {Object.keys(edits).length > 0 && (
              <Button loading={saveMutation.isPending} onClick={() => saveMutation.mutate()}>
                Save Changes
              </Button>
            )}
          </div>

          {isLoading ? (
            <div style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Loading settings…</div>
          ) : settings.length === 0 ? (
            <div style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>No settings found for this group.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {settings.map((s) => (
                <Input
                  key={s.id}
                  id={`setting-${s.key}`}
                  label={s.label}
                  type={s.type === "number" ? "number" : s.type === "email" ? "email" : "text"}
                  value={getValue(s)}
                  onChange={(e) => handleChange(s.key, e.target.value)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
