import { formatTime12h } from "@/lib/prayer-time-utils";
import { usePreferencesStore } from "@/stores/preferences-store";

const identity = (v: string) => v;

export function useTimeFormatter(): (time: string) => string {
  const timeFormat = usePreferencesStore((s) => s.timeFormat);
  return timeFormat === "12h" ? formatTime12h : identity;
}
