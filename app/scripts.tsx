"use client"

import { useEffect } from "react"

interface ScriptsProps {
  onThreeJsLoaded?: () => void
}

export default function Scripts({ onThreeJsLoaded }: ScriptsProps) {
  useEffect(() => {
    // Function to load scripts sequentially
    const loadScript = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        const script = document.createElement("script")
        script.src = src
        script.async = true

        script.onload = () => resolve()
        script.onerror = () => reject(new Error(`Failed to load script: ${src}`))

        document.body.appendChild(script)
      })
    }

    // Load Three.js and then OrbitControls
    const loadThreeJs = async () => {
      try {
        // Check if Three.js is already loaded
        if (window.THREE) {
          console.log("Three.js already loaded, skipping script load")
          if (onThreeJsLoaded) {
            console.log("Calling onThreeJsLoaded callback")
            onThreeJsLoaded()
          }
          return
        }

        console.log("Loading Three.js...")
        await loadScript("https://unpkg.com/three@0.128.0/build/three.min.js")
        console.log("Three.js loaded successfully")

        console.log("Loading OrbitControls...")
        await loadScript("https://unpkg.com/three@0.128.0/examples/js/controls/OrbitControls.js")
        console.log("OrbitControls loaded successfully")

        // We don't need TWEEN.js anymore since we're using direct scaling
        console.log("All scripts loaded successfully")

        // Notify parent component that Three.js is loaded
        if (onThreeJsLoaded) {
          console.log("Calling onThreeJsLoaded callback")
          onThreeJsLoaded()
        }
      } catch (error) {
        console.error("Error loading Three.js:", error)
      }
    }

    loadThreeJs()

    // Cleanup function
    return () => {
      // No cleanup needed for script loading
    }
  }, [onThreeJsLoaded])

  return null
}

