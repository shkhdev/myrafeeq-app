"use client";

import { useTranslations } from "next-intl";

interface StepIndicatorProps {
  current: number;
  total: number;
}

export function StepIndicator({ current, total }: StepIndicatorProps) {
  const t = useTranslations("common");

  return (
    <div
      className="flex items-center gap-2"
      role="group"
      aria-label={t("stepOf", { current, total })}
    >
      {Array.from({ length: total }, (_, i) => (
        <div
          key={`step-${i}`}
          className={`rounded-full transition-all duration-300 ${
            i + 1 === current
              ? "h-2 w-6 bg-primary shadow-[0_0_8px_var(--color-primary)]"
              : i + 1 < current
                ? "h-2 w-2 bg-primary/50"
                : "h-2 w-2 bg-white/20"
          }`}
        />
      ))}
    </div>
  );
}
