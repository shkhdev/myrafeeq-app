"use client";

import { useMemo } from "react";
import { getSDK } from "./useTelegramSDK";

export function useCloudStorage() {
  return useMemo(
    () => ({
      async setItem(key: string, value: string): Promise<void> {
        const sdk = await getSDK();
        try {
          if (sdk.setCloudStorageItem.isAvailable()) {
            await sdk.setCloudStorageItem(key, value);
          }
        } catch {
          // Cloud storage not available
        }
      },
      async getItem(key: string): Promise<string | null> {
        const sdk = await getSDK();
        try {
          if (sdk.getCloudStorageItem.isAvailable()) {
            return await sdk.getCloudStorageItem(key);
          }
        } catch {
          // Cloud storage not available
        }
        return null;
      },
    }),
    [],
  );
}
