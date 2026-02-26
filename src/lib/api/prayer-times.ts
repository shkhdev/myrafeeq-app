import { z } from "zod/v4";
import { api } from "@/lib/api-client";
import { PrayerTimesResponseSchema } from "@/lib/api-schemas";
import type { PrayerTimesResponse } from "@/types/api";

export async function getPrayerTimes(params?: {
  date?: string;
  days?: number;
}): Promise<PrayerTimesResponse[]> {
  const data = await api.get<PrayerTimesResponse[]>("/api/prayer-times", params);
  return z.array(PrayerTimesResponseSchema).parse(data);
}

export async function getPrayerTimesByLocation(params: {
  lat: number;
  lon: number;
  date?: string;
  method?: string;
  timezone?: string;
}): Promise<PrayerTimesResponse> {
  const data = await api.get<PrayerTimesResponse>("/api/prayer-times/by-location", params);
  return PrayerTimesResponseSchema.parse(data);
}
