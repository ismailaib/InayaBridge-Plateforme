"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

/* -------- types -------- */
interface User {
  id: number
  email: string
  role: "doctor" | "patient" | string
  firstName: string
  lastName: string
  // … ajoute ce dont tu as besoin
  doctor?: { speciality: string }
}

interface AuthContextProps {
  user: User | null
  token: string | null
  login: (payload: { token: string; user: User }) => void
  logout: () => void
  loading: boolean
}

/* -------- contexte -------- */
const AuthContext = createContext<AuthContextProps | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  /* -------- charge depuis localStorage -------- */
  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  /* -------- helpers -------- */
  const login = ({ token, user }: { token: string; user: User }) => {
    localStorage.setItem("token", token)
    localStorage.setItem("user", JSON.stringify(user))
    setToken(token)
    setUser(user)
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setToken(null)
    setUser(null)
    router.push("/")
  }

  /* -------- protège les routes client-side -------- */
  useEffect(() => {
    if (!loading && !token && window.location.pathname !== "/signup") {
      router.push("/login")
    }
  }, [token, loading, router])

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

/* -------- hook pratique -------- */
export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>")
  return ctx
}
