import { api } from "@/lib/api-client";
import type {
  OnboardingRequest,
  OnboardingResponse,
  UpdatePreferencesRequest,
  UserPreferencesResponse,
} from "@/types/api";

export function getPreferences(): Promise<UserPreferencesResponse> {
  return api.get<UserPreferencesResponse>("/api/user/preferences");
}

export function updatePreferences(
  data: UpdatePreferencesRequest,
): Promise<UserPreferencesResponse> {
  return api.put<UserPreferencesResponse>("/api/user/preferences", data);
}

export function completeOnboarding(data: OnboardingRequest): Promise<OnboardingResponse> {
  return api.post<OnboardingResponse>("/api/user/onboarding", data);
}
