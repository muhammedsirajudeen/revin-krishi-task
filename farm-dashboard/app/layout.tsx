import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Toaster } from "sonner"
import { GoogleOAuthProvider } from "@react-oauth/google";

import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FarmDash - Farm Management Dashboard",
  description: "A comprehensive farm management dashboard with task scheduling and analytics",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_CLIENT_ID!} >
          {children}
        </GoogleOAuthProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
