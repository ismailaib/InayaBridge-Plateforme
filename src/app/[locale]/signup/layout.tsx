import ThemeSwitch from "@/components/ThemeSwitch"
import { AuthProvider } from "@/lib/auth-context"


export default function SignupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="fixed right-10 top-10">
        <div className="flex space-x-6 bg-white dark:bg-[#030712] p-2 rounded-xl">
          <ThemeSwitch />
        </div>
      </div>
      <AuthProvider>
        {children}
      </AuthProvider>
    </div>
  )
}
