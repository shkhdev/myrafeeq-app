import { useMemo } from "react";
import { getSDK } from "./useTelegramSDK";

export function useHaptic() {
  return useMemo(
    () => ({
      impact(style: "light" | "medium" | "heavy" = "medium") {
        getSDK()
          .then((sdk) => {
            if (sdk.hapticFeedback.impactOccurred.isAvailable()) {
              sdk.hapticFeedback.impactOccurred(style);
            }
          })
          .catch(() => {});
      },
      notification(type: "success" | "warning" | "error") {
        getSDK()
          .then((sdk) => {
            if (sdk.hapticFeedback.notificationOccurred.isAvailable()) {
              sdk.hapticFeedback.notificationOccurred(type);
            }
          })
          .catch(() => {});
      },
      selectionChanged() {
        getSDK()
          .then((sdk) => {
            if (sdk.hapticFeedback.selectionChanged.isAvailable()) {
              sdk.hapticFeedback.selectionChanged();
            }
          })
          .catch(() => {});
      },
    }),
    [],
  );
}
