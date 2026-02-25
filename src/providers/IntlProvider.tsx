import { useEffect, useRef, useState } from "react";
import { IntlProvider as UseIntlProvider } from "use-intl";

import type { SupportedLocale } from "@/i18n/locale";
import { DEFAULT_LOCALE, isRTL } from "@/i18n/locale";
import { useLocaleStore } from "@/stores/locale-store";

type Messages = Record<string, unknown>;

const messageCache = new Map<SupportedLocale, Messages>();

function extractMessages(mod: Record<string, unknown>): Messages {
  const msgs = (mod.default ?? mod) as Messages;
  if (typeof msgs !== "object" || msgs === null || Object.keys(msgs).length === 0) {
    throw new Error("Loaded messages are empty or invalid");
  }
  return msgs;
}

async function loadMessages(locale: SupportedLocale): Promise<Messages> {
  const cached = messageCache.get(locale);
  if (cached) return cached;

  let mod: Record<string, unknown>;
  switch (locale) {
    case "ar":
      mod = (await import("../messages/ar.json")) as Record<string, unknown>;
      break;
    case "ru":
      mod = (await import("../messages/ru.json")) as Record<string, unknown>;
      break;
    case "uz":
      mod = (await import("../messages/uz.json")) as Record<string, unknown>;
      break;
    default:
      mod = (await import("../messages/en.json")) as Record<string, unknown>;
      break;
  }

  const msgs = extractMessages(mod);
  messageCache.set(locale, msgs);
  return msgs;
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
