"use client"

import { ReactNode, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "./auth-context"

export default function AuthGuard({ children }: { children: ReactNode }) {
  const { token, loading } = useAuth()
  const router = useRouter()

  /* Redirige vers /login si pas de token une fois le contexte chargé */
  useEffect(() => {
    if (!loading && !token && window.location.pathname !== "/signup") router.replace("/login")
  }, [loading, token, router])

  if (loading || !token) return null          // spinner possible

  return <>{children}</>
}
