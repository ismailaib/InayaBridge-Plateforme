import { cookies } from "next/headers"
import { SidebarProvider } from "@/components/Sidebar"
import { AppSidebar } from "@/components/ui/navigation/AppSidebar"
import Header from "@/components/ui/navigation/Header"
import { AuthProvider } from "@/lib/auth-context"
import AuthGuard from "@/lib/AuthGuard"
import { ThemeProvider } from "next-themes"

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const isSidebarOpen = cookies().get("sidebar:state")?.value === "true"

  return (
    <ThemeProvider attribute="class" disableTransitionOnChange>
      <AuthProvider>
        <AuthGuard>
          <SidebarProvider defaultOpen={isSidebarOpen}>
            <AppSidebar />
            <div className="flex flex-col flex-1">
              <Header />
              <main className="flex-1">{children}</main>
            </div>
          </SidebarProvider>
        </AuthGuard>
      </AuthProvider>
    </ThemeProvider>
  )
}
