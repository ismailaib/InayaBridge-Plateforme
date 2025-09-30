import type { Locale } from "./i18n";

export type Messages = Record<string, unknown>;

export async function getMessages(locale: Locale, namespace: string): Promise<Messages> {
  try {
    const translations = await import(`@/app/messages/${locale}/${namespace}.json`);
    return translations.default;
  } catch (error) {
    console.error(`Missing translations for ${locale}/${namespace}`, error);
    return {};
  }
}
