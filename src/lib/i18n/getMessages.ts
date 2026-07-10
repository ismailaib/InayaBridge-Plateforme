import type { Locale } from "./i18n"

export type Messages = Record<string, unknown>

export async function getMessages(locale: Locale, namespace: string): Promise<Messages> {
  try {
    const messages = await import(`../../app/messages/${locale}/${namespace}.json`)
    return messages.default as Messages
  } catch (error) {
    console.error(`Missing translations for ${locale}/${namespace}`, error)
    return {}
  }
}
