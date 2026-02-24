import { useEffect, useRef } from "react";
import { getSDK } from "./useTelegramSDK";

interface MainButtonOptions {
  text: string;
  isVisible: boolean;
  isEnabled?: boolean | undefined;
  hasShineEffect?: boolean | undefined;
  onClick: () => void;
}

function unmountIfMounted(sdk: Awaited<ReturnType<typeof getSDK>>) {
  try {
    if (sdk.isMainButtonMounted()) {
      sdk.unmountMainButton();
    }
  } catch {
    // SDK not initialized outside Telegram
  }
}

function mountAndConfigure(
  sdk: Awaited<ReturnType<typeof getSDK>>,
  params: { text: string; isEnabled: boolean; hasShineEffect: boolean },
) {
  if (sdk.mountMainButton.isAvailable()) sdk.mountMainButton();
  if (sdk.setMainButtonParams.isAvailable()) {
    sdk.setMainButtonParams({ ...params, isVisible: true });
  }
}

export function useMainButton({
  text,
  isVisible,
  isEnabled = true,
  hasShineEffect = false,
  onClick,
}: MainButtonOptions) {
  const onClickRef = useRef(onClick);
  onClickRef.current = onClick;

  useEffect(() => {
    let cancelled = false;
    let offClick: (() => void) | undefined;

    getSDK()
      .then((sdk) => {
        if (cancelled) return;

        if (!isVisible) {
          unmountIfMounted(sdk);
          return;
        }

        mountAndConfigure(sdk, { text, isEnabled, hasShineEffect });
        offClick = sdk.onMainButtonClick(() => onClickRef.current());
      })
      .catch(() => {
        // SDK not initialized outside Telegram
      });

    return () => {
      cancelled = true;
      offClick?.();
      getSDK()
        .then(unmountIfMounted)
        .catch(() => {});
    };
  }, [text, isVisible, isEnabled, hasShineEffect]);
}
