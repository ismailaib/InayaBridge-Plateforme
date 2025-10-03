import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { type Locale, defaultLocale, isLocale, locales } from "./lib/i18n/i18n";

function extractLocaleFromPath(pathname: string): Locale | undefined {
  const segment = pathname.split("/").filter(Boolean)[0];
  return segment && isLocale(segment) ? (segment as Locale) : undefined;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const pathnameIsMissingLocale = locales.every(
    (locale) =>
      !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
  );

  if (pathnameIsMissingLocale) {
    const locale = getPreferredLocale(request);
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}${pathname.startsWith("/") ? "" : "/"}${pathname}`;

    const response = NextResponse.redirect(url);
    response.cookies.set("NEXT_LOCALE", locale, { path: "/" });
    return response;
  }

  const response = NextResponse.next();
  response.headers.set("x-pathname", pathname);

  const localeFromPath = extractLocaleFromPath(pathname);
  if (localeFromPath) {
    response.cookies.set("NEXT_LOCALE", localeFromPath, { path: "/" });
  }

  return response;
}

function getPreferredLocale(request: NextRequest): Locale {
  const localeCookie = request.cookies.get("NEXT_LOCALE")?.value;
  if (localeCookie && isLocale(localeCookie)) {
    return localeCookie as Locale;
  }

  const acceptLanguage = request.headers.get("accept-language");
  if (acceptLanguage) {
    const preferredLocale = acceptLanguage
      .split(",")[0]
      ?.split("-")[0]
      ?.toLowerCase();
    if (preferredLocale && isLocale(preferredLocale)) {
      return preferredLocale as Locale;
    }
  }

  return defaultLocale;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
