import { api } from "@/lib/api-client";
import { OnboardingResponseSchema, UserPreferencesResponseSchema } from "@/lib/api-schemas";
import type {
  OnboardingRequest,
  OnboardingResponse,
  UpdatePreferencesRequest,
  UserPreferencesResponse,
} from "@/types/api";

export async function getPreferences(): Promise<UserPreferencesResponse> {
  const data = await api.get<UserPreferencesResponse>("/api/user/preferences");
  return UserPreferencesResponseSchema.parse(data) as UserPreferencesResponse;
}

export async function updatePreferences(
  data: UpdatePreferencesRequest,
): Promise<UserPreferencesResponse> {
  const result = await api.put<UserPreferencesResponse>("/api/user/preferences", data);
  return UserPreferencesResponseSchema.parse(result) as UserPreferencesResponse;
}

export async function completeOnboarding(data: OnboardingRequest): Promise<OnboardingResponse> {
  const result = await api.post<OnboardingResponse>("/api/user/onboarding", data);
  return OnboardingResponseSchema.parse(result) as OnboardingResponse;
}
