import { useEffect, useRef, useState } from "react";
import { IntlProvider as UseIntlProvider } from "use-intl";

import type { SupportedLocale } from "@/i18n/locale";
import { DEFAULT_LOCALE, isRTL } from "@/i18n/locale";
import { useLocaleStore } from "@/stores/locale-store";

type Messages = Record<string, unknown>;

const messageCache = new Map<SupportedLocale, Messages>();

async function loadMessages(locale: SupportedLocale): Promise<Messages> {
  const cached = messageCache.get(locale);
  if (cached) return cached;

  let mod: { default: Messages };
  switch (locale) {
    case "ar":
      mod = (await import("../messages/ar.json")) as { default: Messages };
      break;
    case "ru":
      mod = (await import("../messages/ru.json")) as { default: Messages };
      break;
    case "uz":
      mod = (await import("../messages/uz.json")) as { default: Messages };
      break;
    default:
      mod = (await import("../messages/en.json")) as { default: Messages };
      break;
  }

  messageCache.set(locale, mod.default);
  return mod.default;
}

function useHtmlLangSync(locale: SupportedLocale) {
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = isRTL(locale) ? "rtl" : "ltr";
  }, [locale]);
}

export function IntlProvider({ children }: { children: React.ReactNode }) {
  const locale = useLocaleStore((s) => s.locale);
  const [messages, setMessages] = useState<Messages | null>(null);
  const [activeLocale, setActiveLocale] = useState<SupportedLocale>(DEFAULT_LOCALE);
  const initialLoad = useRef(true);

  useHtmlLangSync(activeLocale);

  useEffect(() => {
    loadMessages(locale)
      .then((msgs) => {
        setMessages(msgs);
        setActiveLocale(locale);
        initialLoad.current = false;
      })
      .catch(() => {
        // Fallback to English if dynamic import fails
        loadMessages("en")
          .then((msgs) => {
            setMessages(msgs);
            setActiveLocale("en");
            initialLoad.current = false;
          })
          .catch(() => {
            // Last resort — render without i18n
            initialLoad.current = false;
            setMessages({});
          });
      });
  }, [locale]);

  // Block render only on initial load; keep previous messages during locale switch
  if (!messages && initialLoad.current) return null;
  if (!messages) return null;

  return (
    <UseIntlProvider locale={activeLocale} messages={messages}>
      {children}
    </UseIntlProvider>
  );
}
