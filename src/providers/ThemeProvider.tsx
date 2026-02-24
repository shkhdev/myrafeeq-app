import { useEffect } from "react";
import { useThemeStore } from "@/stores/theme-store";

function getSystemDark(): boolean {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const preference = useThemeStore((s) => s.preference);

  useEffect(() => {
    const root = document.documentElement;
    const isTelegram = root.classList.contains("tg-app");

    // Explicit light/dark — applies everywhere (Telegram and standalone)
    if (preference === "light") {
      root.classList.remove("dark");
      return;
    }
    if (preference === "dark") {
      root.classList.add("dark");
      return;
    }

    // "system" preference
    if (isTelegram) {
      // Inside Telegram: follow Telegram's dark mode signal
      let unsub: (() => void) | undefined;
      let cancelled = false;

      (async () => {
        try {
          const sdk = await import("@telegram-apps/sdk-react");
          if (cancelled) return;

          root.classList.toggle("dark", sdk.themeParams.isDark());

          unsub = sdk.themeParams.isDark.sub((isDark) => {
            root.classList.toggle("dark", isDark);
          });
        } catch {
          // SDK not available — use OS media query as fallback
          root.classList.toggle("dark", getSystemDark());
        }
      })();

      return () => {
        cancelled = true;
        unsub?.();
      };
    }

    // Outside Telegram: follow OS preference
    root.classList.toggle("dark", getSystemDark());

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      root.classList.toggle("dark", e.matches);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [preference]);

  return <>{children}</>;
}
