"use client"

import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { Element } from "@/types/element"
import { getHazardData } from "@/lib/element-hazards"

interface ElementInfoProps {
  element: Element
  isOpen: boolean
  onToggle: () => void
  onBackClick: () => void
  onCategoryClick?: (type: "category" | "property", name: string) => void
}

export function ElementInfo({ element, isOpen, onToggle, onBackClick, onCategoryClick }: ElementInfoProps) {
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
          </CardContent>
        </Card>
      </div>
    </>
  )
}

