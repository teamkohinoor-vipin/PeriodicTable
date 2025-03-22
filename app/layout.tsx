import type React from "react"
import type { Metadata } from "next"
import { Inter, Poppins } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
})

export const metadata: Metadata = {
  title: "3D Interactive Periodic Table",
  description:
    "An interactive 3D Periodic Table that allows exploration of elements with detailed information, electron configurations, and a visually engaging Bohr model representation.",
  metadataBase: new URL("https://ptable-drbaph.vercel.app/"),
  openGraph: {
    title: "3D Interactive Periodic Table",
    description:
      "Explore all chemical elements in an interactive 3D environment with detailed properties, electron configurations, and hazard information.",
    url: "https://ptable-drbaph.vercel.app/",
    siteName: "3D Interactive Periodic Table",
    images: [
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/og2.jpg-5EeQ7LnPeYzqkGjJV7H7y3xKbkfv9k.jpeg",
        width: 1200,
        height: 630,
        alt: "Periodic Table of Elements",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "3D Interactive Periodic Table",
    description:
      "Explore all chemical elements in an interactive 3D environment with detailed properties, electron configurations, and hazard information.",
    images: ["https://hebbkx1anhila5yf.public.blob.vercel-storage.com/og2.jpg-5EeQ7LnPeYzqkGjJV7H7y3xKbkfv9k.jpeg"],
  },
  icons: {
    icon: [
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/atom-svgrepo-com%20%283%29-MK2DlKL1twVe7gnbm7BSxsMIzBnxHX.svg",
        type: "image/svg+xml",
      }, // SVG favicon
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/favicon-32x32-j0oqqyAVs7swHgC2efPdGytH2uJNwM.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/favicon-16x16-ehS6Y7f82LvvGhWQYyNqt9iLkSpNOL.png",
        sizes: "16x16",
        type: "image/png",
      },
    ],
    shortcut: [
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/atom-svgrepo-com%20%283%29-MK2DlKL1twVe7gnbm7BSxsMIzBnxHX.svg",
        type: "image/svg+xml",
      }, // SVG shortcut icon
    ],
    apple: [
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/apple-touch-icon-tDTXgV2HwQD5JlK02TawAOQG8ew8xx.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    other: [
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/android-chrome-192x192-vYH4LMqFYUr292s4OTeaZL14EFDbxh.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/android-chrome-512x512-QwquxlOhwgp9A6ebRvYE1ub5wEUAmh.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Additional meta tags that might not be covered by Next.js metadata */}
        <link rel="manifest" href="/favicon/webmanifest.json" />
        <link
          rel="icon"
          href="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/atom-svgrepo-com%20%283%29-MK2DlKL1twVe7gnbm7BSxsMIzBnxHX.svg"
          type="image/svg+xml"
        />
      </head>
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'