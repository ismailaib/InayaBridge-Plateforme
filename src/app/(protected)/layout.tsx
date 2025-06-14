import { SidebarProvider } from "@/components/Sidebar"
import { AppSidebar } from "@/components/ui/navigation/AppSidebar"
import { ThemeProvider } from "next-themes"
import { cookies } from "next/headers"
import { siteConfig } from "../siteConfig"
import Header from "@/components/ui/navigation/Header"
import { Metadata } from "next"

export const metadata: Metadata = {
  metadataBase: new URL("https://inaya-bridge.vercel.app/"),
  title: siteConfig.name,
  description: siteConfig.description,
  keywords: ["Dashboard", "Data Visualization", "Software"],
  authors: [
    {
      name: "ismail Ait bouhmad",
      url: "https://ismailaitbouhmad.netlify.app/",
    },
  ],
  creator: "ismail Ait bouhmad",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    creator: "@yourname",
  },
  icons: {
    icon: "/favicon.ico",
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true"

  return (
    <RootLayoutClient defaultOpen={defaultOpen}>
      {children}
    </RootLayoutClient>
  )
}

function RootLayoutClient({
  children,
  defaultOpen,
}: {
  children: React.ReactNode
  defaultOpen: boolean
}) {

  return (
    <div>
      <div className={`bg-white-50 h-full antialiased dark:bg-gray-950`}>
        <ThemeProvider
          defaultTheme="system"
          disableTransitionOnChange
          attribute="class"
        >
          <SidebarProvider defaultOpen={defaultOpen}>
            <AppSidebar />
            <div className="w-full">
              <Header />
              <main>{children}</main>
            </div>
          </SidebarProvider>
        </ThemeProvider>
      </div>
    </div>
  )
}
