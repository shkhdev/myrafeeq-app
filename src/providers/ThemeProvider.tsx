"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/stores/theme-store";

function getSystemDark(): boolean {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const preference = useThemeStore((s) => s.preference);

  useEffect(() => {
    const root = document.documentElement;

    // If inside Telegram, subscribe to Telegram's dark mode signal
    if (root.classList.contains("tg-app")) {
      const bindTelegramTheme = async () => {
        try {
          const sdk = await import("@telegram-apps/sdk-react");
          const isDark = sdk.themeParams.isDark();
          root.classList.toggle("dark", isDark);
        } catch {
          // SDK not available — fall through to preference
        }
      };
      bindTelegramTheme();
      return;
    }

    // Outside Telegram: use user preference or system
    const shouldBeDark = preference === "dark" || (preference === "system" && getSystemDark());
    root.classList.toggle("dark", shouldBeDark);

    if (preference !== "system") return;

    // Listen for system theme changes when preference is "system"
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      root.classList.toggle("dark", e.matches);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [preference]);

  return <>{children}</>;
}
