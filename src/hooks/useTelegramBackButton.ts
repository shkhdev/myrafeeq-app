import { useEffect } from "react";
import { getSDK } from "./useTelegramSDK";

/**
 * Show the Telegram native back button while this component is mounted.
 * Calls `onBack` when the user taps it, and hides the button on unmount.
 */
export function useTelegramBackButton(onBack: () => void) {
  useEffect(() => {
    let unsub: (() => void) | undefined;
    let mounted = true;

    getSDK()
      .then((sdk) => {
        if (!mounted) return;
        try {
          if (sdk.backButton.mount.isAvailable()) sdk.backButton.mount();
          if (sdk.backButton.show.isAvailable()) sdk.backButton.show();
          if (sdk.backButton.onClick.isAvailable()) {
            unsub = sdk.backButton.onClick(onBack);
          }
        } catch {
          // Back button not supported on this platform
        }
      })
      .catch(() => {
        // SDK not available
      });

    return () => {
      mounted = false;
      unsub?.();
      getSDK()
        .then((sdk) => {
          try {
            if (sdk.backButton.hide.isAvailable()) sdk.backButton.hide();
          } catch {
            // Ignore
          }
        })
        .catch(() => {});
    };
  }, [onBack]);
}
