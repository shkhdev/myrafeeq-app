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
      let unsub: (() => void) | undefined;
      let cancelled = false;

      (async () => {
        try {
          const sdk = await import("@telegram-apps/sdk-react");
          if (cancelled) return;

          // Apply initial value
          root.classList.toggle("dark", sdk.themeParams.isDark());

          // Subscribe to future theme changes
          unsub = sdk.themeParams.isDark.sub((isDark) => {
            root.classList.toggle("dark", isDark);
          });
        } catch {
          // SDK not available — fall through to preference
        }
      })();

      return () => {
        cancelled = true;
        unsub?.();
      };
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
