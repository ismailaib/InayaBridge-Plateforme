import Link from "next/link";
import { defaultLocale } from "@/lib/i18n/i18n";
import { siteConfig } from "./siteConfig";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-50">Page not found</h1>
      <p className="max-w-md text-sm text-gray-600 dark:text-gray-400">
        Sorry, we couldn&apos;t find the page you were looking for. Head back to the home page to continue browsing {siteConfig.name}.
      </p>
      <Link
        href={`/${defaultLocale}`}
        className="rounded-md bg-[#3b82f6] px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-[#2563eb]"
      >
        Go to home
      </Link>
    </div>
  );
}
