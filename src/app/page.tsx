import { defaultLocale } from "@/lib/i18n/i18n";

import { redirect } from "next/navigation";

export default function IndexPage() {
  redirect(`/${defaultLocale}`);
}
