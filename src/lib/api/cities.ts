import { api } from "@/lib/api-client";
import { CitySearchResponseSchema, NearestCityResponseSchema } from "@/lib/api-schemas";
import type { CitySearchResponse, NearestCityResponse } from "@/types/api";

export async function searchCities(params: {
  q: string;
  locale?: string;
  limit?: number;
}): Promise<CitySearchResponse> {
  const data = await api.get<CitySearchResponse>("/api/cities/search", params);
  return CitySearchResponseSchema.parse(data);
}

export async function getNearestCity(params: {
  lat: number;
  lon: number;
}): Promise<NearestCityResponse> {
  const data = await api.get<NearestCityResponse>("/api/cities/nearest", params);
  return NearestCityResponseSchema.parse(data);
}
