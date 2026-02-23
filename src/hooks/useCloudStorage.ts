"use client";

import { useMemo } from "react";
import { getSDK } from "./useTelegramSDK";

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => setTimeout(() => reject(new Error("Timeout")), ms)),
  ]);
}

export function useCloudStorage() {
  return useMemo(
    () => ({
      async setItem(key: string, value: string): Promise<void> {
        const sdk = await getSDK();
        try {
          if (sdk.setCloudStorageItem.isAvailable()) {
            await withTimeout(sdk.setCloudStorageItem(key, value), 3000);
          }
        } catch {
          // Cloud storage not available or timed out
        }
      },
      async getItem(key: string): Promise<string | null> {
        const sdk = await getSDK();
        try {
          if (sdk.getCloudStorageItem.isAvailable()) {
            return await withTimeout(sdk.getCloudStorageItem(key), 3000);
          }
        } catch {
          // Cloud storage not available or timed out
        }
        return null;
      },
    }),
    [],
  );
}
