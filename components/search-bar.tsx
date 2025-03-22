"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Search, X, Filter, Tag } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { Element } from "@/types/element"

interface SearchBarProps {
  inHeader?: boolean
  onCategoryClick?: (type: "category" | "property", name: string) => void
}

export function SearchBar({ inHeader = false, onCategoryClick }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<Element[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [elementData, setElementData] = useState<Record<number, Element>>({})
  const [isDataLoaded, setIsDataLoaded] = useState(false)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [categoryMatches, setCategoryMatches] = useState<{ type: string; name: string }[]>([])
  const [propertyMatches, setPropertyMatches] = useState<{ type: string; name: string }[]>([])
  const searchContainerRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  // Poll for element data until it's available
  useEffect(() => {
    const checkForElementData = () => {
      if (typeof window !== "undefined" && window.elementsData) {
        const data: Record<number, Element> = {}
        Object.values(window.elementsData).forEach((element: any) => {
          data[element.number] = element
        })
        setElementData(data)
        setIsDataLoaded(true)
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
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener("click", handleClickOutside)
    return () => {
      document.removeEventListener("click", handleClickOutside)
    }
  }, [])

  // Focus input when lightbox opens
  useEffect(() => {
    if (isLightboxOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 100)
    }
  }, [isLightboxOpen])

  // Handle body scroll when lightbox is open
  useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [isLightboxOpen])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)

    if (!isDataLoaded) {
      console.log("Element data not loaded yet")
      return
    }

    if (value.trim() === "") {
      setSearchResults([])
      setCategoryMatches([])
      setPropertyMatches([])
      setShowDropdown(false)
      return
    }

    console.log("Searching for:", value)

    // Check if searching for a hazard property
    const hazardTerms: Record<string, string[]> = {
      toxic: [
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
      ],
      "extremely toxic": ["Pb", "Hg", "Cd", "As", "Be", "Tl", "Po", "F"],
      carcinogenic: ["Be", "Cd", "Ni", "As", "Cr"],
      corrosive: ["F", "Cl", "Br", "I", "Li", "Na", "K", "Rb", "Cs", "Fr"],
      flammable: ["H", "Li", "Na", "K", "Rb", "Cs", "P", "Mg", "Al", "Fe", "Ti", "Zr", "Ce"],
      "water-reactive": ["Li", "Na", "K", "Rb", "Cs", "Fr", "Ca", "Sr", "Ba"],
      asphyxiant: ["He", "Ne", "Ar", "Kr", "Xe", "Rn", "N", "H"],
      pyrophoric: ["Li", "Na", "K", "Rb", "Cs", "P", "Ce"],
      oxidizer: ["O", "F", "Cl", "Br"],
      radioactive: [
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
      ],
    }

    // Categories mapping with alternative search terms
    const categoryTerms: Record<string, string[]> = {
      "alkali metal": ["alkali", "alkali metal", "alkali metals", "group 1"],
      "alkaline earth metal": [
        "alkaline",
        "earth",
        "alkaline earth",
        "alkaline earth metal",
        "alkaline earth metals",
        "group 2",
      ],
      "transition metal": ["transition", "transition metal", "transition metals", "d-block"],
      "post-transition metal": [
        "post-transition",
        "post transition",
        "post-transition metal",
        "post-transition metals",
        "poor metal",
      ],
      metalloid: ["metalloid", "metalloids", "semi-metal", "semi metal", "semimetal"],
      nonmetal: ["nonmetal", "nonmetals", "non-metal", "non metal"],
      halogen: ["halogen", "halogens", "group 17"],
      "noble gas": ["noble", "noble gas", "noble gases", "inert gas", "group 18"],
      lanthanide: ["lanthanide", "lanthanides", "rare earth", "rare-earth"],
      actinide: ["actinide", "actinides", "actinoid"],
    }

    let results: Element[] = []
    const lowerValue = value.toLowerCase()

    // Track matching categories and properties for suggestions
    const matchingCategories: { type: string; name: string }[] = []
    const matchingProperties: { type: string; name: string }[] = []

    // Check if search term matches a hazard property
    for (const [hazardType, symbols] of Object.entries(hazardTerms)) {
      if (hazardType.toLowerCase().includes(lowerValue)) {
        console.log(`Found hazard match: ${hazardType}`)
        // Add to property matches
        matchingProperties.push({ type: "property", name: hazardType })

        // Get all elements with this hazard property
        const hazardElements = symbols
          .map((symbol) => Object.values(elementData).find((el) => el.symbol === symbol))
          .filter(Boolean) as Element[]

        results = [...results, ...hazardElements]
      }
    }

    // Check if search term matches a category
    for (const [category, searchTerms] of Object.entries(categoryTerms)) {
      if (
        searchTerms.some((term) => term.toLowerCase().includes(lowerValue) || lowerValue.includes(term.toLowerCase()))
      ) {
        console.log(`Found category match: ${category}`)
        // Add to category matches
        matchingCategories.push({ type: "category", name: category })

        // Get all elements in this category
        const categoryElements = Object.values(elementData).filter(
          (element) => element.category && element.category.toLowerCase() === category.toLowerCase(),
        )

        results = [...results, ...categoryElements]
      }
    }

    // Also include regular search by name, symbol, atomic number
    const nameSymbolResults = Object.values(elementData).filter(
      (element) =>
        element.name.toLowerCase().includes(lowerValue) ||
        element.symbol.toLowerCase().includes(lowerValue) ||
        element.number.toString().includes(value),
    )

    // Combine results and remove duplicates
    results = [...results, ...nameSymbolResults]
    const uniqueResults = Array.from(new Set(results.map((el) => el.number))).map((number) =>
      results.find((el) => el.number === number),
    ) as Element[]

    // Sort results by atomic number
    uniqueResults.sort((a, b) => a.number - b.number)

    // Limit to reasonable number of results
    const limitedResults = uniqueResults.slice(0, 15)
    console.log(`Found ${limitedResults.length} results`)

    setSearchResults(limitedResults)
    setCategoryMatches(matchingCategories)
    setPropertyMatches(matchingProperties)
    setShowDropdown(
      limitedResults.length > 0 ||
        matchingCategories.length > 0 ||
        matchingProperties.length > 0 ||
        searchTerm.length >= 2,
    )
  }

  const handleSearchSelect = (element: Element) => {
    console.log("Selected element:", element)
    // Update view to atom and create atomic model
    document.dispatchEvent(new CustomEvent("elementSelected", { detail: element }))
    setSearchTerm("")
    setShowDropdown(false)
    setIsLightboxOpen(false)
  }

  const handleCategorySelect = (type: string, name: string) => {
    console.log(`Selected ${type}: ${name}`)
    if (onCategoryClick) {
      onCategoryClick(type as "category" | "property", name)
      setSearchTerm("")
      setShowDropdown(false)
      setIsLightboxOpen(false)
    } else {
      // Dispatch a custom event if onCategoryClick is not provided
      document.dispatchEvent(
        new CustomEvent("categorySelected", {
          detail: { type, name },
        }),
      )
      setSearchTerm("")
      setShowDropdown(false)
      setIsLightboxOpen(false)
    }
  }

  // Add category suggestions when user types related terms
  const getCategorySuggestions = () => {
    if (!searchTerm || searchTerm.length < 2) return null

    const lowerTerm = searchTerm.toLowerCase()
    const suggestions = []

    // Category suggestions
    if ("metal".includes(lowerTerm) || lowerTerm.includes("metal")) {
      suggestions.push(
        <div key="cat-metal" className="px-4 py-2 bg-secondary text-secondary-foreground font-semibold">
          Categories
        </div>,
      )
      suggestions.push(
        <div
          key="alkali"
          className="px-4 py-2 hover:bg-muted cursor-pointer pl-6"
          onClick={() => setSearchTerm("alkali metal")}
        >
          Alkali Metals
        </div>,
      )
      suggestions.push(
        <div
          key="alkaline"
          className="px-4 py-2 hover:bg-muted cursor-pointer pl-6"
          onClick={() => setSearchTerm("alkaline earth metal")}
        >
          Alkaline Earth Metals
        </div>,
      )
      suggestions.push(
        <div
          key="transition"
          className="px-4 py-2 hover:bg-muted cursor-pointer pl-6"
          onClick={() => setSearchTerm("transition metal")}
        >
          Transition Metals
        </div>,
      )
    }

    // Hazard suggestions
    if (
      "hazard".includes(lowerTerm) ||
      lowerTerm.includes("hazard") ||
      "danger".includes(lowerTerm) ||
      lowerTerm.includes("danger")
    ) {
      suggestions.push(
        <div key="haz-header" className="px-4 py-2 bg-secondary text-secondary-foreground font-semibold">
          Hazards
        </div>,
      )
      suggestions.push(
        <div
          key="toxic"
          className="px-4 py-2 hover:bg-muted cursor-pointer pl-6"
          onClick={() => setSearchTerm("toxic")}
        >
          Toxic Elements
        </div>,
      )
      suggestions.push(
        <div
          key="radioactive"
          className="px-4 py-2 hover:bg-muted cursor-pointer pl-6"
          onClick={() => setSearchTerm("radioactive")}
        >
          Radioactive Elements
        </div>,
      )
      suggestions.push(
        <div
          key="flammable"
          className="px-4 py-2 hover:bg-muted cursor-pointer pl-6"
          onClick={() => setSearchTerm("flammable")}
        >
          Flammable Elements
        </div>,
      )
    }

    return suggestions.length > 0 ? suggestions : null
  }

  const renderSearchResults = () => {
    // Show category and property page suggestions first
    const pageLinks = []

    // Category page links
    if (categoryMatches.length > 0) {
      pageLinks.push(
        <div
          key="category-header"
          className="px-4 py-2 bg-secondary text-secondary-foreground font-semibold flex items-center"
        >
          <Filter className="h-4 w-4 mr-2" />
          <span>Categories</span>
        </div>,
      )

      categoryMatches.forEach((match, index) => {
        pageLinks.push(
          <div
            key={`cat-${index}`}
            className="px-4 py-2 hover:bg-muted cursor-pointer flex items-center"
            onClick={() => handleCategorySelect(match.type, match.name)}
          >
            <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: getCategoryColor(match.name) }}></div>
            <span>View all {formatCategoryName(match.name)}</span>
          </div>,
        )
      })
    }

    // Property page links
    if (propertyMatches.length > 0) {
      pageLinks.push(
        <div
          key="property-header"
          className="px-4 py-2 bg-secondary text-secondary-foreground font-semibold flex items-center"
        >
          <Tag className="h-4 w-4 mr-2" />
          <span>Properties</span>
        </div>,
      )

      propertyMatches.forEach((match, index) => {
        pageLinks.push(
          <div
            key={`prop-${index}`}
            className="px-4 py-2 hover:bg-muted cursor-pointer flex items-center"
            onClick={() => handleCategorySelect(match.type, match.name)}
          >
            <span className="mr-2">{getPropertyEmoji(match.name)}</span>
            <span>View all {formatCategoryName(match.name)} elements</span>
          </div>,
        )
      })
    }

    // If we have page links, add a divider before element results
    if (pageLinks.length > 0 && searchResults.length > 0) {
      pageLinks.push(<div key="divider" className="border-t border-border my-2"></div>)
    }

    // Element results
    if (searchResults.length === 0) {
      const suggestions = getCategorySuggestions()
      if (suggestions) {
        return [...pageLinks, ...suggestions]
      }

      if (searchTerm.length >= 2 && pageLinks.length === 0) {
        return (
          <div className="px-4 py-2 text-muted-foreground">
            No elements found. Try searching by element name, symbol, category, or property.
          </div>
        )
      }

      return pageLinks.length > 0 ? pageLinks : null
    }

    // If we have elements, add a header
    if (searchResults.length > 0) {
      pageLinks.push(
        <div key="elements-header" className="px-4 py-2 bg-secondary text-secondary-foreground font-semibold">
          Elements
        </div>,
      )
    }

    const elementResults = searchResults.map((element) => (
      <div
        key={element.number}
        className="px-4 py-2 hover:bg-muted cursor-pointer flex justify-between"
        onClick={() => handleSearchSelect(element)}
      >
        <span>{element.name}</span>
        <span className="text-muted-foreground">
          {element.symbol} ({element.number})
        </span>
      </div>
    ))

    return [...pageLinks, ...elementResults]
  }

  // Helper function to get category color
  const getCategoryColor = (category: string): string => {
    const colorMap: Record<string, string> = {
      "alkali metal": "#ff8a80",
      "alkaline earth metal": "#ff80ab",
      "transition metal": "#ea80fc",
      "post-transition metal": "#b388ff",
      metalloid: "#8c9eff",
      nonmetal: "#82b1ff",
      halogen: "#80d8ff",
      "noble gas": "#84ffff",
      lanthanide: "#a7ffeb",
      actinide: "#b9f6ca",
    }

    return colorMap[category.toLowerCase()] || "#e6ee9c"
  }

  // Helper function to get property emoji
  const getPropertyEmoji = (property: string): string => {
    const emojiMap: Record<string, string> = {
      radioactive: "☢️",
      toxic: "☠️",
      "extremely toxic": "⚠️",
      carcinogenic: "🧬",
      corrosive: "🧪",
      flammable: "🔥",
      "water-reactive": "💧",
      asphyxiant: "😮‍💨",
      pyrophoric: "💥",
      oxidizer: "⚗️",
      special: "⚠️",
    }

    return emojiMap[property.toLowerCase()] || "🔍"
  }

  // Helper function to format category name
  const formatCategoryName = (name: string): string => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  // Mobile search trigger in header
  if (inHeader && isMobile) {
    return (
      <>
        <Button variant="ghost" size="icon" onClick={() => setIsLightboxOpen(true)} aria-label="Search">
          <Search className="h-5 w-5" />
        </Button>

        {/* Lightbox search overlay */}
        {isLightboxOpen && (
          <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-[100] p-4 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">Search Elements</h2>
              <Button variant="ghost" size="icon" onClick={() => setIsLightboxOpen(false)} aria-label="Close search">
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div ref={searchContainerRef} className="relative w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search elements, categories, or properties..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="pl-10 pr-4 py-2 rounded-lg w-full"
                  autoFocus
                />
              </div>

              {showDropdown && (
                <div className="mt-2 bg-card rounded-lg shadow-lg max-h-[calc(100vh-150px)] overflow-y-auto">
                  {renderSearchResults()}
                </div>
              )}
            </div>
          </div>
        )}
      </>
    )
  }

  // Desktop header search
  if (inHeader) {
    return (
      <div ref={searchContainerRef} className="relative w-full">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search elements, categories, or properties..."
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={() =>
              setShowDropdown(
                searchResults.length > 0 ||
                  categoryMatches.length > 0 ||
                  propertyMatches.length > 0 ||
                  searchTerm.length >= 2,
              )
            }
            className="pl-10 pr-4 py-2 rounded-full w-64 md:w-80"
          />
        </div>

        {showDropdown && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-card rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
            {renderSearchResults()}
          </div>
        )}
      </div>
    )
  }

  // Only show in main content on mobile if not in header
  return (
    <div className="md:hidden relative w-full max-w-md mx-auto mb-6" ref={searchContainerRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search elements, categories, or properties..."
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={() =>
            setShowDropdown(
              searchResults.length > 0 ||
                categoryMatches.length > 0 ||
                propertyMatches.length > 0 ||
                searchTerm.length >= 2,
            )
          }
          className="pl-10 pr-4 py-2 rounded-full"
        />
      </div>

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-card rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {renderSearchResults()}
        </div>
      )}
    </div>
  )
}

