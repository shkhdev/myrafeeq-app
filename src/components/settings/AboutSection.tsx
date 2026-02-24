"use client";

import { useTranslations } from "next-intl";

import { SettingsSection } from "./SettingsSection";

export function AboutSection() {
  const t = useTranslations("settings");

  return (
    <SettingsSection title={t("about")}>
      <div className="flex items-center justify-between px-4 py-3.5">
        <div>
          <p className="text-[15px] font-semibold text-on-surface">MyRafeeq</p>
          <p className="mt-0.5 text-xs text-on-surface-muted">{t("appDescription")}</p>
        </div>
        <span className="text-xs tabular-nums text-on-surface-muted">
          {t("version", { version: "0.1.0" })}
        </span>
      </div>
    </SettingsSection>
  );
}
