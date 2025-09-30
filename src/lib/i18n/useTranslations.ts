import { useMemo } from "react"
import type { Messages } from "./getMessages"
import { useTranslationsContext } from "./TranslationsProvider"

type TemplateValues = Record<string, string | number>

// Accessor can return anything (string, array, object…)
type Accessor = (messages: Messages, key: string) => unknown

const getByPath: Accessor = (messages, key) => {
  const segments = key.split(".")
  let current: unknown = messages

  for (const segment of segments) {
    if (
      typeof current !== "object" ||
      current === null ||
      !(segment in current)
    ) {
      return undefined
    }
    current = (current as Record<string, unknown>)[segment]
  }

  return current
}

const formatTemplate = (template: string, values?: TemplateValues) => {
  if (!values) return template

  return template.replace(/\{(\w+)\}/g, (_, placeholder) => {
    const replacement = values[placeholder]
    return replacement !== undefined && replacement !== null
      ? String(replacement)
      : `{${placeholder}}`
  })
}

export function useTranslations(namespace?: string) {
  const { messages } = useTranslationsContext()

  return useMemo(() => {
    const prefix = namespace ? `${namespace}.` : ""

    // Translator: returns string (with interpolation)
    function t(key: string, values?: TemplateValues): string {
      const fullKey = `${prefix}${key}`
      const rawValue = getByPath(messages, fullKey)

      if (typeof rawValue !== "string") return fullKey
      return formatTemplate(rawValue, values)
    }

    // Raw accessor: returns any type (string, array, object…)
    function raw<T = unknown>(key: string): T | undefined {
      const fullKey = `${prefix}${key}`
      const rawValue = getByPath(messages, fullKey)
      return rawValue as T
    }

    return Object.assign(t, { raw })
  }, [messages, namespace])
}

export default useTranslations
