"use client"

import { usePathname } from "next/navigation"
import { Navigation } from "@/components/ui/Navbar"
import Footer from "@/components/ui/Footer"

const languages = ["en", "fr", "ar"]
const noLayoutRoutes = languages.flatMap(lang => [
  `/${lang}/signup`,
  `/${lang}/login`,
  `/${lang}/dashboard`,
  `/${lang}/chat`,
  `/${lang}/appointment`,
  `/${lang}/mes-patients`,
  `/${lang}/ai`,
  `/${lang}/patient`,
  `/${lang}/visioconference`,
  `/${lang}/patient/visioconference`,
  `/${lang}/invite`
])

export const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()
  const hideLayout = noLayoutRoutes.some((route) =>
    pathname.startsWith(route)
  )

  return (
    <>
      {!hideLayout && <Navigation />}
      {children}
      {!hideLayout && <Footer />}
    </>
  )
}
