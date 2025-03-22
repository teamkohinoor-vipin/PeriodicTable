"use client"
import { ChevronRight, Home } from "lucide-react"
import type { Element } from "@/types/element"

interface BreadcrumbProps {
  view: "table" | "atom" | "category"
  element: Element | null
  category?: { type: "category" | "property"; name: string }
  onBackClick: () => void
  onCategoryClick?: (type: "category" | "property", name: string) => void
}

export function Breadcrumb({ view, element, category, onBackClick, onCategoryClick }: BreadcrumbProps) {
  // Format category for display (capitalize first letter of each word)
  const formatCategoryDisplay = (category: string) => {
    return category
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  return (
    <nav className="breadcrumb-container">
      <button
        onClick={onBackClick}
        className={`flex items-center ${view === "table" ? "breadcrumb-current" : "breadcrumb-item"}`}
        aria-label="Return to periodic table"
      >
        <Home className="h-4 w-4 mr-1" />
        <span>Periodic Table</span>
      </button>

      {view === "category" && category && (
        <>
          <ChevronRight className="breadcrumb-separator" />
          <span className="breadcrumb-current truncate">{formatCategoryDisplay(category.name)}</span>
        </>
      )}

      {view === "atom" && element && (
        <>
          <ChevronRight className="breadcrumb-separator" />
          <button
            className="breadcrumb-item"
            onClick={() => onCategoryClick && onCategoryClick("category", element.category)}
          >
            {formatCategoryDisplay(element.category)}
          </button>

          <ChevronRight className="breadcrumb-separator" />
          <span className="breadcrumb-current truncate">{element.name}</span>
        </>
      )}
    </nav>
  )
}

