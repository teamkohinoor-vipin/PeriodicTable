"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { Telegram } from "lucide-react"
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
              title="View on Telegram"
            >
              <Telegram className="h-5 w-5" />
              <span className="sr-only">Telegram</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}

