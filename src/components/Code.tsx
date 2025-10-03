import { cx } from "@/lib/utils";
import type { BundledLanguage, BundledTheme } from "shiki";
import { codeToHtml } from "shiki";

type Props = {
  code: string;
  lang?: BundledLanguage;
  theme?: BundledTheme;
  filename?: string;
  copy?: boolean;
  className?: string;
};

export default async function Code({
  code,
  lang = "typescript",
  // tokyo-night
  // catppuccin-macchiato
  // min-dark
  // poimandres
  theme = "poimandres",
  className,
}: Props) {
  const html = await codeToHtml(code, {
    lang,
    theme,
  });

  return (
    <div
      className={cx(
        "relative overflow-hidden w-full rounded-xl bg-gray-950 ring-1 ring-black  dark:ring-white/5",
        className,
      )}
    >
      <div
        className="text-sm [&>pre]:overflow-x-auto [&>pre]:!bg-gray-950 [&>pre]:py-6 [&>pre]:pl-4 [&>pre]:pr-5 [&>pre]:leading-snug [&>pre]:dark:!bg-gray-950 [&_code]:block [&_code]:w-fit [&_code]:min-w-full"
        dangerouslySetInnerHTML={{ __html: html }}
      ></div>
    </div>
  );
}
