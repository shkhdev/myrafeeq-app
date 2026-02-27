export type ErrorKind = "network" | "auth" | "validation" | "business" | "server" | "unexpected";

interface RequestContext {
  method?: string | undefined;
  path?: string | undefined;
}

interface AppErrorOptions {
  statusCode?: number | undefined;
  context?: RequestContext | undefined;
  cause?: unknown;
}

export abstract class AppError extends Error {
  abstract readonly kind: ErrorKind;
  abstract readonly userMessageKey: string;
  abstract readonly retryable: boolean;
  readonly statusCode: number | undefined;
  readonly code: string;
  readonly context: RequestContext | undefined;

  constructor(code: string, message: string, options?: AppErrorOptions) {
    super(message, { cause: options?.cause });
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = options?.statusCode;
    this.context = options?.context;
  }
}

export class NetworkError extends AppError {
  readonly kind = "network" as const;
  readonly userMessageKey = "errors.networkError";
  readonly retryable = true;
}

export class AuthError extends AppError {
  readonly kind = "auth" as const;
  readonly userMessageKey = "errors.sessionExpired";
  readonly retryable = false;
}

export class ValidationError extends AppError {
  readonly kind = "validation" as const;
  readonly userMessageKey = "errors.validationError";
  readonly retryable = false;
}

export class BusinessLogicError extends AppError {
  readonly kind = "business" as const;
  readonly userMessageKey = "errors.businessError";
  readonly retryable = false;
}

export class ServerError extends AppError {
  readonly kind = "server" as const;
  readonly userMessageKey = "errors.serverError";
  readonly retryable = true;
}

export class UnexpectedError extends AppError {
  readonly kind = "unexpected" as const;
  readonly userMessageKey = "errors.somethingWentWrong";
  readonly retryable = false;
}

export function classifyHttpError(
  status: number,
  code: string,
  message: string,
  context?: RequestContext | undefined,
): AppError {
  const opts: AppErrorOptions = { statusCode: status, context };

  if (status === 401 || status === 403) {
    return new AuthError(code, message, opts);
  }
  if (status === 400 || status === 422) {
    return new ValidationError(code, message, opts);
  }
  if (status === 429 || status >= 500) {
    return new ServerError(code, message, opts);
  }
  // 404, 409, other 4xx
  return new BusinessLogicError(code, message, opts);
}

export function classifyFetchError(error: unknown, context?: RequestContext | undefined): AppError {
  const opts: AppErrorOptions = { context };
  if (error instanceof DOMException && error.name === "AbortError") {
    return new NetworkError("TIMEOUT", "Request timed out", { ...opts, cause: error });
  }
  if (error instanceof TypeError) {
    return new NetworkError("NETWORK_FAILURE", error.message || "Network request failed", {
      ...opts,
      cause: error,
    });
  }
  return new UnexpectedError(
    "UNEXPECTED",
    error instanceof Error ? error.message : "An unexpected error occurred",
    { ...opts, cause: error },
  );
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}
