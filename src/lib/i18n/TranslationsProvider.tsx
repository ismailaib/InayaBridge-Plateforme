"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { Messages } from "./getMessages";
import type { Locale } from "./i18n";
import { defaultLocale } from "./i18n";

type TranslationsContextValue = {
  locale: Locale;
  messages: Messages;
};

const TranslationsContext = createContext<TranslationsContextValue | null>(null);

export function TranslationsProvider({
  children,
  locale,
  messages,
}: {
  children: ReactNode;
  locale: Locale;
  messages: Messages;
}) {
  const value = useMemo(
    () => ({
      locale,
      messages,
    }),
    [locale, messages]
  );

  return <TranslationsContext.Provider value={value}>{children}</TranslationsContext.Provider>;
}

export function useTranslationsContext() {
  const context = useContext(TranslationsContext);

  if (!context) {
    return {
      locale: defaultLocale,
      messages: {},
    } satisfies TranslationsContextValue;
  }

  return context;
}