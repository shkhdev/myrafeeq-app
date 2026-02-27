import { beforeEach, describe, expect, it } from "vitest";
import { usePreferencesStore } from "@/stores/preferences-store";
import { useThemeStore } from "@/stores/theme-store";
import type { UserPreferencesResponse } from "@/types/api";
import { hydrateFromBackend } from "../hydrate-preferences";

function makePrefsResponse(
  overrides: Partial<UserPreferencesResponse> = {},
): UserPreferencesResponse {
  return {
    city: {
      id: "mecca",
      name: "Mecca",
      country: "Saudi Arabia",
      latitude: 21.42,
      longitude: 39.82,
    },
    calculationMethod: "umm_al_qura",
    madhab: "shafi",
    highLatitudeRule: "angle_based",
    hijriCorrection: 1,
    timeFormat: "24h",
    theme: "dark",
    locale: "en",
    notificationsEnabled: true,
    reminderTiming: "FIVE_MIN",
    prayerNotifications: { fajr: true, dhuhr: false, asr: true, maghrib: true, isha: false },
    manualAdjustments: { fajr: 2, sunrise: 0, dhuhr: -1, asr: 0, maghrib: 3, isha: 0 },
    ...overrides,
  };
}

beforeEach(() => {
  // Reset stores to defaults
  usePreferencesStore.setState(usePreferencesStore.getInitialState());
  useThemeStore.setState(useThemeStore.getInitialState());
});

describe("hydrateFromBackend", () => {
  it("hydrates preferences store with all fields", () => {
    const prefs = makePrefsResponse();
    hydrateFromBackend(prefs);

    const state = usePreferencesStore.getState();
    expect(state.city).toEqual(prefs.city);
    expect(state.latitude).toBe(21.42);
    expect(state.longitude).toBe(39.82);
    expect(state.calculationMethod).toBe("umm_al_qura");
    expect(state.madhab).toBe("shafi");
    expect(state.highLatitudeRule).toBe("angle_based");
    expect(state.hijriCorrection).toBe(1);
    expect(state.timeFormat).toBe("24h");
    expect(state.notificationsEnabled).toBe(true);
    expect(state.reminderTiming).toBe("FIVE_MIN");
    expect(state.prayerNotifications).toEqual({
      fajr: true,
      dhuhr: false,
      asr: true,
      maghrib: true,
      isha: false,
    });
  });

  it("hydrates theme store", () => {
    hydrateFromBackend(makePrefsResponse({ theme: "dark" }));
    expect(useThemeStore.getState().preference).toBe("dark");
  });

  it("hydrates adjustments with defaults for missing keys", () => {
    hydrateFromBackend(
      makePrefsResponse({
        manualAdjustments: { fajr: 5 } as unknown as UserPreferencesResponse["manualAdjustments"],
      }),
    );
    const state = usePreferencesStore.getState();
    expect(state.adjustments.fajr).toBe(5);
    expect(state.adjustments.dhuhr).toBe(0);
    expect(state.adjustments.isha).toBe(0);
  });

  it("handles null city", () => {
    hydrateFromBackend(makePrefsResponse({ city: null }));
    const state = usePreferencesStore.getState();
    expect(state.city).toBeNull();
    expect(state.latitude).toBeNull();
    expect(state.longitude).toBeNull();
  });

  it("preserves existing preferences not included in hydration", () => {
    // Set a preference before hydration
    usePreferencesStore.getState().setCalculationMethod("mwl");

    hydrateFromBackend(makePrefsResponse({ calculationMethod: "egypt" }));
    expect(usePreferencesStore.getState().calculationMethod).toBe("egypt");
  });
});
