import { type ReactNode, useCallback, useEffect, useState } from "react";
import { pauseSync } from "@/hooks/usePreferencesSync";
import { validateTelegramAuth } from "@/lib/api/auth";
import { getPreferences } from "@/lib/api/preferences";
import { hydrateFromBackend } from "@/lib/hydrate-preferences";
import { useAuthStore } from "@/stores/auth-store";

type AuthStatus = "loading" | "ready" | "no-initdata" | "error";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [status, setStatus] = useState<AuthStatus>("loading");

  const authenticate = useCallback(async (signal: { cancelled: boolean }) => {
    setStatus("loading");
    try {
      const sdk = await import("@telegram-apps/sdk-react");

      // Try the signal first (populated by init + restoreInitData),
      // then fall back to reading directly from URL hash / performance entries / localStorage.
      let initData: string | undefined;
      try {
        initData = sdk.initDataRaw();
      } catch {
        // Signal not initialized
      }
      if (!initData) {
        try {
          initData = sdk.retrieveRawInitData();
        } catch {
          // Launch params not available from any source
        }
      }

      if (!initData) {
        if (import.meta.env.DEV) {
          // In development, proceed without auth for testing
          setStatus("ready");
        } else {
          setStatus("no-initdata");
        }
        return;
      }

      const response = await validateTelegramAuth(initData);
      if (signal.cancelled) return;

      useAuthStore
        .getState()
        .setAuth(response.token, response.user.telegramId, response.user.onboardingCompleted);

      // Hydrate preferences from backend if user has completed onboarding
      if (response.user.onboardingCompleted) {
        try {
          const prefs = await getPreferences();
          if (!signal.cancelled) {
            pauseSync();
            hydrateFromBackend(prefs);
          }
        } catch {
          // Preferences fetch failed — pause sync to prevent overwriting backend data with defaults
          pauseSync();
          // biome-ignore lint/suspicious/noConsole: preferences fetch error
          console.warn("[AuthProvider] Failed to load preferences from backend");
        }
      }

      if (!signal.cancelled) {
        setStatus("ready");
      }
    } catch (error) {
      // biome-ignore lint/suspicious/noConsole: auth error logging
      console.error("[AuthProvider] Authentication failed:", error);
      if (!signal.cancelled) {
        setStatus("error");
      }
    }
  }, []);

  useEffect(() => {
    const signal = { cancelled: false };
    authenticate(signal);
    return () => {
      signal.cancelled = true;
    };
  }, [authenticate]);

  if (status === "loading") {
    return null;
  }

  if (status === "no-initdata") {
    return (
      <div className="flex h-dvh flex-col items-center justify-center gap-4 bg-surface px-6 text-center">
        <p className="text-lg font-semibold text-on-surface">Please open this app in Telegram</p>
        <p className="max-w-[280px] text-sm text-on-surface-muted">
          MyRafeeq is a Telegram Mini App and needs to be launched from within Telegram.
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex h-dvh flex-col items-center justify-center gap-4 bg-surface px-6 text-center">
        <p className="text-lg font-semibold text-on-surface">Connection failed</p>
        <p className="max-w-[280px] text-sm text-on-surface-muted">
          Unable to connect to the server. Please check your connection and try again.
        </p>
        <button
          type="button"
          onClick={() => {
            const signal = { cancelled: false };
            authenticate(signal);
          }}
          className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
        >
          Try again
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
