import { useQuery } from "@tanstack/react-query";
import { getPrayerTimes, getPrayerTimesByLocation } from "@/lib/api/prayer-times";

export function usePrayerTimes(date?: string) {
  return useQuery({
    queryKey: ["prayer-times", date],
    queryFn: () => getPrayerTimes(date ? { date } : undefined),
  });
}

export function usePrayerTimesByLocation(lat: number, lon: number, enabled = true) {
  return useQuery({
    queryKey: ["prayer-times-location", lat, lon],
    queryFn: () => getPrayerTimesByLocation({ lat, lon }),
    enabled,
  });
}
