type TelegramSDK = typeof import("@telegram-apps/sdk-react");

let sdkPromise: Promise<TelegramSDK> | null = null;

export function getSDK(): Promise<TelegramSDK> {
  if (!sdkPromise) {
    sdkPromise = import("@telegram-apps/sdk-react");
  }
  return sdkPromise;
}
