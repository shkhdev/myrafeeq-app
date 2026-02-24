/**
 * Returns true when the app is running inside Telegram's webview.
 * Detection relies on the `tg-app` class added to <html> by TelegramProvider
 * after a successful `sdk.init()`.
 */
export function useIsTelegram(): boolean {
  return document.documentElement.classList.contains("tg-app");
}
