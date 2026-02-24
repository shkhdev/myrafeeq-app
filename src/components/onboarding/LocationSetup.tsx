import { useCallback, useState } from "react";
import { useTranslations } from "use-intl";
import { SunriseIcon } from "@/components/icons/prayer";
import { BackArrow } from "@/components/ui/BackArrow";
import { CheckIcon } from "@/components/ui/CheckIcon";
import { LocationPinIcon } from "@/components/ui/LocationPinIcon";
import { LockIcon } from "@/components/ui/LockIcon";
import { SpinnerIcon } from "@/components/ui/SpinnerIcon";
import { usePrayerTimesByLocation } from "@/hooks/api/usePrayerTimes";
import { useBackButton } from "@/hooks/useBackButton";
import { useHaptic } from "@/hooks/useHaptic";
import { useIsTelegram } from "@/hooks/useIsTelegram";
import { useMainButton } from "@/hooks/useMainButton";
import { getSDK } from "@/hooks/useTelegramSDK";
import { getNearestCity } from "@/lib/api/cities";
import { getPrayerIcon } from "@/lib/prayer-icons";
import { useOnboardingStore } from "@/stores/onboarding-store";
import type { City } from "@/types/city";
import type { PrayerName } from "@/types/prayer";

import { CitySearch } from "./CitySearch";
import { LocationIcon } from "./icons/LocationIcon";
import { StepIndicator } from "./StepIndicator";

type LocationState = "initial" | "requesting" | "success" | "manual";

const PRAYER_ORDER: PrayerName[] = ["fajr", "dhuhr", "asr", "maghrib", "isha"];

export function LocationSetup() {
  const t = useTranslations("onboarding.location");
  const tPrayers = useTranslations("onboarding.notifications");
  const tCommon = useTranslations("common");
  const store = useOnboardingStore();
  const haptic = useHaptic();
  const isTelegram = useIsTelegram();
  const [state, setState] = useState<LocationState>("initial");

  const selectedCity = store.data.city;

  // Fetch real prayer times from API for the selected city
  const prayerTimesOptions: { enabled: boolean; timezone?: string; method?: string } = {
    enabled: state === "success" && selectedCity !== null,
  };
  if (selectedCity?.timezone) prayerTimesOptions.timezone = selectedCity.timezone;
  if (selectedCity?.defaultMethod) prayerTimesOptions.method = selectedCity.defaultMethod;

  const prayerTimesQuery = usePrayerTimesByLocation(
    store.data.latitude ?? selectedCity?.latitude ?? 0,
    store.data.longitude ?? selectedCity?.longitude ?? 0,
    prayerTimesOptions,
  );
  const prayerTimes = prayerTimesQuery.data?.times ?? null;

  const resolveCoords = useCallback(
    async (lat: number, lon: number) => {
      try {
        const result = await getNearestCity({ lat, lon });
        store.setCity(result.city, lat, lon);
        haptic.notification("success");
        setState("success");
      } catch {
        setState("manual");
      }
    },
    [store, haptic],
  );

  const handleLocationRequest = useCallback(async () => {
    setState("requesting");

    // 1) Try Telegram locationManager first
    try {
      const sdk = await getSDK();
      if (sdk.mountLocationManager.isAvailable()) {
        await sdk.mountLocationManager();
      }
      if (sdk.requestLocation.isAvailable()) {
        const location = await sdk.requestLocation();
        resolveCoords(location.latitude, location.longitude);
        return;
      }
    } catch {
      // Telegram API unavailable or denied — fall through to browser
    }

    // 2) Fallback to browser geolocation (standalone web / dev)
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => resolveCoords(pos.coords.latitude, pos.coords.longitude),
        () => setState("manual"),
        { enableHighAccuracy: false, timeout: 10000 },
      );
    } else {
      setState("manual");
    }
  }, [resolveCoords]);

  const handleCitySelect = useCallback(
    (city: City) => {
      store.setCity(city);
      haptic.notification("success");
      setState("success");
    },
    [store, haptic],
  );

  const handleContinue = useCallback(() => {
    store.setStep("notifications");
  }, [store]);

  const handleBack = useCallback(() => {
    if (state === "manual") {
      setState("initial");
    } else {
      store.setStep("welcome");
    }
  }, [store, state]);

  useBackButton(handleBack);

  useMainButton({
    text: t("continue"),
    isVisible: state === "success",
    onClick: handleContinue,
  });

  // ── Manual city search ──
  if (state === "manual") {
    return (
      <div
        className="flex flex-col bg-surface"
        style={{ minHeight: "var(--tg-viewport-stable-height, 100dvh)" }}
      >
        <div
          className="flex items-center justify-between px-3"
          style={{ paddingTop: "calc(var(--safe-top, 0px) + 0.5rem)" }}
        >
          <BackArrow onClick={handleBack} />
          <StepIndicator current={2} total={4} />
          <div className="w-11" />
        </div>
        <div className="px-6 pt-2">
          <h2 className="animate-fade-in-up text-xl font-bold text-on-surface">{t("title")}</h2>
          <p className="animate-fade-in-up-1 mt-2 text-sm text-on-surface-muted">
            {t("description")}
          </p>
          <div className="animate-fade-in-up-2 mt-6">
            <CitySearch onSelect={handleCitySelect} />
          </div>
        </div>
      </div>
    );
  }

  // ── Success — city found, show prayer times ──
  if (state === "success" && selectedCity) {
    return (
      <div
        className="flex flex-col bg-surface"
        style={{ minHeight: "var(--tg-viewport-stable-height, 100dvh)" }}
      >
        {/* Top bar */}
        <div
          className="flex items-center justify-between px-3"
          style={{ paddingTop: "calc(var(--safe-top, 0px) + 0.5rem)" }}
        >
          <BackArrow onClick={handleBack} />
          <StepIndicator current={2} total={4} />
          <div className="w-11" />
        </div>

        <div className="flex flex-1 flex-col px-6 pt-4">
          {/* Success header */}
          <div className="animate-fade-in-up flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15">
              <CheckIcon size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-on-surface">{t("prayerTimesTitle")}</h2>
              <p className="flex items-center gap-1 text-sm text-on-surface-muted">
                <LocationPinIcon />
                {selectedCity.name}, {selectedCity.country}
              </p>
            </div>
          </div>

          {/* Prayer times card */}
          <div className="animate-fade-in-up-1 mt-5 overflow-hidden rounded-2xl bg-on-surface/5 ring-1 ring-on-surface/10">
            {prayerTimesQuery.isLoading ? (
              <div className="flex items-center justify-center py-8">
                <SpinnerIcon />
              </div>
            ) : prayerTimes ? (
              <div className="divide-y divide-on-surface/5">
                {PRAYER_ORDER.map((prayer, i) => {
                  const Icon = getPrayerIcon(prayer);
                  return (
                    <div key={prayer}>
                      <div className="flex min-h-[48px] items-center justify-between px-4 py-3">
                        <span className="flex items-center gap-3 text-[15px] font-medium text-on-surface">
                          <Icon size={32} />
                          {tPrayers(prayer)}
                        </span>
                        <span className="text-[15px] font-semibold tabular-nums text-on-surface">
                          {prayerTimes[prayer]}
                        </span>
                      </div>
                      {/* Sunrise row — between Fajr and Dhuhr */}
                      {i === 0 && (
                        <div className="flex min-h-[40px] items-center justify-between border-t border-on-surface/5 bg-on-surface/[0.02] px-4 py-2">
                          <span className="flex items-center gap-3 text-xs font-medium text-on-surface-muted/70">
                            <SunriseIcon size={24} />
                            {tCommon("sunrise")}
                          </span>
                          <span className="text-xs tabular-nums text-on-surface-muted/70">
                            {prayerTimes.sunrise}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>

          {/* Continue button — pinned to bottom with safe area (hidden inside Telegram where Main Button is used) */}
          {!isTelegram && (
            <div
              className="mt-auto pt-6"
              style={{ paddingBottom: "calc(var(--safe-bottom, 0px) + 2rem)" }}
            >
              <button
                type="button"
                onClick={handleContinue}
                className="animate-fade-in-up-2 w-full rounded-2xl bg-primary py-4 text-base font-semibold text-on-primary transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              >
                {t("continue")}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Initial state — request location ──
  return (
    <div
      className="flex flex-col bg-surface"
      style={{ minHeight: "var(--tg-viewport-stable-height, 100dvh)" }}
    >
      {/* Top bar: back + step indicator */}
      <div
        className="flex items-center justify-between px-3"
        style={{ paddingTop: "calc(var(--safe-top, 0px) + 0.5rem)" }}
      >
        <BackArrow onClick={handleBack} />
        <StepIndicator current={2} total={4} />
        <div className="w-11" />
      </div>

      {/* Center content */}
      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6">
        <div className="animate-fade-in-up">
          <LocationIcon className="h-28 w-28" />
        </div>

        <div className="flex flex-col items-center gap-3 text-center">
          <h2 className="animate-fade-in-up-1 text-xl font-bold tracking-tight text-on-surface">
            {t("title")}
          </h2>
          <p className="animate-fade-in-up-2 mx-auto max-w-[280px] text-sm leading-relaxed text-on-surface-muted">
            {t("description")}
          </p>
        </div>

        <p className="animate-fade-in-up-2 flex items-center gap-1.5 text-xs text-on-surface-muted">
          <LockIcon />
          {t("privacyNote")}
        </p>
      </div>

      {/* Bottom buttons — pinned to bottom with safe area */}
      <div
        className="animate-fade-in-up-3 flex flex-col gap-3 px-6 pt-4"
        style={{ paddingBottom: "calc(var(--safe-bottom, 0px) + 2rem)" }}
      >
        <button
          type="button"
          onClick={handleLocationRequest}
          disabled={state === "requesting"}
          className="flex h-14 items-center justify-center rounded-2xl bg-primary text-base font-semibold text-on-primary transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:opacity-60"
        >
          {state === "requesting" ? (
            <span className="inline-flex items-center gap-2">
              <SpinnerIcon />
              {t("enableLocation")}
            </span>
          ) : (
            t("enableLocation")
          )}
        </button>
        <button
          type="button"
          onClick={() => setState("manual")}
          className="flex h-14 items-center justify-center rounded-2xl border border-on-surface/20 text-base font-medium text-on-surface/80 transition-colors hover:bg-on-surface/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-on-surface/30"
        >
          {t("searchCity")}
        </button>
      </div>
    </div>
  );
}
