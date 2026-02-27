import { toast } from "sonner";
import type { AppError } from "@/lib/errors";
import { isAppError } from "@/lib/errors";
import { getSDK } from "./useTelegramSDK";

function triggerHaptic() {
  getSDK()
    .then((sdk) => {
      if (sdk.hapticFeedback.notificationOccurred.isAvailable()) {
        sdk.hapticFeedback.notificationOccurred("error");
      }
    })
    .catch(() => {});
}

export function showErrorToast(error: unknown, fallbackMessage?: string) {
  if (!isAppError(error)) {
    if (fallbackMessage) {
      toast.error(fallbackMessage, { duration: 4000 });
      triggerHaptic();
    }
    return;
  }

  const appError = error as AppError;

  switch (appError.kind) {
    case "network":
      toast.error("Connection issue. Retrying...", { duration: 3000 });
      break;
    case "server":
      toast.error("Something went wrong on our end. Please try again later.", { duration: 5000 });
      break;
    case "business":
      toast.error(appError.message, { duration: 4000 });
      break;
    case "unexpected":
      toast.error(fallbackMessage ?? "An unexpected error occurred.", { duration: 4000 });
      break;
    case "validation":
    case "auth":
      // Shown inline or via ErrorSheet, not as toast
      return;
  }

  triggerHaptic();
}

export function useErrorToast() {
  return { showErrorToast };
}
