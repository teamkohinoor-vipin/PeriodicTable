"use client"

import { useState, useEffect } from "react"
import { ChevronUp, ChevronDown, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"

interface CategoryLegendProps {
  onCategoryClick?: (type: "category" | "property", name: string) => void
}

export function CategoryLegend({ onCategoryClick }: CategoryLegendProps) {
  const [isOpen, setIsOpen] = useState(true)
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
      className={`fixed ${isMobile ? "bottom-16 left-0 right-0 mx-4" : "bottom-16 left-4"} z-[100] transition-all duration-300 ease-in-out`}
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
            
            {/* Telegram Button with 3D Animation */}
            <div className="col-span-1 md:col-span-2 mt-2">
              <Button
                asChild
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl animate-bounce"
              >
                <a
                  href="https://t.me/KohinoorOfficial1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.78 5.42-.9 6.8-.06.67-.36.89-.89.56-2.45-1.83-3.57-2.98-5.79-4.78-.54-.45-.92-.68-.89-1.07.03-.38.42-.55.98-.4 3.95 1.46 6.33 2.3 7.65 2.76.36.12.72.06.93-.26.33-.5.25-1.46.22-2.08-.03-.62-.07-1.27-.1-1.91-.03-.67.31-.98.9-.73 1.18.49 3.85 2.72 4.58 3.2.13.08.23.12.26.22.03.1.01.23-.08.34-.56.67-2.22 1.92-2.38 2.03-.33.23-.57.25-.89.08-.67-.36-2.62-1.69-4.06-2.77-.45-.33-.77-.5-1.18-.5-.38 0-1.07.23-1.61.42-.65.23-1.25.36-1.2.76.03.31.45.45 1.32.78 1.71.65 3.7 1.44 4.9 2.1 1.44.79 2.74 1.18 3.82 1.18.8 0 1.28-.35 1.48-1.07.45-1.68 1.68-6.07 2.01-7.94.12-.67.07-1.23-.03-1.7-.1-.47-.35-.78-.88-.78-.31 0-.7.07-1.12.17z"/>
                  </svg>
                  Join My Telegram
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
          }
