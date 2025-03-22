"use client"

import type React from "react"

import { ChevronLeft, ChevronRight, ExternalLink, X, ZoomIn, ZoomOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { Element } from "@/types/element"
import { getHazardData } from "@/lib/element-hazards"
import { useState, useRef, useEffect } from "react"

interface ElementInfoProps {
  element: Element
  isOpen: boolean
  onToggle: () => void
  onBackClick: () => void
  onCategoryClick?: (type: "category" | "property", name: string) => void
}

export function ElementInfo({ element, isOpen, onToggle, onBackClick, onCategoryClick }: ElementInfoProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const imageRef = useRef<HTMLImageElement>(null)

  // Reset zoom and position when lightbox is closed
  useEffect(() => {
    if (!lightboxOpen) {
      setScale(1)
      setPosition({ x: 0, y: 0 })
    }
  }, [lightboxOpen])

  // Prevent body scrolling when lightbox is open
  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [lightboxOpen])

  const handleImageClick = () => {
    setLightboxOpen(true)
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
  }

  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.5, 4))
  }

  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 0.5, 1))
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    setIsDragging(true)

    if ("touches" in e) {
      // Touch event
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      })
    } else {
      // Mouse event
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      })
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return

    if ("touches" in e) {
      // Touch event
      setPosition({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y,
      })
    } else {
      // Mouse event
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  return (
    <>
      <div className="fixed right-0 top-1/2 transform -translate-y-1/2 z-50">
        <Button
          onClick={onToggle}
          variant="secondary"
          size="icon"
          className="rounded-l-md rounded-r-none h-12 w-8 shadow-md"
        >
          {isOpen ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>

      <div
        className={`fixed top-20 right-4 bottom-20 z-40 transition-all duration-300 ease-in-out ${
          isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        }`}
        style={{
          pointerEvents: isOpen ? "all" : "none",
          width: "400px",
          maxWidth: "calc(100vw - 2rem)",
        }}
      >
        <Card className="h-full overflow-auto">
          <CardContent className="p-6">
            <div className="mb-4">
              <h2 className="text-2xl font-heading font-bold mb-2 break-words">
                <a
                  href={`https://en.wikipedia.org/wiki/${element.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary hover:underline transition-colors flex items-center"
                >
                  {element.name} ({element.symbol})
                  <ExternalLink className="h-4 w-4 ml-1" />
                </a>
              </h2>
              <Button onClick={onBackClick} className="w-full">
                Back to Periodic Table
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div>
                <p>
                  <span className="font-semibold">Atomic Number:</span> {element.number}
                </p>
                <p>
                  <span className="font-semibold">Atomic Mass:</span> {element.atomic_mass}
                </p>
                <p>
                  <span className="font-semibold">Category:</span>{" "}
                  <button
                    className="text-primary hover:underline"
                    onClick={() => onCategoryClick && onCategoryClick("category", element.category)}
                  >
                    {element.category}
                  </button>
                </p>
              </div>
              <div>
                <p>
                  <span className="font-semibold">Electron Config:</span>{" "}
                  {element.electron_configuration_semantic || element.electron_configuration || "N/A"}
                </p>
                <p>
                  <span className="font-semibold">Phase:</span> {element.phase}
                </p>
                <p>
                  <span className="font-semibold">Discovered:</span> {element.discovered_by || "Unknown"}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold">Summary:</h3>
              <p className="text-sm mt-1 overflow-auto max-h-24">{element.summary || "No summary available."}</p>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold">Applications:</h3>
              <ul className="text-sm mt-1 list-disc pl-5 overflow-auto max-h-32">
                {(element.applications || ["No applications data available."]).map((app, i) => (
                  <li key={i}>{app}</li>
                ))}
              </ul>
            </div>

            {/* Hazard symbols */}
            <div className="mt-4">
              <h3 className="font-semibold">Hazards:</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {getHazardData(element).length > 0 ? (
                  getHazardData(element).map((hazard, index) => (
                    <button
                      key={index}
                      className="flex items-center bg-muted px-2 py-1 rounded hover:bg-muted"
                      onClick={() => onCategoryClick && onCategoryClick("property", hazard.type)}
                    >
                      <span className="mr-1">{hazard.emoji}</span>
                      <span className="text-sm">{hazard.label}</span>
                    </button>
                  ))
                ) : (
                  <span className="text-sm">No significant hazards</span>
                )}
              </div>
            </div>

            {/* Element image */}
            <div className="mt-4">
              <h3 className="font-semibold">Element Image:</h3>
              <div className="mt-2 flex justify-start">
                {element.image && element.image.url ? (
                  <img
                    ref={imageRef}
                    src={
                      element.image?.url ||
                      `https://raw.githubusercontent.com/Bowserinator/Periodic-Table-JSON/master/images/${element.symbol.toLowerCase() || "/placeholder.svg"}.png`
                    }
                    alt={`Image of ${element.name}`}
                    className="max-h-48 rounded-md shadow-md cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={handleImageClick}
                    onError={(e) => {
                      e.currentTarget.src = `/placeholder.svg?height=150&width=150&text=${element.symbol}`
                      e.currentTarget.alt = `No image available for ${element.name}`
                    }}
                  />
                ) : (
                  <div
                    className="bg-muted rounded-md flex items-center justify-center h-32 w-32 cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={handleImageClick}
                  >
                    <span className="text-3xl font-bold">{element.symbol}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Image Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center" onClick={closeLightbox}>
          <div
            className="relative w-full h-full flex items-center justify-center overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchMove={handleMouseMove}
            onTouchEnd={handleMouseUp}
          >
            <img
              src={
                element.image?.url ||
                `https://raw.githubusercontent.com/Bowserinator/Periodic-Table-JSON/master/images/${element.symbol.toLowerCase() || "/placeholder.svg"}.png`
              }
              alt={`Image of ${element.name}`}
              className="max-w-full max-h-full object-contain transition-transform"
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                cursor: isDragging ? "grabbing" : "grab",
              }}
              onError={(e) => {
                e.currentTarget.src = `/placeholder.svg?height=300&width=300&text=${element.symbol}`
              }}
            />

            {/* Close button */}
            <button
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
              onClick={closeLightbox}
            >
              <X className="h-6 w-6" />
            </button>

            {/* Zoom controls */}
            <div className="absolute bottom-4 right-4 flex gap-2">
              <button
                className="bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                onClick={zoomIn}
              >
                <ZoomIn className="h-6 w-6" />
              </button>
              <button
                className="bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                onClick={zoomOut}
                disabled={scale <= 1}
              >
                <ZoomOut className="h-6 w-6" />
              </button>
            </div>

            {/* Attribution if available */}
            {element.image?.attribution && (
              <div className="absolute bottom-4 left-4 bg-black/50 text-white text-xs p-2 rounded max-w-[80%]">
                {element.image.attribution}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

