"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import type { Element } from "@/types/element"
import { getHazardData } from "@/lib/element-hazards"
import { getElementsByCategory } from "@/lib/category-mapping"

interface CategoryPageProps {
  categoryType: "category" | "property"
  categoryName: string
  onBackClick: () => void
  onElementClick: (element: Element) => void
}

export function CategoryPage({ categoryType, categoryName, onBackClick, onElementClick }: CategoryPageProps) {
  const [elements, setElements] = useState<Element[]>([])
  const [loading, setLoading] = useState(true)
  const [debugInfo, setDebugInfo] = useState<string>("")

  useEffect(() => {
    // Wait for element data to be available
    const checkForElementData = () => {
      if (typeof window !== "undefined" && window.elementsData) {
        const allElements = Object.values(window.elementsData) as Element[]

        // Debug: Log all unique categories to help diagnose the issue
        const uniqueCategories = [...new Set(allElements.map((el) => el.category))]
        console.log("Available categories:", uniqueCategories)
        setDebugInfo(
          `Looking for ${categoryType}: "${categoryName}". Available categories: ${uniqueCategories.join(", ")}`,
        )

        // Filter elements based on category or property
        let filteredElements: Element[] = []

        if (categoryType === "category") {
          // Use the category mapping helper to get elements with the right category
          filteredElements = getElementsByCategory(allElements, categoryName)
          console.log(`Found ${filteredElements.length} elements with category "${categoryName}"`)
        } else if (categoryType === "property") {
          // Filter by property (hazard)
          switch (categoryName.toLowerCase()) {
            case "toxic":
              filteredElements = allElements.filter((element) =>
                [
                  "Be",
                  "As",
                  "Pb",
                  "Hg",
                  "Cd",
                  "Tl",
                  "Os",
                  "Po",
                  "Pu",
                  "F",
                  "Cl",
                  "Br",
                  "I",
                  "Sb",
                  "Te",
                  "Ba",
                  "Cs",
                  "Li",
                  "Na",
                  "K",
                  "Rb",
                  "V",
                  "Cr",
                  "Co",
                  "Ni",
                  "Se",
                  "P",
                  "U",
                ].includes(element.symbol),
              )
              break
            case "radioactive":
              filteredElements = allElements.filter((element) =>
                [
                  "U",
                  "Pu",
                  "Ra",
                  "Th",
                  "Rn",
                  "Po",
                  "Tc",
                  "Sr",
                  "Am",
                  "Cf",
                  "Cm",
                  "Np",
                  "Pa",
                  "Ac",
                  "Pm",
                  "Fr",
                  "At",
                  "Bi",
                  "Es",
                  "Fm",
                  "Md",
                  "No",
                  "Lr",
                ].includes(element.symbol),
              )
              break
            case "flammable":
              filteredElements = allElements.filter((element) =>
                ["H", "Li", "Na", "K", "Rb", "Cs", "P", "Mg", "Al", "Fe", "Ti", "Zr", "Ce"].includes(element.symbol),
              )
              break
            case "corrosive":
              filteredElements = allElements.filter((element) =>
                ["F", "Cl", "Br", "I", "Li", "Na", "K", "Rb", "Cs", "Fr"].includes(element.symbol),
              )
              break
            case "extreme-toxic":
            case "extremely toxic":
              filteredElements = allElements.filter((element) =>
                ["Pb", "Hg", "Cd", "As", "Be", "Tl", "Po", "F"].includes(element.symbol),
              )
              break
            case "carcinogenic":
              filteredElements = allElements.filter((element) =>
                ["Be", "Cd", "Ni", "As", "Cr"].includes(element.symbol),
              )
              break
            case "water-reactive":
            case "reacts with water":
              filteredElements = allElements.filter((element) =>
                ["Li", "Na", "K", "Rb", "Cs", "Fr", "Ca", "Sr", "Ba"].includes(element.symbol),
              )
              break
            case "asphyxiant":
              filteredElements = allElements.filter((element) =>
                ["He", "Ne", "Ar", "Kr", "Xe", "Rn", "N", "H"].includes(element.symbol),
              )
              break
            case "pyrophoric":
              filteredElements = allElements.filter((element) =>
                ["Li", "Na", "K", "Rb", "Cs", "P", "Ce"].includes(element.symbol),
              )
              break
            case "oxidizer":
              filteredElements = allElements.filter((element) => ["O", "F", "Cl", "Br"].includes(element.symbol))
              break
            case "special":
              // Elements with special hazards
              const specialElements = ["H", "C", "P", "F", "Hg", "Pb", "Te", "Rn", "W", "Os", "Bi"]
              filteredElements = allElements.filter((element) => specialElements.includes(element.symbol))
              break
            default:
              filteredElements = []
          }
        }

        // Sort by atomic number
        filteredElements.sort((a, b) => a.number - b.number)

        setElements(filteredElements)
        setLoading(false)
        return true
      }
      return false
    }

    // Try immediately
    if (checkForElementData()) return

    // If not available, set up polling
    const intervalId = setInterval(() => {
      if (checkForElementData()) {
        clearInterval(intervalId)
      }
    }, 1000) // Check every second

    return () => clearInterval(intervalId)
  }, [categoryType, categoryName])

  // Format category name for display
  const formatCategoryName = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  // Get CSS class for element category
  const getCategoryClass = (category: string) => {
    const categoryMap: Record<string, string> = {
      "alkali metal": "alkali-metal",
      "alkaline earth metal": "alkaline-earth",
      "transition metal": "transition-metal",
      "post-transition metal": "post-transition",
      metalloid: "metalloid",
      "diatomic nonmetal": "nonmetal",
      "polyatomic nonmetal": "nonmetal",
      halogen: "halogen",
      "noble gas": "noble-gas",
      lanthanide: "lanthanide",
      actinide: "actinide",
    }

    return categoryMap[category.toLowerCase()] || "unknown"
  }

  return (
    <div className="container mx-auto px-4 py-6 relative z-30">
      <div className="flex items-center mb-6">
        <h1 className="text-2xl font-bold">
          {categoryType === "category" ? "Category: " : "Property: "}
          {formatCategoryName(categoryName)}
        </h1>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          <p className="mb-6 text-muted-foreground">
            {elements.length} elements found in this {categoryType}.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {elements.map((element) => (
              <Card
                key={element.number}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => onElementClick(element)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs text-muted-foreground">{element.number}</div>
                      <div className="text-2xl font-bold">{element.symbol}</div>
                      <div className="text-sm font-medium truncate">{element.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">{element.atomic_mass.toFixed(2)}</div>
                    </div>

                    <div className={`w-4 h-4 rounded-full ${getCategoryClass(element.category)}`}></div>
                  </div>

                  {/* Show hazard icons if any */}
                  {getHazardData(element).length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {getHazardData(element)
                        .slice(0, 3)
                        .map((hazard, index) => (
                          <span key={index} title={hazard.label} className="text-xs">
                            {hazard.emoji}
                          </span>
                        ))}
                      {getHazardData(element).length > 3 && (
                        <span className="text-xs">+{getHazardData(element).length - 3}</span>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {elements.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">No elements found in this {categoryType}.</p>
              {debugInfo && (
                <div className="mt-4 p-4 bg-muted rounded-md text-sm text-left">
                  <p>Debug info:</p>
                  <pre className="whitespace-pre-wrap">{debugInfo}</pre>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}

