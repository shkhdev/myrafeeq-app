import type { ReactNode } from "react";

interface SettingsSectionProps {
  title: string;
  children: ReactNode;
}

export function SettingsSection({ title, children }: SettingsSectionProps) {
  return (
    <div className="mt-6">
      <h3 className="mb-2.5 ps-1 text-sm font-semibold text-on-surface-muted">{title}</h3>
      <div className="overflow-hidden rounded-2xl bg-on-surface/5 ring-1 ring-on-surface/10">
        {children}
      </div>
    </div>
  );
}
