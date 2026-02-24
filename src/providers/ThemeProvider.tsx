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

    // Explicit light/dark — bypass Telegram CSS mapping via .theme-override
    if (preference === "light") {
      root.classList.add("theme-override");
      root.classList.remove("dark");
      return () => {
        root.classList.remove("theme-override");
      };
    }
    if (preference === "dark") {
      root.classList.add("theme-override");
      root.classList.add("dark");
      return () => {
        root.classList.remove("theme-override");
      };
    }

    // "system" preference — let Telegram CSS mapping apply
    root.classList.remove("theme-override");

    if (isTelegram) {
      // Follow Telegram's dark mode signal
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
