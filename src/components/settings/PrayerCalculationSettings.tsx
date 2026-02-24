import { useState } from "react";
import { useTranslations } from "use-intl";

import { getRecommendedMethod } from "@/data/calculation-methods";
import { useHaptic } from "@/hooks/useHaptic";
import { usePreferencesStore } from "@/stores/preferences-store";
import type { CalculationMethodId, Madhab } from "@/types/prayer";
import { CALCULATION_METHODS } from "@/types/prayer";

import { ManualAdjustments } from "./ManualAdjustments";
import { SettingsSection } from "./SettingsSection";

const HIJRI_OPTIONS = [-2, -1, 0, 1, 2] as const;

export function PrayerCalculationSettings() {
  const t = useTranslations("settings");
  const haptic = useHaptic();
  const [showMethodPicker, setShowMethodPicker] = useState(false);
  const [showAdjustments, setShowAdjustments] = useState(false);

  const city = usePreferencesStore((s) => s.city);
  const calculationMethod = usePreferencesStore((s) => s.calculationMethod);
  const setCalculationMethod = usePreferencesStore((s) => s.setCalculationMethod);
  const madhab = usePreferencesStore((s) => s.madhab);
  const setMadhab = usePreferencesStore((s) => s.setMadhab);
  const hijriCorrection = usePreferencesStore((s) => s.hijriCorrection);
  const setHijriCorrection = usePreferencesStore((s) => s.setHijriCorrection);

  const recommended = city ? getRecommendedMethod(city.id) : "mwl";

  const handleMethodSelect = (method: CalculationMethodId) => {
    setCalculationMethod(method);
    haptic.selectionChanged();
    setShowMethodPicker(false);
  };

  const handleMadhabSelect = (m: Madhab) => {
    setMadhab(m);
    haptic.selectionChanged();
  };

  const handleHijriSelect = (correction: number) => {
    setHijriCorrection(correction);
    haptic.selectionChanged();
  };

  if (showAdjustments) {
    return <ManualAdjustments onBack={() => setShowAdjustments(false)} />;
  }

  return (
    <SettingsSection title={t("prayerCalculation")}>
      {/* Calculation Method — tap to open picker */}
      <button
        type="button"
        onClick={() => setShowMethodPicker(!showMethodPicker)}
        className="flex w-full items-center justify-between border-b border-on-surface/5 px-4 py-3.5 transition-colors hover:bg-on-surface/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-on-surface/30"
      >
        <div className="flex flex-col items-start gap-0.5">
          <span className="text-[15px] font-medium text-on-surface">{t("calculationMethod")}</span>
          <span className="text-xs text-on-surface-muted">
            {t(`method_${calculationMethod}`)}
            {calculationMethod === recommended && (
              <span className="ms-1 text-primary">({t("recommended")})</span>
            )}
          </span>
        </div>
        <ChevronIcon rotated={showMethodPicker} />
      </button>

      {/* Inline method picker */}
      {showMethodPicker && (
        <div className="max-h-[40dvh] overflow-y-auto border-b border-on-surface/5">
          {CALCULATION_METHODS.map((method) => {
            const isSelected = calculationMethod === method.id;
            const isRecommended = method.id === recommended;
            return (
              <button
                key={method.id}
                type="button"
                onClick={() => handleMethodSelect(method.id)}
                className={`flex w-full items-center justify-between px-4 py-3 transition-colors hover:bg-on-surface/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-on-surface/30 ${
                  isSelected ? "bg-primary/5" : ""
                }`}
              >
                <div className="flex flex-col items-start gap-0.5">
                  <span
                    className={`text-sm ${isSelected ? "font-semibold text-primary" : "font-medium text-on-surface"}`}
                  >
                    {t(`method_${method.id}`)}
                    {isRecommended && (
                      <span className="ms-1 text-xs font-normal text-primary">
                        ({t("recommended")})
                      </span>
                    )}
                  </span>
                  <span className="text-[11px] tabular-nums text-on-surface-muted">
                    {t("fajrAngle")}: {method.fajrAngle}° · {t("ishaLabel")}:{" "}
                    {method.ishaMinutes ? `${method.ishaMinutes} min` : `${method.ishaAngle}°`}
                  </span>
                </div>
                {isSelected && <RadioDot />}
              </button>
            );
          })}
        </div>
      )}

      {/* Madhab — segmented control */}
      <div className="border-b border-on-surface/5 px-4 py-3.5">
        <p className="mb-2 text-[15px] font-medium text-on-surface">{t("madhab")}</p>
        <div className="flex gap-1.5 rounded-xl bg-on-surface/5 p-1">
          {(["standard", "hanafi"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => handleMadhabSelect(m)}
              className={`flex-1 rounded-lg py-2 text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-on-surface/30 ${
                madhab === m
                  ? "bg-surface text-on-surface shadow-sm"
                  : "text-on-surface-muted hover:text-on-surface"
              }`}
            >
              {t(`madhab_${m}`)}
            </button>
          ))}
        </div>
        <p className="mt-1.5 text-[11px] leading-relaxed text-on-surface-muted">
          {t("madhabDescription")}
        </p>
      </div>

      {/* Hijri Date Correction — segmented control */}
      <div className="border-b border-on-surface/5 px-4 py-3.5">
        <p className="mb-2 text-[15px] font-medium text-on-surface">{t("hijriCorrection")}</p>
        <div className="flex gap-1.5 rounded-xl bg-on-surface/5 p-1">
          {HIJRI_OPTIONS.map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => handleHijriSelect(val)}
              className={`flex-1 rounded-lg py-2 text-xs font-medium tabular-nums transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-on-surface/30 ${
                hijriCorrection === val
                  ? "bg-surface text-on-surface shadow-sm"
                  : "text-on-surface-muted hover:text-on-surface"
              }`}
            >
              {val > 0 ? `+${val}` : val}
            </button>
          ))}
        </div>
        <p className="mt-1.5 text-[11px] leading-relaxed text-on-surface-muted">
          {t("hijriDescription")}
        </p>
      </div>

      {/* Manual Adjustments — navigation row */}
      <button
        type="button"
        onClick={() => setShowAdjustments(true)}
        className="flex w-full items-center justify-between px-4 py-3.5 transition-colors hover:bg-on-surface/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-on-surface/30"
      >
        <div className="flex flex-col items-start gap-0.5">
          <span className="text-[15px] font-medium text-on-surface">{t("manualAdjustments")}</span>
          <span className="text-xs text-on-surface-muted">{t("adjustmentsSubtitle")}</span>
        </div>
        <ChevronIcon />
      </button>
    </SettingsSection>
  );
}

function ChevronIcon({ rotated }: { rotated?: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`text-on-surface-muted transition-transform ${rotated ? "rotate-90" : ""}`}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function RadioDot() {
  return (
    <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-primary">
      <div className="h-2.5 w-2.5 rounded-full bg-primary" />
    </div>
  );
}
