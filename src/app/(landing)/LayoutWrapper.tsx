"use client"

import { usePathname } from "next/navigation"
import { Navigation } from "@/components/ui/Navbar"
import Footer from "@/components/ui/Footer"

const noLayoutRoutes = ["/signup", "/login", "/dashboard"] // Add more here

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
