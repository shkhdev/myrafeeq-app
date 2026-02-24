import { useTranslations } from "use-intl";

import { getPrayerIcon } from "@/lib/prayer-icons";
import { formatTime12h } from "@/lib/prayer-time-utils";
import { usePreferencesStore } from "@/stores/preferences-store";
import type { PrayerName } from "@/types/prayer";

interface PrayerRowProps {
  prayer: PrayerName | "sunrise";
  time: string;
  isActive: boolean;
  isPast: boolean;
  isPrayed: boolean;
  isLast: boolean;
  onToggle?: () => void;
}

function buildRowClasses(isLast: boolean, isActive: boolean, dimRow: boolean): string {
  const base =
    "flex min-h-[52px] w-full items-center justify-between px-4 py-3 transition-colors hover:bg-on-surface/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-on-surface/30";
  const border = isLast ? "" : " border-b border-on-surface/5";
  const active = isActive ? " bg-primary/5" : "";
  const dim = dimRow ? " opacity-60" : "";
  return `${base}${border}${active}${dim}`;
}

export function PrayerRow({
  prayer,
  time,
  isActive,
  isPast,
  isPrayed,
  isLast,
  onToggle,
}: PrayerRowProps) {
  const tCommon = useTranslations("common");
  const timeFormat = usePreferencesStore((s) => s.timeFormat);
  const Icon = getPrayerIcon(prayer);
  const formatTime = timeFormat === "12h" ? formatTime12h : (t: string) => t;

  // Past + unchecked rows are dimmed; checking restores full opacity
  const dimRow = isPast && !isPrayed;

  if (prayer === "sunrise") {
    return (
      <div
        className={`flex min-h-[44px] items-center justify-between px-4 py-2 transition-opacity ${!isLast ? "border-b border-on-surface/5" : ""} ${dimRow ? "opacity-60" : ""}`}
      >
        <span className="flex items-center gap-3 text-xs font-medium text-on-surface-muted/70">
          <Icon size={24} />
          {tCommon("sunrise")}
        </span>
        <span className="text-xs tabular-nums text-on-surface-muted/70">{formatTime(time)}</span>
      </div>
    );
  }

  // Future prayers (not yet active, not past) cannot be toggled
  const isFuture = !isPast && !isActive;
  const canToggle = !isFuture;

  const nameColor = isActive ? "text-primary" : "text-on-surface";
  const nameClass = `text-[15px] font-medium ${nameColor}${isPrayed ? " line-through opacity-60" : ""}`;
  const timeColor = isActive ? "font-semibold text-primary" : "text-on-surface";
  const timeClass = `text-[15px] tabular-nums ${timeColor}${isPrayed ? " line-through opacity-60" : ""}`;
  const checkClass = isPrayed ? "border-primary bg-primary" : "border-on-surface/30";

  return (
    <button
      type="button"
      disabled={!canToggle}
      onClick={canToggle ? onToggle : undefined}
      className={buildRowClasses(isLast, isActive, dimRow)}
      aria-label={`${tCommon(prayer)} ${isPrayed ? "prayed" : "not prayed"}`}
    >
      <span className="flex items-center gap-3">
        <Icon size={32} />
        <span className={nameClass}>{tCommon(prayer)}</span>
        {isActive && (
          <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary">
            NOW
          </span>
        )}
      </span>
      <span className="flex items-center gap-3">
        <span className={timeClass}>{formatTime(time)}</span>
        {canToggle && (
          <div
            className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors ${checkClass}`}
          >
            {isPrayed && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            )}
          </div>
        )}
      </span>
    </button>
  );
}
