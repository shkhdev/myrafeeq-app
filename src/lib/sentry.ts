import * as Sentry from "@sentry/react";
import { type AppError, isAppError } from "./errors";

export function initSentry() {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.DEV ? "development" : "production",
    sendDefaultPii: true,
    integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
    tracesSampleRate: import.meta.env.DEV ? 1.0 : 0.2,
    tracePropagationTargets: ["localhost"],
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    enableLogs: true,
    beforeSend(event, hint) {
      const error = hint.originalException;
      // Suppress AbortError (component unmount)
      if (error instanceof DOMException && error.name === "AbortError") {
        return null;
      }
      // Suppress BusinessLogicError (expected domain errors)
      if (isAppError(error) && error.kind === "business") {
        return null;
      }
      return event;
    },
  });
  window.__SENTRY_LOADED__ = true;
}

export function reportError(error: AppError) {
  const tags = {
    errorKind: error.kind,
    errorCode: error.code,
    ...(error.context?.path ? { requestPath: error.context.path } : {}),
  };

  switch (error.kind) {
    case "server":
      Sentry.captureException(error, { level: "error", tags });
      break;
    case "unexpected":
      Sentry.captureException(error, { level: "fatal", tags });
      break;
    case "auth":
      Sentry.captureException(error, { level: "fatal", tags });
      break;
    case "network":
      Sentry.addBreadcrumb({
        category: "network",
        message: error.message,
        level: "warning",
        data: tags,
      });
      break;
    case "validation":
      Sentry.addBreadcrumb({
        category: "validation",
        message: error.message,
        level: "info",
        data: tags,
      });
      break;
    case "business":
      // Skip entirely
      break;
  }
}

export async function enrichTelegramContext() {
  try {
    const sdk = await import("@telegram-apps/sdk-react");
    const context: Record<string, string | number> = {};

    try {
      const lp = sdk.retrieveRawLaunchParams();
      if (lp) {
        const params = new URLSearchParams(lp);
        const version = params.get("tgWebAppVersion");
        const platform = params.get("tgWebAppPlatform");
        if (version) context.tgVersion = version;
        if (platform) context.tgPlatform = platform;
      }
    } catch {
      // Launch params not available
    }

    try {
      const user = sdk.initDataUser();
      if (user) {
        Sentry.setUser({ id: String(user.id) });
        context.tgUserId = user.id;
        if (user.language_code) context.tgLanguage = user.language_code;
        if (user.is_premium) context.tgIsPremium = 1;
      }
    } catch {
      // User data not available
    }

    if (Object.keys(context).length > 0) {
      Sentry.setContext("telegram", context);
    }
  } catch {
    // SDK not available
  }
}

export function reportRetrySuccess(attempt: number, context?: { path?: string } | undefined) {
  Sentry.addBreadcrumb({
    category: "retry",
    message: `Request succeeded after ${attempt} retries`,
    level: "info",
    ...(context ? { data: context } : {}),
  });
}

export function installGlobalHandlers() {
  window.addEventListener("unhandledrejection", (event) => {
    if (isAppError(event.reason)) {
      reportError(event.reason);
    }
  });
}
