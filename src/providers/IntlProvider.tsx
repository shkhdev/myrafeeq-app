"use client";

import { NextIntlClientProvider } from "next-intl";
import { useEffect, useRef, useState } from "react";

import type { SupportedLocale } from "@/i18n/locale";
import { DEFAULT_LOCALE, isRTL } from "@/i18n/locale";
import { useLocaleStore } from "@/stores/locale-store";

type Messages = Record<string, unknown>;

const messageCache = new Map<SupportedLocale, Messages>();

async function loadMessages(locale: SupportedLocale): Promise<Messages> {
  const cached = messageCache.get(locale);
  if (cached) return cached;
  const mod = (await import(`../messages/${locale}.json`)) as {
    default: Messages;
  };
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
    loadMessages(locale).then((msgs) => {
      setMessages(msgs);
      setActiveLocale(locale);
      initialLoad.current = false;
    });
  }, [locale]);

  // Block render only on initial load; keep previous messages during locale switch
  if (!messages && initialLoad.current) return null;
  if (!messages) return null;

  return (
    <NextIntlClientProvider locale={activeLocale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
