import { useState } from "react";
import { useTranslations } from "use-intl";
import { SunriseIcon } from "@/components/icons/prayer";
import { BackArrow } from "@/components/ui/BackArrow";
import { Button } from "@/components/ui/Button";
import { CheckIcon } from "@/components/ui/CheckIcon";
import { LocationPinIcon } from "@/components/ui/LocationPinIcon";
import { LockIcon } from "@/components/ui/LockIcon";
import { ScreenLayout } from "@/components/ui/ScreenLayout";
import { SpinnerIcon } from "@/components/ui/SpinnerIcon";
import { TopBar } from "@/components/ui/TopBar";
import { usePrayerTimesByLocation } from "@/hooks/api/usePrayerTimes";
import { useHaptic } from "@/hooks/useHaptic";
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
  const haptic = useHaptic();
  const [state, setState] = useState<LocationState>("initial");

  const selectedCity = useOnboardingStore((s) => s.data.city);
  const latitude = useOnboardingStore((s) => s.data.latitude);
  const longitude = useOnboardingStore((s) => s.data.longitude);
  const setCity = useOnboardingStore((s) => s.setCity);
  const setStep = useOnboardingStore((s) => s.setStep);

  async function resolveCoords(lat: number, lon: number) {
    try {
      const result = await getNearestCity({ lat, lon });
      setCity(result.city, lat, lon);
      haptic.notification("success");
      setState("success");
    } catch {
      setState("manual");
    }
  }

  async function handleLocationRequest() {
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
  }

  function handleCitySelect(city: City) {
    setCity(city);
    haptic.notification("success");
    setState("success");
  }

  function handleContinue() {
    setStep("notifications");
  }

  function handleBack() {
    if (state === "manual") {
      setState("initial");
    } else {
      setStep("welcome");
    }
  }

  // ── Manual city search ──
  if (state === "manual") {
    return <LocationSearchView onBack={handleBack} onSelect={handleCitySelect} />;
  }

  // ── Success — city found, show prayer times ──
  if (state === "success" && selectedCity) {
    return (
      <LocationSuccessView
        city={selectedCity}
        latitude={latitude ?? selectedCity.latitude}
        longitude={longitude ?? selectedCity.longitude}
        onBack={handleBack}
        onContinue={handleContinue}
      />
    );
  }

  // ── Initial state — request location ──
  return (
    <LocationInitialView
      state={state}
      onBack={handleBack}
      onRequestLocation={handleLocationRequest}
      onSearchManually={() => setState("manual")}
    />
  );
}

// ── Sub-components ──

interface LocationSearchViewProps {
  onBack: () => void;
  onSelect: (city: City) => void;
}

function LocationSearchView({ onBack, onSelect }: LocationSearchViewProps) {
  const t = useTranslations("onboarding.location");
  return (
    <ScreenLayout>
      <TopBar
        left={<BackArrow onClick={onBack} />}
        center={<StepIndicator current={2} total={4} />}
      />
      <div className="px-6 pt-2">
        <h2 className="animate-fade-in-up text-xl font-bold text-on-surface">{t("title")}</h2>
        <p className="animate-fade-in-up-1 mt-2 text-sm text-on-surface-muted">
          {t("description")}
        </p>
        <div className="animate-fade-in-up-2 mt-6">
          <CitySearch onSelect={onSelect} />
        </div>
      </div>
    </ScreenLayout>
  );
}

interface LocationSuccessViewProps {
  city: City;
  latitude: number;
  longitude: number;
  onBack: () => void;
  onContinue: () => void;
}

function LocationSuccessView({
  city,
  latitude,
  longitude,
  onBack,
  onContinue,
}: LocationSuccessViewProps) {
  const t = useTranslations("onboarding.location");
  const tPrayers = useTranslations("onboarding.notifications");
  const tCommon = useTranslations("common");

  const prayerTimesOptions: { enabled: boolean; timezone?: string; method?: string } = {
    enabled: true,
  };
  if (city.timezone) prayerTimesOptions.timezone = city.timezone;
  if (city.defaultMethod) prayerTimesOptions.method = city.defaultMethod;

  const prayerTimesQuery = usePrayerTimesByLocation(latitude, longitude, prayerTimesOptions);
  const prayerTimes = prayerTimesQuery.data?.times ?? null;

  return (
    <ScreenLayout>
      <TopBar
        left={<BackArrow onClick={onBack} />}
        center={<StepIndicator current={2} total={4} />}
      />

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
              {city.name}, {city.country}
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

        {/* Continue button — pinned to bottom with safe area */}
        <div
          className="mt-auto pt-6"
          style={{ paddingBottom: "calc(var(--safe-bottom, 0px) + 2rem)" }}
        >
          <Button onClick={onContinue} className="animate-fade-in-up-2 w-full">
            {t("continue")}
          </Button>
        </div>
      </div>
    </ScreenLayout>
  );
}

interface LocationInitialViewProps {
  state: LocationState;
  onBack: () => void;
  onRequestLocation: () => void;
  onSearchManually: () => void;
}

function LocationInitialView({
  state,
  onBack,
  onRequestLocation,
  onSearchManually,
}: LocationInitialViewProps) {
  const t = useTranslations("onboarding.location");
  return (
    <ScreenLayout>
      <TopBar
        left={<BackArrow onClick={onBack} />}
        center={<StepIndicator current={2} total={4} />}
      />

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
        <Button onClick={onRequestLocation} disabled={state === "requesting"} className="w-full">
          {state === "requesting" ? (
            <span className="inline-flex items-center gap-2">
              <SpinnerIcon />
              {t("enableLocation")}
            </span>
          ) : (
            t("enableLocation")
          )}
        </Button>
        <Button variant="secondary" onClick={onSearchManually} className="w-full">
          {t("searchCity")}
        </Button>
      </div>
    </ScreenLayout>
  );
}
