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
    <div className="animate-fade-in-up">
      {/* Header */}
      <div className="mb-4 flex items-center gap-2">
        <BackArrow onClick={onBack} />
        <h3 className="text-base font-bold text-on-surface">{t("manualAdjustments")}</h3>
      </div>

      <p className="mb-4 ps-1 text-xs leading-relaxed text-on-surface-muted">
        {t("adjustmentsDescription")}
      </p>

      {/* Per-prayer stepper rows */}
      <div className="overflow-hidden rounded-2xl bg-on-surface/5 ring-1 ring-on-surface/10">
        {ADJUSTABLE_PRAYERS.map((prayer, i) => {
          const Icon = getPrayerIcon(prayer);
          const value = adjustments[prayer] ?? 0;
          return (
            <div
              key={prayer}
              className={`flex items-center justify-between px-4 py-3 ${
                i < ADJUSTABLE_PRAYERS.length - 1 ? "border-b border-on-surface/5" : ""
              }`}
            >
              <span className="flex items-center gap-3">
                <Icon size={28} />
                <span className="text-sm font-medium text-on-surface">{tCommon(prayer)}</span>
              </span>

              {/* Stepper: - [value] + */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setAdjustment(prayer, value - 1);
                    haptic.selectionChanged();
                  }}
                  disabled={value <= -30}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-on-surface/5 text-on-surface transition-colors hover:bg-on-surface/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-on-surface/30 disabled:opacity-30"
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
                  className={`w-12 text-center text-sm font-semibold tabular-nums ${
                    value !== 0 ? "text-primary" : "text-on-surface-muted"
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
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-on-surface/5 text-on-surface transition-colors hover:bg-on-surface/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-on-surface/30 disabled:opacity-30"
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
      </div>

      {/* Reset button */}
      {hasAnyAdjustment && (
        <button
          type="button"
          onClick={() => {
            resetAdjustments();
            haptic.notification("success");
          }}
          className="mt-3 w-full text-center text-sm font-medium text-destructive transition-colors hover:text-destructive/80"
        >
          {t("resetAdjustments")}
        </button>
      )}

      {/* Unit label */}
      <p className="mt-2 text-center text-[11px] text-on-surface-muted">{t("adjustmentsUnit")}</p>
    </div>
  );
}
