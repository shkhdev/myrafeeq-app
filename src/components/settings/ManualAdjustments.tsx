import { useTranslations } from "use-intl";

import { BackArrow } from "@/components/ui/BackArrow";
import { useHaptic } from "@/hooks/useHaptic";
import { getPrayerIcon } from "@/lib/prayer-icons";
import { usePreferencesStore } from "@/stores/preferences-store";
import type { PrayerTimeAdjustments } from "@/types/prayer";

const ADJUSTABLE_PRAYERS: (keyof PrayerTimeAdjustments)[] = [
  "fajr",
  "sunrise",
  "dhuhr",
  "asr",
  "maghrib",
  "isha",
];

interface ManualAdjustmentsProps {
  onBack: () => void;
}

export function ManualAdjustments({ onBack }: ManualAdjustmentsProps) {
  const t = useTranslations("settings");
  const tCommon = useTranslations("common");
  const haptic = useHaptic();
  const adjustments = usePreferencesStore((s) => s.adjustments);
  const setAdjustment = usePreferencesStore((s) => s.setAdjustment);
  const resetAdjustments = usePreferencesStore((s) => s.resetAdjustments);

  const hasAnyAdjustment = ADJUSTABLE_PRAYERS.some((p) => adjustments[p] !== 0);

  return (
    <div className="mt-6 animate-fade-in-up">
      {/* Header */}
      <div className="mb-2 flex items-center gap-2 ps-1">
        <BackArrow onClick={onBack} />
        <h3 className="text-sm font-semibold text-on-surface-muted">{t("manualAdjustments")}</h3>
      </div>

      {/* Per-prayer stepper rows */}
      <div className="overflow-hidden rounded-2xl bg-on-surface/5 ring-1 ring-on-surface/10">
        {/* Description inside the card */}
        <p className="px-4 pb-1 pt-3 text-[11px] leading-relaxed text-on-surface-muted">
          {t("adjustmentsDescription")}
        </p>

        {ADJUSTABLE_PRAYERS.map((prayer, i) => {
          const Icon = getPrayerIcon(prayer);
          const value = adjustments[prayer] ?? 0;
          const isModified = value !== 0;
          return (
            <div
              key={prayer}
              className={`flex items-center justify-between px-4 py-2.5 ${
                i < ADJUSTABLE_PRAYERS.length - 1 ? "border-b border-on-surface/5" : ""
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Icon size={22} />
                <span className="text-[13px] font-medium text-on-surface">{tCommon(prayer)}</span>
              </span>

              {/* Stepper: - [value] + */}
              <div className="flex items-center gap-0.5">
                <button
                  type="button"
                  onClick={() => {
                    setAdjustment(prayer, value - 1);
                    haptic.selectionChanged();
                  }}
                  disabled={value <= -30}
                  className="flex h-7 w-7 items-center justify-center rounded-full text-on-surface-muted transition-colors hover:bg-on-surface/10 active:bg-on-surface/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-on-surface/30 disabled:opacity-30"
                  aria-label={`Decrease ${tCommon(prayer)}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14" />
                  </svg>
                </button>

                <span
                  className={`w-10 text-center text-[13px] font-semibold tabular-nums ${
                    isModified ? "text-primary" : "text-on-surface-muted/60"
                  }`}
                >
                  {value > 0 ? `+${value}` : value}
                </span>

                <button
                  type="button"
                  onClick={() => {
                    setAdjustment(prayer, value + 1);
                    haptic.selectionChanged();
                  }}
                  disabled={value >= 30}
                  className="flex h-7 w-7 items-center justify-center rounded-full text-on-surface-muted transition-colors hover:bg-on-surface/10 active:bg-on-surface/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-on-surface/30 disabled:opacity-30"
                  aria-label={`Increase ${tCommon(prayer)}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14" />
                    <path d="M12 5v14" />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}

        {/* Footer: unit label + reset */}
        <div className="flex items-center justify-between border-t border-on-surface/5 px-4 py-2.5">
          <span className="text-[11px] text-on-surface-muted">{t("adjustmentsUnit")}</span>
          {hasAnyAdjustment && (
            <button
              type="button"
              onClick={() => {
                resetAdjustments();
                haptic.notification("success");
              }}
              className="text-[11px] font-medium text-destructive transition-colors hover:text-destructive/80"
            >
              {t("resetAdjustments")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
