import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock sentry module used by api-client
vi.mock("@/lib/sentry", () => ({
  reportError: vi.fn(),
  reportRetrySuccess: vi.fn(),
}));

// Mock the Telegram SDK
vi.mock("@telegram-apps/sdk-react", () => ({
  initDataRaw: vi.fn(() => undefined),
  retrieveRawInitData: vi.fn(() => undefined),
}));

// Mock env
vi.mock("@/env", () => ({
  API_URL: "https://api.test.com",
}));

import { useAuthStore } from "@/stores/auth-store";
import { type AppError, ServerError, ValidationError } from "../errors";
import { api } from "../api-client";

beforeEach(() => {
  useAuthStore.setState({ token: "test-token", telegramId: 123, onboardingCompleted: true });
  vi.restoreAllMocks();
});

afterEach(() => {
  useAuthStore.setState(useAuthStore.getInitialState());
});

describe("api.get", () => {
  it("makes GET request with auth header", async () => {
    const mockResponse = { data: "test" };
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockResponse),
    });

    const result = await api.get<{ data: string }>("/api/test");
    expect(result).toEqual(mockResponse);

    const call = vi.mocked(fetch).mock.calls[0];
    expect(call).toBeDefined();
    const [url, options] = call as [string, RequestInit];
    expect(url).toBe("https://api.test.com/api/test");
    expect((options.headers as Record<string, string>).Authorization).toBe("Bearer test-token");
  });

  it("appends query params", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({}),
    });

    await api.get("/api/test", { q: "hello", limit: 10, empty: undefined });
    const getCall = vi.mocked(fetch).mock.calls[0];
    expect(getCall).toBeDefined();
    const [url] = getCall as [string, RequestInit];
    expect(url).toBe("https://api.test.com/api/test?q=hello&limit=10");
  });
});

describe("api.post", () => {
  it("makes POST request with JSON body", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ success: true }),
    });

    await api.post("/api/test", { key: "value" });
    const postCall = vi.mocked(fetch).mock.calls[0];
    expect(postCall).toBeDefined();
    const [, postOptions] = postCall as [string, RequestInit];
    expect(postOptions.method).toBe("POST");
    expect(postOptions.body).toBe('{"key":"value"}');
    expect((postOptions.headers as Record<string, string>)["Content-Type"]).toBe(
      "application/json",
    );
  });
});

describe("api.put", () => {
  it("makes PUT request", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({}),
    });

    await api.put("/api/test", { updated: true });
    const putCall = vi.mocked(fetch).mock.calls[0];
    expect(putCall).toBeDefined();
    const [, putOptions] = putCall as [string, RequestInit];
    expect(putOptions.method).toBe("PUT");
  });
});

describe("error handling", () => {
  it("throws ValidationError on 400 response with error body", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: () => Promise.resolve({ error: { code: "BAD_REQUEST", message: "Invalid input" } }),
    });

    await expect(api.get("/api/test")).rejects.toThrow(ValidationError);

    try {
      await api.get("/api/test");
    } catch (e) {
      expect(e).toBeInstanceOf(ValidationError);
      expect((e as AppError).code).toBe("BAD_REQUEST");
      expect((e as AppError).statusCode).toBe(400);
      expect((e as AppError).message).toBe("Invalid input");
    }
  });

  it("throws ServerError with defaults when body is not JSON", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.reject(new Error("not json")),
    });

    try {
      await api.get("/api/test");
    } catch (e) {
      expect(e).toBeInstanceOf(ServerError);
      expect((e as AppError).code).toBe("UNKNOWN_ERROR");
      expect((e as AppError).statusCode).toBe(500);
    }
  });
});

describe("204 handling", () => {
  it("returns undefined for 204 response", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 204,
      json: () => Promise.reject(new Error("no body")),
    });

    const result = await api.get("/api/test");
    expect(result).toBeUndefined();
  });
});

describe("unauthenticated requests", () => {
  it("works without auth token", async () => {
    useAuthStore.setState({ token: null, telegramId: null, onboardingCompleted: false });

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ data: "public" }),
    });

    const result = await api.get<{ data: string }>("/api/public");
    expect(result).toEqual({ data: "public" });

    const publicCall = vi.mocked(fetch).mock.calls[0];
    expect(publicCall).toBeDefined();
    const [, publicOptions] = publicCall as [string, RequestInit];
    expect((publicOptions.headers as Record<string, string>).Authorization).toBeUndefined();
  });
});
