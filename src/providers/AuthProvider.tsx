import * as Sentry from "@sentry/react";
import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { pauseSync } from "@/hooks/usePreferencesSync";
import { validateTelegramAuth } from "@/lib/api/auth";
import { getPreferences } from "@/lib/api/preferences";
import { hydrateFromBackend } from "@/lib/hydrate-preferences";
import { useAuthStore } from "@/stores/auth-store";

type AuthStatus = "loading" | "ready" | "no-initdata" | "error";
type AuthError = { title: string; message: string };

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const errorRef = useRef<AuthError>({
    title: "Connection failed",
    message: "Unable to connect to the server. Please check your connection and try again.",
  });

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
        } catch (prefError) {
          // Preferences fetch failed — pause sync to prevent overwriting backend data with defaults
          pauseSync();
          Sentry.captureException(prefError, { tags: { context: "auth.preferences_hydrate" } });
          // biome-ignore lint/suspicious/noConsole: preferences fetch error
          console.warn("[AuthProvider] Failed to load preferences from backend");
        }
      }

      if (!signal.cancelled) {
        setStatus("ready");
      }
    } catch (error) {
      Sentry.captureException(error, { tags: { context: "auth.authenticate" } });
      // biome-ignore lint/suspicious/noConsole: auth error logging
      console.error("[AuthProvider] Authentication failed:", error);
      if (!signal.cancelled) {
        if (error instanceof Error && "code" in error) {
          errorRef.current = {
            title: "Authentication failed",
            message:
              (error as { code: string }).code === "INVALID_AUTH"
                ? "Telegram authentication was rejected by the server. Please reopen the app from Telegram."
                : error.message,
          };
        } else if (error instanceof TypeError) {
          errorRef.current = {
            title: "Connection failed",
            message: "Unable to connect to the server. Please check your connection and try again.",
          };
        } else {
          errorRef.current = {
            title: "Something went wrong",
            message: error instanceof Error ? error.message : "An unexpected error occurred.",
          };
        }
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
        <p className="text-lg font-semibold text-on-surface">{errorRef.current.title}</p>
        <p className="max-w-[280px] text-sm text-on-surface-muted">{errorRef.current.message}</p>
        <Button
          size="md"
          onClick={() => {
            const signal = { cancelled: false };
            authenticate(signal);
          }}
        >
          Try again
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}
