import type { Locale } from "./i18n";
import { defaultLocale } from "./i18n";

export type Messages = Record<string, unknown>;

const dictionaries: Record<Locale, () => Promise<Messages>> = {
  en: () => import("@/app/messages/en.json").then((module) => module.default),
  fr: () => import("@/app/messages/fr.json").then((module) => module.default),
  ar: () => import("@/app/messages/ar.json").then((module) => module.default),
};

export async function getMessages(locale: Locale = defaultLocale): Promise<Messages> {
  return dictionaries[locale]();
}