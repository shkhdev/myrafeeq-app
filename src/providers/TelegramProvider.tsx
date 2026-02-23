"use client";

import { useEffect, useState } from "react";

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

function initThemeAndCssVars(sdk: TelegramSDK) {
  sdk.init();
  sdk.themeParams.mountSync();
  sdk.themeParams.bindCssVars();
  document.documentElement.classList.add("tg-app");
}

async function mountViewport(sdk: TelegramSDK) {
  if (!sdk.viewport.mount.isAvailable()) return;
  await sdk.viewport.mount();
  if (sdk.viewport.expand.isAvailable()) {
    sdk.viewport.expand();
  }
}

async function initTelegram() {
  const sdk = await import("@telegram-apps/sdk-react");
  const isTma = sdk.isTMA();

  if (isTma) {
    initThemeAndCssVars(sdk);
    await mountViewport(sdk);
    if (sdk.miniApp.ready.isAvailable()) {
      sdk.miniApp.ready();
    }
  } else if (process.env.NODE_ENV === "development") {
    sdk.mockTelegramEnv({
      launchParams: {
        tgWebAppThemeParams: MOCK_THEME_PARAMS,
        tgWebAppVersion: "8.0",
        tgWebAppPlatform: "tdesktop",
      },
    });
    initThemeAndCssVars(sdk);
  }
}

export function TelegramProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initTelegram()
      .catch(() => {
        // Not in Telegram — proceed with web defaults
      })
      .finally(() => setReady(true));
  }, []);

  if (!ready) return null;

  return <>{children}</>;
}
