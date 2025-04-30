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
  generator: 'v0.dev',

  // Open Graph (OG) metadata for social media previews
  openGraph: {
    title: "FarmDash - Farm Management Dashboard",
    description: "A comprehensive farm management dashboard with task scheduling and analytics",
    url: "https://farm.muhammedsirajudeen.in/", // Replace with your actual website URL
    siteName: "FarmDash",
    images: [
      {
        url: "https://farm.muhammedsirajudeen.in/preview.jpg", // Replace with the actual image URL
        width: 1200,
        height: 630,
        alt: "FarmDash OG Image", // Add an alt description for accessibility
      },
    ],
    type: "website", // Change this depending on your content type, e.g., "article" for blog posts
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={inter.className}>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_CLIENT_ID!} >
          {children}
        </GoogleOAuthProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
