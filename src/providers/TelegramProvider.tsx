"use client";

import { useEffect, useState } from "react";

import { resolveLocale } from "@/i18n/locale";
import { useLocaleStore } from "@/stores/locale-store";

type TelegramSDK = typeof import("@telegram-apps/sdk-react");

const MOCK_THEME_PARAMS = {
  bg_color: "#ffffff" as const,
  secondary_bg_color: "#f5f5f5" as const,
  text_color: "#1a1a1a" as const,
  hint_color: "#6b7280" as const,
  button_color: "#1a7f50" as const,
  button_text_color: "#ffffff" as const,
  accent_text_color: "#b8860b" as const,
  destructive_text_color: "#ef4444" as const,
  section_separator_color: "#e5e7eb" as const,
  header_bg_color: "#1a7f50" as const,
  section_bg_color: "#ffffff" as const,
  subtitle_text_color: "#6b7280" as const,
  link_color: "#1a7f50" as const,
};

const MOCK_USER = {
  id: 12345,
  first_name: "Test",
  last_name: "User",
  username: "testuser",
  language_code: "en",
  is_premium: false,
};

function buildMockInitData(): string {
  return new URLSearchParams({
    user: JSON.stringify(MOCK_USER),
    auth_date: String(Math.floor(Date.now() / 1000)),
    hash: "mock_hash_for_development",
    signature: "mock_signature_for_development",
  }).toString();
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => setTimeout(() => reject(new Error("Timeout")), ms)),
  ]);
}

async function mountViewport(sdk: TelegramSDK) {
  if (!sdk.viewport.mount.isAvailable()) return;
  await withTimeout(sdk.viewport.mount(), 2000);
  if (sdk.viewport.expand.isAvailable()) {
    sdk.viewport.expand();
  }
}

function mountSwipeBehavior(sdk: TelegramSDK) {
  try {
    if (sdk.mountSwipeBehavior.isAvailable()) {
      sdk.mountSwipeBehavior();
    }
    if (sdk.disableVerticalSwipes.isAvailable()) {
      sdk.disableVerticalSwipes();
    }
  } catch {
    // Swipe behavior not supported
  }
}

function restoreInitDataAndLocale(sdk: TelegramSDK) {
  try {
    sdk.restoreInitData();
  } catch {
    // Init data may not be available
  }

  try {
    const user = sdk.initDataUser();
    if (user?.language_code) {
      const locale = resolveLocale(user.language_code);
      useLocaleStore.getState().setLocale(locale);
    }
  } catch {
    // User data may not be available
  }
}

async function initTelegram() {
  const sdk = await import("@telegram-apps/sdk-react");
  const isDev = process.env.NODE_ENV === "development";

  // In development, set up mock environment with user data
  if (isDev) {
    try {
      sdk.mockTelegramEnv({
        launchParams: {
          tgWebAppThemeParams: MOCK_THEME_PARAMS,
          tgWebAppData: buildMockInitData(),
          tgWebAppVersion: "8.0",
          tgWebAppPlatform: "tdesktop",
        },
      });
    } catch {
      // Mock env may already be set from previous page load
    }
  }

  // Initialize SDK — skip in dev because sdk.init() interferes with React rendering
  if (!isDev) {
    sdk.init();
    try {
      sdk.themeParams.mountSync();
      sdk.themeParams.bindCssVars();
      document.documentElement.classList.add("tg-app");
    } catch {
      // Theme params not available
    }
  }

  // Restore init data (critical for user info — must always run)
  restoreInitDataAndLocale(sdk);

  // Viewport + swipe + ready signal (only in real Telegram)
  if (!isDev) {
    try {
      await mountViewport(sdk);
      mountSwipeBehavior(sdk);
      if (sdk.miniApp.ready.isAvailable()) {
        sdk.miniApp.ready();
      }
    } catch {
      // Viewport/swipe not available
    }
  }
}

export function TelegramProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    withTimeout(initTelegram(), 5000)
      .catch(() => {
        // Not in Telegram or init timed out — proceed with web defaults
      })
      .finally(() => setReady(true));
  }, []);

  if (!ready) return null;

  return <>{children}</>;
}
