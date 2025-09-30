"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: number
  email: string
  role: "doctor" | "patient" | string
  firstName: string
  lastName: string
  doctor?: { speciality: string }
}

interface AuthContextProps {
  user: User | null
  token: string | null
  login: (payload: { token: string; user: User }) => void
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = ({ token, user }: { token: string; user: User }) => {
    localStorage.setItem("token", token)
    localStorage.setItem("user", JSON.stringify(user))
    setToken(token)
    setUser(user)

    const locale = getLocaleFromPath()
    if (user.role === "doctor") {
      router.push(`/${locale}/dashboard`)
    } else if (user.role === "patient") {
      router.push(`/${locale}/patient/dashboard`)
    } else {
      router.push(`/${locale}`)
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setToken(null)
    setUser(null)

    const locale = getLocaleFromPath()
    router.push(`/${locale}`)
  }

  useEffect(() => {
    if (!loading && !token) {
      const locale = getLocaleFromPath()
      const pathname = window.location.pathname

      if (!pathname.endsWith("/signup")) {
        router.push(`/${locale}/login`)
      }
    }
  }, [token, loading, router])

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

function getLocaleFromPath(): string {
  const parts = window.location.pathname.split("/")
  return parts[1] || "en"
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>")
  return ctx
}
