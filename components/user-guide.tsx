"use client"

import { Info } from "lucide-react"
import { useState, useEffect } from "react"

export function UserGuide() {
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false)

  useEffect(() => {
    // Check if the device is mobile or tablet
    const checkDevice = () => {
      setIsMobileOrTablet(window.innerWidth < 1024)
    }

    // Set initial state
    checkDevice()

    // Add resize listener
    window.addEventListener("resize", checkDevice)

    // Clean up
    return () => window.removeEventListener("resize", checkDevice)
  }, [])

  // Don't render on mobile or tablet
  if (isMobileOrTablet) {
    return null
  }

  return (
    <div className="fixed left-4 bottom-16 bg-card p-3 rounded-lg shadow-lg z-20 text-sm opacity-80 hover:opacity-100 transition-opacity">
      <div className="flex items-center">
        <Info className="h-5 w-5 mr-2 text-primary" />
        <span>
          <strong>Navigation:</strong> Drag mouse to rotate | Scroll to zoom
        </span>
      </div>
    </div>
  )
}

