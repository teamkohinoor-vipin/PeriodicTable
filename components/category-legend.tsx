"use client"

import { useState, useEffect } from "react"
import { ChevronUp, ChevronDown, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"

interface CategoryLegendProps {
  onCategoryClick?: (type: "category" | "property", name: string) => void
}

export function CategoryLegend({ onCategoryClick }: CategoryLegendProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Check if mobile/tablet
    const checkResponsive = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    // Set initial state
    checkResponsive()
    setMounted(true)

    // Add resize listener
    window.addEventListener("resize", checkResponsive)

    // Clean up
    return () => window.removeEventListener("resize", checkResponsive)
  }, [])

  const toggleLegend = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div
      className={`fixed ${isMobile ? "bottom-16 left-0 right-0 mx-4" : "bottom-16 left-4"} ${isMobile ? "z-[100]" : "z-20"} transition-all duration-300 ease-in-out`}
    >
      {/* Toggle button */}
      <Button
        onClick={toggleLegend}
        variant="secondary"
        size="sm"
        className={`flex items-center gap-2 mb-1 shadow-md ${isMobile ? "mx-auto" : ""}`}
      >
        <Layers className="h-4 w-4" />
        <span>Legend</span>
        {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
      </Button>

      {/* Legend card */}
      <div
        className={`bg-card rounded-lg shadow-lg overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-4 overflow-y-auto max-h-[500px]">
          <h3 className="text-lg font-heading font-bold mb-2">Element Categories</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div
              className="flex items-center cursor-pointer hover:bg-muted p-1 rounded"
              onClick={() => onCategoryClick && onCategoryClick("category", "alkali metal")}
            >
              <div className="w-4 h-4 alkali-metal mr-2 rounded-sm"></div>
              <span>Alkali Metals</span>
            </div>
            <div
              className="flex items-center cursor-pointer hover:bg-muted p-1 rounded"
              onClick={() => onCategoryClick && onCategoryClick("category", "alkaline earth metal")}
            >
              <div className="w-4 h-4 alkaline-earth mr-2 rounded-sm"></div>
              <span>Alkaline Earth Metals</span>
            </div>
            <div
              className="flex items-center cursor-pointer hover:bg-muted p-1 rounded"
              onClick={() => onCategoryClick && onCategoryClick("category", "transition metal")}
            >
              <div className="w-4 h-4 transition-metal mr-2 rounded-sm"></div>
              <span>Transition Metals</span>
            </div>
            <div
              className="flex items-center cursor-pointer hover:bg-muted p-1 rounded"
              onClick={() => onCategoryClick && onCategoryClick("category", "post-transition metal")}
            >
              <div className="w-4 h-4 post-transition mr-2 rounded-sm"></div>
              <span>Post-Transition Metals</span>
            </div>
            <div
              className="flex items-center cursor-pointer hover:bg-muted p-1 rounded"
              onClick={() => onCategoryClick && onCategoryClick("category", "metalloid")}
            >
              <div className="w-4 h-4 metalloid mr-2 rounded-sm"></div>
              <span>Metalloids</span>
            </div>
            <div
              className="flex items-center cursor-pointer hover:bg-muted p-1 rounded"
              onClick={() => onCategoryClick && onCategoryClick("category", "nonmetal")}
            >
              <div className="w-4 h-4 nonmetal mr-2 rounded-sm"></div>
              <span>Nonmetals</span>
            </div>
            <div
              className="flex items-center cursor-pointer hover:bg-muted p-1 rounded"
              onClick={() => onCategoryClick && onCategoryClick("category", "halogen")}
            >
              <div className="w-4 h-4 halogen mr-2 rounded-sm"></div>
              <span>Halogens</span>
            </div>
            <div
              className="flex items-center cursor-pointer hover:bg-muted p-1 rounded"
              onClick={() => onCategoryClick && onCategoryClick("category", "noble gas")}
            >
              <div className="w-4 h-4 noble-gas mr-2 rounded-sm"></div>
              <span>Noble Gases</span>
            </div>
            <div
              className="flex items-center cursor-pointer hover:bg-muted p-1 rounded"
              onClick={() => onCategoryClick && onCategoryClick("category", "lanthanide")}
            >
              <div className="w-4 h-4 lanthanide mr-2 rounded-sm"></div>
              <span>Lanthanides</span>
            </div>
            <div
              className="flex items-center cursor-pointer hover:bg-muted p-1 rounded"
              onClick={() => onCategoryClick && onCategoryClick("category", "actinide")}
            >
              <div className="w-4 h-4 actinide mr-2 rounded-sm"></div>
              <span>Actinides</span>
            </div>
          </div>

          <h3 className="text-lg font-heading font-bold mt-4 mb-2">Element Properties</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div
              className="flex items-center cursor-pointer hover:bg-muted p-1 rounded"
              onClick={() => onCategoryClick && onCategoryClick("property", "radioactive")}
            >
              <span className="mr-2">☢️</span>
              <span>Radioactive</span>
            </div>
            <div
              className="flex items-center cursor-pointer hover:bg-muted p-1 rounded"
              onClick={() => onCategoryClick && onCategoryClick("property", "toxic")}
            >
              <span className="mr-2">☠️</span>
              <span>Toxic</span>
            </div>
            <div
              className="flex items-center cursor-pointer hover:bg-muted p-1 rounded"
              onClick={() => onCategoryClick && onCategoryClick("property", "flammable")}
            >
              <span className="mr-2">🔥</span>
              <span>Flammable</span>
            </div>
            <div
              className="flex items-center cursor-pointer hover:bg-muted p-1 rounded"
              onClick={() => onCategoryClick && onCategoryClick("property", "corrosive")}
            >
              <span className="mr-2">🧪</span>
              <span>Corrosive</span>
            </div>
            <div
              className="flex items-center cursor-pointer hover:bg-muted p-1 rounded"
              onClick={() => onCategoryClick && onCategoryClick("property", "water-reactive")}
            >
              <span className="mr-2">💧</span>
              <span>Reacts with Water</span>
            </div>
            <div
              className="flex items-center cursor-pointer hover:bg-muted p-1 rounded"
              onClick={() => onCategoryClick && onCategoryClick("property", "asphyxiant")}
            >
              <span className="mr-2">😮‍💨</span>
              <span>Asphyxiant</span>
            </div>
            <div
              className="flex items-center cursor-pointer hover:bg-muted p-1 rounded"
              onClick={() => onCategoryClick && onCategoryClick("property", "pyrophoric")}
            >
              <span className="mr-2">💥</span>
              <span>Pyrophoric</span>
            </div>
            <div
              className="flex items-center cursor-pointer hover:bg-muted p-1 rounded"
              onClick={() => onCategoryClick && onCategoryClick("property", "oxidizer")}
            >
              <span className="mr-2">⚗️</span>
              <span>Oxidizer</span>
            </div>
            <div
              className="flex items-center cursor-pointer hover:bg-muted p-1 rounded"
              onClick={() => onCategoryClick && onCategoryClick("property", "special")}
            >
              <span className="mr-2">⚠️</span>
              <span>Special Hazards</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

