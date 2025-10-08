"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { SearchBar } from "@/components/search-bar"
import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

interface HeaderProps {
  onHomeClick?: () => void
}

export function Header({ onHomeClick }: HeaderProps) {
  const [isMobile, setIsMobile] = useState(false)
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    setMounted(true)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  const handleHomeClick = (e: React.MouseEvent) => {
    if (onHomeClick) {
      e.preventDefault()
      onHomeClick()
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4 md:gap-6">
          <a href="/" className="flex items-center cursor-pointer" onClick={handleHomeClick}>
            {/* Atom icon that changes based on theme */}
            {mounted && (
              <Image
                src={theme === "dark" ? "/icons/atom-light.svg" : "/icons/atom-dark.svg"}
                width={28}
                height={28}
                alt="Periodic Table"
                className="mr-2"
              />
            )}
          </a>

          {/* Search bar now positioned on the left - only for desktop */}
          {!isMobile && (
            <div className="max-w-md">
              <SearchBar inHeader={true} />
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile search icon */}
          {isMobile && <SearchBar inHeader={true} />}
          <ModeToggle />
          <Button variant="ghost" size="icon" asChild>
            <Link
              href="https://t.me/KohinoorOfficial1"
              target="_blank"
              rel="noopener noreferrer"
              title="Join Telegram Channel"
            >
              {/* Telegram SVG Logo */}
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.78 5.42-.9 6.8-.06.67-.36.89-.89.56-2.45-1.83-3.57-2.98-5.79-4.78-.54-.45-.92-.68-.89-1.07.03-.38.42-.55.98-.4 3.95 1.46 6.33 2.3 7.65 2.76.36.12.72.06.93-.26.33-.5.25-1.46.22-2.08-.03-.62-.07-1.27-.1-1.91-.03-.67.31-.98.9-.73 1.18.49 3.85 2.72 4.58 3.2.13.08.23.12.26.22.03.1.01.23-.08.34-.56.67-2.22 1.92-2.38 2.03-.33.23-.57.25-.89.08-.67-.36-2.62-1.69-4.06-2.77-.45-.33-.77-.5-1.18-.5-.38 0-1.07.23-1.61.42-.65.23-1.25.36-1.2.76.03.31.45.45 1.32.78 1.71.65 3.7 1.44 4.9 2.1 1.44.79 2.74 1.18 3.82 1.18.8 0 1.28-.35 1.48-1.07.45-1.68 1.68-6.07 2.01-7.94.12-.67.07-1.23-.03-1.7-.1-.47-.35-.78-.88-.78-.31 0-.7.07-1.12.17z"/>
              </svg>
              <span className="sr-only">Telegram</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
