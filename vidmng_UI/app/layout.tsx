import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/header"
import { ClientSidebar } from "@/components/client-sidebar"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "VideoShare - Nền tảng chia sẻ video",
  description: "Nền tảng chia sẻ video hàng đầu với hàng triệu video chất lượng cao",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Header />
          <div className="flex">
            <div className="hidden md:block fixed left-0 top-16 h-[calc(100vh-4rem)] border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <ClientSidebar />
            </div>
            <main className="flex-1 md:ml-64">{children}</main>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
