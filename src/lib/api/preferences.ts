import { api } from "@/lib/api-client";
import { OnboardingResponseSchema, UserPreferencesResponseSchema } from "@/lib/api-schemas";
import {
  adjustmentsToApi,
  enumToApi,
  madhabToApi,
  prayerNotificationsToApi,
  themeToApi,
} from "@/lib/api-transforms";
import type {
  OnboardingRequest,
  OnboardingResponse,
  UpdatePreferencesRequest,
  UserPreferencesResponse,
} from "@/types/api";

export async function getPreferences(signal?: AbortSignal): Promise<UserPreferencesResponse> {
  const data = await api.get<UserPreferencesResponse>(
    "/api/v1/user/preferences",
    undefined,
    signal,
  );
  return UserPreferencesResponseSchema.parse(data) as UserPreferencesResponse;
}

/** Transform internal lowercase values to API UPPERCASE before sending. */
function toApiRequest(data: UpdatePreferencesRequest): Record<string, unknown> {
  const req: Record<string, unknown> = {};
  if (data.cityId !== undefined) req.cityId = data.cityId;
  if (data.calculationMethod !== undefined)
    req.calculationMethod = enumToApi(data.calculationMethod);
  if (data.madhab !== undefined) req.madhab = madhabToApi(data.madhab);
  if (data.highLatitudeRule !== undefined) req.highLatitudeRule = enumToApi(data.highLatitudeRule);
  if (data.hijriCorrection !== undefined) req.hijriCorrection = data.hijriCorrection;
  if (data.timeFormat !== undefined) req.timeFormat = data.timeFormat;
  if (data.theme !== undefined) req.theme = themeToApi(data.theme);
  if (data.notificationsEnabled !== undefined) req.notificationsEnabled = data.notificationsEnabled;
  if (data.reminderTiming !== undefined) req.reminderTiming = data.reminderTiming;
  if (data.prayerNotifications !== undefined)
    req.prayerNotifications = prayerNotificationsToApi(data.prayerNotifications);
  if (data.manualAdjustments !== undefined)
    req.manualAdjustments = adjustmentsToApi(data.manualAdjustments);
  return req;
}

export async function updatePreferences(
  data: UpdatePreferencesRequest,
  signal?: AbortSignal,
): Promise<UserPreferencesResponse> {
  const result = await api.patch<UserPreferencesResponse>(
    "/api/v1/user/preferences",
    toApiRequest(data),
    signal,
  );
  return UserPreferencesResponseSchema.parse(result) as UserPreferencesResponse;
}

export async function completeOnboarding(
  data: OnboardingRequest,
  signal?: AbortSignal,
): Promise<OnboardingResponse> {
  const apiData = {
    ...data,
    prayerNotifications: prayerNotificationsToApi(data.prayerNotifications),
  };
  const result = await api.post<OnboardingResponse>("/api/v1/user/onboarding", apiData, signal);
  return OnboardingResponseSchema.parse(result) as OnboardingResponse;
}
