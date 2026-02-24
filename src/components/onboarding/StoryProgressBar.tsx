"use client";

import { useTranslations } from "next-intl";

interface StoryProgressBarProps {
  totalCards: number;
  currentIndex: number;
  progress: number;
  duration: number;
}

export function StoryProgressBar({
  totalCards,
  currentIndex,
  progress,
  duration,
}: StoryProgressBarProps) {
  const t = useTranslations("common");

  return (
    <div
      className="flex gap-1.5"
      role="progressbar"
      aria-valuenow={currentIndex + 1}
      aria-valuemax={totalCards}
      aria-label={t("stepOf", { current: currentIndex + 1, total: totalCards })}
    >
      {Array.from({ length: totalCards }, (_, i) => {
        const isCompleted = i < currentIndex;
        const isCurrent = i === currentIndex;

        return (
          <div key={`bar-${i}`} className="h-[3px] flex-1 overflow-hidden rounded-full bg-on-surface/20">
            {isCompleted ? (
              <div className="h-full w-full rounded-full bg-primary" />
            ) : isCurrent ? (
              <div
                className="h-full rounded-full bg-primary"
                style={{
                  width: `${progress * 100}%`,
                  transition: `width ${duration > 0 ? "100ms" : "0ms"} linear`,
                }}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
