"use client"

import { useEffect, useState, useRef } from "react"
import { Breadcrumb } from "@/components/breadcrumb"
import { Header } from "@/components/header"
import { ElementInfo } from "@/components/element-info"
import { CategoryLegend } from "@/components/category-legend"
import { CategoryPage } from "@/components/category-page"
import { LoadingOverlay } from "@/components/loading-overlay"
import { Footer } from "@/components/footer"
import { UserGuide } from "@/components/user-guide"
import { SearchBar } from "@/components/search-bar"
import Scripts from "./scripts"
import { initPeriodicTable, loadElementData, initElementHazards } from "@/lib/periodic-table"
import { createAtomicModel, showPeriodicTable } from "@/lib/atomic-model"
import { fixHalogenElements } from "@/lib/halogen-fix"
import type { Element } from "@/types/element"

export default function Home() {
  const [selectedElement, setSelectedElement] = useState<Element | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadingStatus, setLoadingStatus] = useState("Loading resources...")
  const [view, setView] = useState<"table" | "atom" | "category">("table")
  const [infoPanelOpen, setInfoPanelOpen] = useState(true)
  const [threeJsLoaded, setThreeJsLoaded] = useState(false)
  const [initError, setInitError] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<{ type: "category" | "property"; name: string } | null>(null)
  const isInitialized = useRef(false)

  // Handle Three.js loading
  const handleThreeJsLoaded = () => {
    console.log("Three.js loaded callback received")
    setThreeJsLoaded(true)
    setLoadingStatus("Initializing periodic table...")
  }

  useEffect(() => {
    // Make body non-scrollable
    document.body.style.overflow = "hidden"

    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => {
      // Restore scrolling when component unmounts
      document.body.style.overflow = "auto"
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  useEffect(() => {
    // Only initialize when Three.js is loaded and not already initialized
    if (!threeJsLoaded || isInitialized.current) return

    try {
      console.log("Initializing periodic table...")
      isInitialized.current = true

      // Initialize the periodic table
      initPeriodicTable()

      console.log("Loading element data...")
      setLoadingStatus("Loading element data...")

      // Load element data
      loadElementData()
        .then(() => {
          console.log("Element data loaded successfully")

          // Apply fixes for halogen elements
          fixHalogenElements()

          setLoadingStatus("Ready!")
          setIsLoading(false)

          // Force an initial render
          if (window.renderer && window.scene && window.camera) {
            window.renderer.render(window.scene, window.camera)
          }
        })
        .catch((err) => {
          console.error("Error loading element data:", err)
          setInitError("Failed to load element data. Please refresh the page.")
          setIsLoading(false)
        })

      // Initialize hazard data
      initElementHazards()

      // Listen for element selection events
      const handleElementSelected = (e: CustomEvent) => {
        const element = e.detail
        setSelectedElement(element)
        setView("atom")

        // Small delay to ensure DOM is updated before creating the atomic model
        setTimeout(() => createAtomicModel(element), 100)
      }

      document.addEventListener("elementSelected", handleElementSelected as EventListener)

      // Listen for category selection events from search
      const handleCategorySelected = (e: CustomEvent) => {
        const { type, name } = e.detail
        handleCategoryClick(type, name)
      }

      document.addEventListener("categorySelected", handleCategorySelected as EventListener)

      // Handle window resize
      const handleResize = () => {
        // Close info panel on small screens
        if (window.innerWidth < 768) {
          setInfoPanelOpen(false)
        } else {
          setInfoPanelOpen(true)
        }

        // Update renderer size if available
        if (window.renderer && window.camera) {
          window.renderer.setSize(window.innerWidth, window.innerHeight)
          window.camera.aspect = window.innerWidth / window.innerHeight
          window.camera.updateProjectionMatrix()

          // Force render after resize
          if (window.scene) {
            window.renderer.render(window.scene, window.camera)
          }
        }
      }

      window.addEventListener("resize", handleResize)
      handleResize() // Call once on mount

      return () => {
        window.removeEventListener("resize", handleResize)
        document.removeEventListener("elementSelected", handleElementSelected as EventListener)
        document.removeEventListener("categorySelected", handleCategorySelected as EventListener)
      }
    } catch (error) {
      console.error("Error during initialization:", error)
      setInitError("Failed to initialize the periodic table. Please refresh the page.")
      setIsLoading(false)
    }
  }, [threeJsLoaded]) // Only run when threeJsLoaded changes

  // Effect to handle view changes
  useEffect(() => {
    if (view === "table" && window.periodicTableGroup && window.atomGroup) {
      console.log("Showing periodic table from view change effect")
      showPeriodicTable()
    }
  }, [view])

  const handleBackClick = () => {
    console.log("Back to periodic table clicked")
    setView("table")
    setSelectedElement(null)
    setSelectedCategory(null)

    // Ensure we properly reset the view
    setTimeout(() => {
      if (window.periodicTableGroup && window.atomGroup) {
        showPeriodicTable()
      }
    }, 50)
  }

  const handleHeaderHomeClick = () => {
    console.log("Header home link clicked")
    setView("table")
    setSelectedElement(null)
    setSelectedCategory(null)

    // Ensure we properly reset the view with a slightly longer delay
    // to allow for any state updates to complete
    setTimeout(() => {
      if (window.periodicTableGroup && window.atomGroup) {
        console.log("Showing periodic table from header click")
        showPeriodicTable()

        // Force a render
        if (window.renderer && window.scene && window.camera) {
          window.renderer.render(window.scene, window.camera)
        }
      }
    }, 100)
  }

  const handleCategoryClick = (type: "category" | "property", name: string) => {
    console.log(`Category clicked: ${type} - ${name}`)
    setView("category")
    setSelectedCategory({ type, name })
    setSelectedElement(null)
  }

  const handleElementClick = (element: Element) => {
    console.log(`Element clicked: ${element.name}`)
    setSelectedElement(element)
    setView("atom")

    // Make sure Three.js objects are properly initialized
    setTimeout(() => {
      // Ensure the atom group is visible
      if (window.atomGroup) {
        window.atomGroup.visible = true
      }
      if (window.periodicTableGroup) {
        window.periodicTableGroup.visible = false
      }

      // Create the atomic model
      createAtomicModel(element)

      // Force a render if renderer exists
      if (window.renderer && window.scene && window.camera) {
        window.renderer.render(window.scene, window.camera)
      }
    }, 100)
  }

  // Set a timeout to show an error message if loading takes too long
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        setInitError("Loading is taking longer than expected. You may need to refresh the page.")
      }
    }, 15000) // 15 seconds timeout

    return () => clearTimeout(timeoutId)
  }, [isLoading])

  // Allow scrolling in category view
  useEffect(() => {
    if (view === "category") {
      document.body.style.overflow = "auto"
    } else {
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [view])

  // Get the appropriate class based on the current view
  const getViewClass = () => {
    if (view === "category") return "category-view"
    if (view === "atom") return "atom-view"
    return "table-view"
  }

  return (
    <div
      className={`flex flex-col ${view === "category" ? "min-h-screen" : "h-screen overflow-hidden"} ${getViewClass()}`}
    >
      {/* Load Three.js scripts */}
      <Scripts onThreeJsLoaded={handleThreeJsLoaded} />

      {isLoading && <LoadingOverlay status={loadingStatus} />}

      {initError && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
          <div className="bg-card p-6 rounded-lg shadow-lg max-w-md text-center">
            <h2 className="text-xl font-bold mb-4">Error</h2>
            <p className="mb-4">{initError}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md"
            >
              Refresh Page
            </button>
          </div>
        </div>
      )}

      <Header onHomeClick={handleHeaderHomeClick} />

      <main className={`flex-1 relative ${view !== "category" ? "overflow-hidden" : ""}`}>
        <div className="container mx-auto px-4 py-4 relative z-30">
          <Breadcrumb
            view={view}
            element={selectedElement}
            category={selectedCategory}
            onBackClick={handleBackClick}
            onCategoryClick={handleCategoryClick}
          />
        </div>

        {/* Show search bar in main content on mobile */}
        {view === "table" && isMobile && <SearchBar onCategoryClick={handleCategoryClick} />}

        {/* Always show canvas container, but control visibility with CSS */}
        <div id="canvas-container" className={view === "category" ? "hidden" : ""}></div>
        <div className="element-tooltip" id="element-tooltip"></div>

        {view === "table" && (
          <>
            <CategoryLegend onCategoryClick={handleCategoryClick} />
            <UserGuide />
          </>
        )}

        {view === "category" && selectedCategory && (
          <CategoryPage
            categoryType={selectedCategory.type}
            categoryName={selectedCategory.name}
            onBackClick={handleBackClick}
            onElementClick={handleElementClick}
          />
        )}

        {view === "atom" && selectedElement && (
          <ElementInfo
            element={selectedElement}
            isOpen={infoPanelOpen}
            onToggle={() => setInfoPanelOpen(!infoPanelOpen)}
            onBackClick={handleBackClick}
            onCategoryClick={handleCategoryClick}
          />
        )}
      </main>

      <Footer />
    </div>
  )
}

