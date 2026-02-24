import { useEffect, useRef } from "react";
import { getSDK } from "./useTelegramSDK";

function hideAndUnmount(sdk: Awaited<ReturnType<typeof getSDK>>) {
  try {
    if (sdk.isBackButtonMounted()) {
      sdk.hideBackButton();
      sdk.unmountBackButton();
    }
  } catch {
    // SDK not initialized outside Telegram
  }
}

export function useBackButton(onBack: (() => void) | null) {
  const onBackRef = useRef(onBack);
  onBackRef.current = onBack;

  useEffect(() => {
    let cancelled = false;
    let offClick: (() => void) | undefined;

    getSDK()
      .then((sdk) => {
        if (cancelled) return;

        if (!onBack) {
          hideAndUnmount(sdk);
          return;
        }

        if (sdk.mountBackButton.isAvailable()) sdk.mountBackButton();
        if (sdk.showBackButton.isAvailable()) sdk.showBackButton();
        offClick = sdk.onBackButtonClick(() => onBackRef.current?.());
      })
      .catch(() => {
        // SDK not initialized outside Telegram
      });

    return () => {
      cancelled = true;
      offClick?.();
      getSDK()
        .then(hideAndUnmount)
        .catch(() => {});
    };
  }, [onBack]);
}
