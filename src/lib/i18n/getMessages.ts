import { readFile } from "fs/promises";
import path from "path";

import type { Locale } from "./i18n";

export type Messages = Record<string, unknown>;

export async function getMessages(
  locale: Locale,
  namespace: string,
): Promise<Messages> {
  const filePath = path.join(
    process.cwd(),
    "src/app/messages",
    locale,
    `${namespace}.json`,
  );

  try {
    const file = await readFile(filePath, "utf8");
    return JSON.parse(file) as Messages;
  } catch (error) {
    console.error(`Missing translations for ${locale}/${namespace}`, error);
    return {};
  }
}
