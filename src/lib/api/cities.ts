import { api } from "@/lib/api-client";
import { CitySearchResponseSchema, NearestCityResponseSchema } from "@/lib/api-schemas";
import type { CitySearchResponse, NearestCityResponse } from "@/types/api";

export async function searchCities(
  params: { q: string; limit?: number },
  signal?: AbortSignal,
): Promise<CitySearchResponse> {
  const data = await api.get<CitySearchResponse>("/api/v1/cities", params, signal);
  return CitySearchResponseSchema.parse(data);
}

export async function getNearestCity(
  params: { lat: number; lon: number },
  signal?: AbortSignal,
): Promise<NearestCityResponse> {
  const data = await api.get<NearestCityResponse>("/api/v1/cities/nearest", params, signal);
  return NearestCityResponseSchema.parse(data);
}
