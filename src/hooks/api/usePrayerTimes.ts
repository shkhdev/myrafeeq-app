import { useQuery } from "@tanstack/react-query";
import { getPrayerTimes, getPrayerTimesByLocation } from "@/lib/api/prayer-times";

export function usePrayerTimes(date?: string) {
  return useQuery({
    queryKey: ["prayer-times", date],
    queryFn: ({ signal }) => getPrayerTimes(date ? { date } : undefined, signal),
  });
}

export function usePrayerTimesByLocation(
  lat: number,
  lon: number,
  options?: { timezone?: string; method?: string; madhab?: string; enabled?: boolean },
) {
  const { timezone, method, madhab, enabled = true } = options ?? {};
  return useQuery({
    queryKey: ["prayer-times-location", lat, lon, timezone, method, madhab],
    queryFn: ({ signal }) =>
      getPrayerTimesByLocation(
        {
          lat,
          lon,
          ...(timezone != null ? { timezone } : {}),
          ...(method != null ? { method } : {}),
          ...(madhab != null ? { madhab } : {}),
        },
        signal,
      ),
    enabled,
  });
}
