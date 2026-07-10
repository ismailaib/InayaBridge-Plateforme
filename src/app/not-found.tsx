"use client";
import { defaultLocale } from "@/lib/i18n/i18n";

import Link from "next/link";

import { siteConfig } from "./siteConfig";
import { Card } from "@/components/Card";
import { useEffect, useState } from "react";

export default function NotFound() {
  // We'll default to light mode (false) to prevent a flash of dark content
  // before the effect runs.
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // This effect runs only on the client, after the component mounts
    try {
      const storedTheme = localStorage.getItem("theme");
      if (storedTheme === "dark" || storedTheme === "system") {
        setIsDark(true);
      }
    } catch (error) {
      console.error("Error reading theme from localStorage:", error);
    }
    // Use an empty dependency array []
    // This tells React to run this effect only ONCE when the component first loads.
  }, []);

  return (
    <div
      // Use the 'isDark' state to conditionally apply the correct background class
      className={`flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center ${
        isDark ? "bg-gray-950" : "bg-white" // <-- Changed from bg-gray-900
      }`}
    >
      <h1
        // Apply conditional classes here too
        className={`text-3xl font-semibold ${
          isDark ? "text-gray-50" : "text-gray-900"
        }`}
      >
        Page not found
      </h1>
      <p
        // And here
        className={`max-w-md text-sm ${
          isDark ? "text-gray-400" : "text-gray-600"
        }`}
      >
        Sorry, we couldn&apos;t find the page you were looking for. Head back to
        the home page to continue browsing {siteConfig.name}.
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