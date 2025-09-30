import ThemeSwitch from "@/components/ThemeSwitch"
import { AuthProvider } from "@/lib/auth-context"

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <div className="fixed right-10 top-10 z-50">
        <div className="flex space-x-6 bg-white dark:bg-[#030712] p-2 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <ThemeSwitch />
        </div>
      </div>
      <AuthProvider>
        <div className="min-h-screen">
          {children}
        </div>
      </AuthProvider>
    </>
  )
}