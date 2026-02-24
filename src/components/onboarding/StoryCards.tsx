import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "use-intl";

import { useHaptic } from "@/hooks/useHaptic";
import { getSDK } from "@/hooks/useTelegramSDK";
import { isRTL } from "@/i18n/locale";
import { useLocaleStore } from "@/stores/locale-store";
import { useOnboardingStore } from "@/stores/onboarding-store";
import { MosqueIcon } from "./icons/MosqueIcon";
import { PrayerClockIcon } from "./icons/PrayerClockIcon";
import { QuranBookIcon } from "./icons/QuranBookIcon";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { StoryProgressBar } from "./StoryProgressBar";
import { ThemeSwitcher } from "./ThemeSwitcher";

const TOTAL_CARDS = 3;
const AUTO_ADVANCE_MS = 4000;
const TICK_MS = 50;
const SWIPE_THRESHOLD = 50;
const TAP_THRESHOLD = 15;

interface CardData {
  icon: ReactNode;
  title: string;
  description: string;
  showAvatar: boolean;
}

interface UserInfo {
  firstName: string;
  photoUrl: string | null;
}

export function StoryCards() {
  const t = useTranslations("onboarding.welcome");
  const store = useOnboardingStore();
  const haptic = useHaptic();
  const locale = useLocaleStore((s) => s.locale);
  const rtl = isRTL(locale);

  const [userInfo, setUserInfo] = useState<UserInfo>({ firstName: "", photoUrl: null });
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [cardKey, setCardKey] = useState(0);

  const currentIndex = store.storyCardIndex;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef(Date.now());
  const pausedProgressRef = useRef(0);
  const pointerStartX = useRef(0);
  const pointerStartY = useRef(0);

  // Load Telegram user info
  useEffect(() => {
    getSDK().then((sdk) => {
      try {
        const user = sdk.initDataUser();
        if (user) {
          setUserInfo({
            firstName: user.first_name || "",
            photoUrl: user.photo_url || null,
          });
        }
      } catch {
        // initData unavailable
      }
    });
  }, []);

  // Auto-advance timer (also resets progress on card change)
  useEffect(() => {
    // Reset progress whenever card changes
    setProgress(0);
    pausedProgressRef.current = 0;

    if (isPaused || currentIndex >= TOTAL_CARDS) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    startTimeRef.current = Date.now();

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const p = Math.min(elapsed / AUTO_ADVANCE_MS, 1);
      setProgress(p);

      if (p >= 1) {
        if (timerRef.current) clearInterval(timerRef.current);
        if (currentIndex < TOTAL_CARDS - 1) {
          setProgress(0);
          pausedProgressRef.current = 0;
          store.setStoryCardIndex(currentIndex + 1);
          setCardKey((k) => k + 1);
        }
      }
    }, TICK_MS);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, isPaused, store]);

  const goToCard = useCallback(
    (index: number) => {
      if (index >= 0 && index < TOTAL_CARDS) {
        store.setStoryCardIndex(index);
        setProgress(0);
        pausedProgressRef.current = 0;
        setCardKey((k) => k + 1);
        haptic.impact("light");
      }
    },
    [store, haptic],
  );

  const handleSkip = useCallback(() => {
    store.setStep("location");
  }, [store]);

  const handleGetStarted = useCallback(() => {
    store.setStep("location");
  }, [store]);

  // Pointer events for swipe + tap + pause
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      pointerStartX.current = e.clientX;
      pointerStartY.current = e.clientY;
      setIsPaused(true);
      pausedProgressRef.current = progress;
    },
    [progress],
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      setIsPaused(false);
      const dx = e.clientX - pointerStartX.current;
      const dy = e.clientY - pointerStartY.current;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < TAP_THRESHOLD) {
        // Tap — use left 30% / right 70% zones
        const screenWidth = window.innerWidth;
        const tapX = e.clientX;
        const isLeftZone = rtl ? tapX > screenWidth * 0.7 : tapX < screenWidth * 0.3;

        if (isLeftZone && currentIndex > 0) {
          goToCard(currentIndex - 1);
        } else if (currentIndex < TOTAL_CARDS - 1) {
          goToCard(currentIndex + 1);
        }
      } else if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dy) < Math.abs(dx)) {
        // Horizontal swipe
        const isSwipeForward = rtl ? dx > 0 : dx < 0;
        if (isSwipeForward && currentIndex < TOTAL_CARDS - 1) {
          goToCard(currentIndex + 1);
        } else if (!isSwipeForward && currentIndex > 0) {
          goToCard(currentIndex - 1);
        }
      }
    },
    [currentIndex, goToCard, rtl],
  );

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowRight") {
        const next = rtl ? currentIndex - 1 : currentIndex + 1;
        goToCard(next);
      } else if (e.key === "ArrowLeft") {
        const prev = rtl ? currentIndex + 1 : currentIndex - 1;
        goToCard(prev);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, goToCard, rtl]);

  const cards: CardData[] = [
    {
      icon: <MosqueIcon className="h-28 w-28" />,
      title: t("card1Title"),
      description: t("card1Description"),
      showAvatar: true,
    },
    {
      icon: <PrayerClockIcon className="h-28 w-28" />,
      title: t("card2Title"),
      description: t("card2Description"),
      showAvatar: false,
    },
    {
      icon: <QuranBookIcon className="h-28 w-28" />,
      title: t("card3Title"),
      description: t("card3Description"),
      showAvatar: false,
    },
  ];

  const currentCard = cards[currentIndex];
  const isLastCard = currentIndex === TOTAL_CARDS - 1;

  return (
    <div
      className="relative flex flex-col bg-surface"
      style={{ minHeight: "var(--tg-viewport-stable-height, 100dvh)" }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      {/* Fixed top bar: progress + language + skip */}
      <div
        className="fixed inset-x-0 top-0 z-50"
        style={{ paddingTop: "var(--safe-top, 0px)" }}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <div className="px-4 pt-3">
          <StoryProgressBar
            totalCards={TOTAL_CARDS}
            currentIndex={currentIndex}
            progress={progress}
            duration={AUTO_ADVANCE_MS}
          />
        </div>
        <div className="flex items-center justify-between px-4 pt-2">
          <div className="flex items-center gap-1">
            <LanguageSwitcher />
            <ThemeSwitcher />
          </div>
          {!isLastCard && (
            <button
              type="button"
              onClick={handleSkip}
              className="h-11 rounded-lg px-3 text-sm font-medium text-on-surface-muted transition-colors hover:text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-on-surface/30"
              aria-label={t("skipButton")}
            >
              {t("skipButton")}
            </button>
          )}
        </div>
      </div>

      {/* Card content — vertically centered, single cohesive group */}
      <div
        key={cardKey}
        className="flex flex-1 flex-col items-center justify-center gap-6 px-6 pb-8"
        style={{ paddingTop: "calc(var(--safe-top, 0px) + 5.5rem)" }}
      >
        {/* Avatar (card 0 only) — integrated into the content flow */}
        {currentCard?.showAvatar && (
          <div className="animate-fade-in-up flex flex-col items-center gap-2">
            {userInfo.photoUrl ? (
              // biome-ignore lint/performance/noImgElement: external Telegram avatar URL
              <img src={userInfo.photoUrl} alt="" className="h-14 w-14 rounded-full" />
            ) : userInfo.firstName ? (
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/15">
                <span className="text-xl font-semibold text-primary">
                  {userInfo.firstName.charAt(0)}
                </span>
              </div>
            ) : null}
            <p className="text-sm font-medium text-on-surface/70">
              {t("greeting", { name: userInfo.firstName || "Friend" })}
            </p>
          </div>
        )}

        {/* Icon */}
        <div className="animate-fade-in-up">{currentCard?.icon}</div>

        {/* Title + description — tightly grouped */}
        <div className="flex flex-col items-center gap-3">
          <h2 className="animate-fade-in-up-1 text-center text-xl font-bold tracking-tight text-on-surface">
            {currentCard?.title}
          </h2>
          <p className="animate-fade-in-up-2 mx-auto max-w-[280px] text-center text-sm leading-relaxed text-on-surface-muted">
            {currentCard?.description}
          </p>
        </div>

        {/* CTA for last card */}
        {isLastCard && (
          <button
            type="button"
            onClick={handleGetStarted}
            className="animate-fade-in-up-3 w-full max-w-xs rounded-xl bg-primary py-4 text-base font-semibold text-on-primary transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            {t("getStarted")}
          </button>
        )}

      </div>
    </div>
  );
}
