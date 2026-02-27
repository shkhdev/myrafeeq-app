import { API_URL } from "@/env";
import { useAuthStore } from "@/stores/auth-store";
import type { ApiErrorResponse } from "@/types/api";
import { classifyFetchError, classifyHttpError } from "./errors";
import { reportError, reportRetrySuccess } from "./sentry";

/** @deprecated Use AppError subclasses instead. Kept for backward compatibility. */
export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function tryReauth(): Promise<boolean> {
  try {
    const sdk = await import("@telegram-apps/sdk-react");
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
        // Launch params not available
      }
    }
    if (!initData) return false;

    const response = await fetch(`${API_URL}/api/v1/auth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ initData }),
    });
    if (!response.ok) return false;

    const data = (await response.json()) as {
      token: string;
      user: { telegramId: number; onboardingCompleted: boolean };
    };
    useAuthStore
      .getState()
      .setAuth(data.token, data.user.telegramId, data.user.onboardingCompleted);
    return true;
  } catch (error) {
    const appError = classifyFetchError(error, { path: "/api/v1/auth/token" });
    reportError(appError);
    return false;
  }
}

let reauthPromise: Promise<boolean> | null = null;

const REQUEST_TIMEOUT_MS = 15_000;
const MAX_RETRIES = 3;

interface RetryConfig {
  baseDelayMs: number;
  maxDelayMs: number;
}

const NETWORK_RETRY: RetryConfig = { baseDelayMs: 1000, maxDelayMs: 15_000 };
const RATE_LIMIT_RETRY: RetryConfig = { baseDelayMs: 2000, maxDelayMs: 30_000 };

function getRetryDelay(attempt: number, config: RetryConfig): number {
  return Math.min(config.baseDelayMs * 2 ** attempt, config.maxDelayMs);
}

function isRetryableStatus(status: number): boolean {
  return status === 429 || status === 502 || status === 503;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface RequestOptions extends Omit<RequestInit, "signal"> {
  signal?: AbortSignal | undefined;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { signal: callerSignal, ...restOptions } = options;
  const requestContext = {
    method: restOptions.method ?? "GET",
    path,
  };

  let lastError: unknown;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const token = useAuthStore.getState().token;
    const headers: Record<string, string> = {
      ...(import.meta.env.DEV && API_URL.includes("ngrok")
        ? { "ngrok-skip-browser-warning": "1" }
        : {}),
      ...((restOptions.headers as Record<string, string>) ?? {}),
    };

    if (restOptions.body) {
      headers["Content-Type"] ??= "application/json";
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const timeoutController = new AbortController();
    const timeoutId = setTimeout(() => timeoutController.abort(), REQUEST_TIMEOUT_MS);

    // Compose caller signal with internal timeout
    const signals: AbortSignal[] = [timeoutController.signal];
    if (callerSignal) signals.push(callerSignal);
    const composedSignal = AbortSignal.any(signals);

    let response: Response;
    try {
      response = await fetch(`${API_URL}${path}`, {
        ...restOptions,
        headers,
        signal: composedSignal,
      });
    } catch (error) {
      clearTimeout(timeoutId);

      // If caller aborted (e.g. component unmount), rethrow silently — no retry
      if (callerSignal?.aborted) {
        throw error;
      }

      const appError = classifyFetchError(error, requestContext);
      lastError = appError;

      if (appError.retryable && attempt < MAX_RETRIES) {
        await sleep(getRetryDelay(attempt, NETWORK_RETRY));
        continue;
      }
      reportError(appError);
      throw appError;
    } finally {
      clearTimeout(timeoutId);
    }

    // Handle 401 — attempt transparent re-auth, then retry the original request once
    if (response.status === 401 && token) {
      if (!reauthPromise) {
        reauthPromise = tryReauth().finally(() => {
          reauthPromise = null;
        });
      }
      const refreshed = await reauthPromise;
      if (refreshed) {
        const newToken = useAuthStore.getState().token;
        headers.Authorization = `Bearer ${newToken}`;
        const retryResponse = await fetch(`${API_URL}${path}`, {
          ...restOptions,
          headers,
          ...(callerSignal ? { signal: callerSignal } : {}),
        });
        if (!retryResponse.ok) {
          const body = (await retryResponse.json().catch(() => null)) as ApiErrorResponse | null;
          throw classifyHttpError(
            retryResponse.status,
            body?.error?.code ?? "UNKNOWN_ERROR",
            body?.error?.message ?? `Request failed with status ${retryResponse.status}`,
            requestContext,
          );
        }
        if (retryResponse.status === 204) return undefined as T;
        return retryResponse.json() as Promise<T>;
      }
      // Re-auth failed
      useAuthStore.getState().clearAuth();
    }

    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as ApiErrorResponse | null;
      const appError = classifyHttpError(
        response.status,
        body?.error?.code ?? "UNKNOWN_ERROR",
        body?.error?.message ?? `Request failed with status ${response.status}`,
        requestContext,
      );

      lastError = appError;

      if (isRetryableStatus(response.status) && attempt < MAX_RETRIES) {
        const config = response.status === 429 ? RATE_LIMIT_RETRY : NETWORK_RETRY;
        await sleep(getRetryDelay(attempt, config));
        continue;
      }

      reportError(appError);
      throw appError;
    }

    // Success — report if we retried
    if (attempt > 0) {
      reportRetrySuccess(attempt, { path });
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return response.json() as Promise<T>;
  }

  // Exhausted retries
  throw lastError;
}

export const api = {
  get: <T>(
    path: string,
    params?: Record<string, string | number | undefined>,
    signal?: AbortSignal,
  ) => {
    const searchParams = new URLSearchParams();
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined) {
          searchParams.set(key, String(value));
        }
      }
    }
    const query = searchParams.toString();
    return request<T>(query ? `${path}?${query}` : path, { signal });
  },
  post: <T>(path: string, body?: unknown, signal?: AbortSignal) =>
    request<T>(path, {
      method: "POST",
      body: body ? JSON.stringify(body) : null,
      signal,
    }),
  put: <T>(path: string, body?: unknown, signal?: AbortSignal) =>
    request<T>(path, {
      method: "PUT",
      body: body ? JSON.stringify(body) : null,
      signal,
    }),
  patch: <T>(path: string, body?: unknown, signal?: AbortSignal) =>
    request<T>(path, {
      method: "PATCH",
      body: body ? JSON.stringify(body) : null,
      signal,
    }),
};
