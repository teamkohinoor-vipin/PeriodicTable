// This file contains the Three.js code for initializing the periodic table
// We're keeping the original Three.js code but adapting it to work with our React components

import TWEEN from "@tweenjs/tween.js"

declare global {
  interface Window {
    THREE: any
    elementsData: any
    scene: any
    camera: any
    renderer: any
    controls: any
    periodicTableGroup: any
    atomGroup: any
    elementBoxes: any
    raycaster: any
    mouse: any
    INTERSECTED: any
    TWEEN: any
  }
}

export function initPeriodicTable() {
  if (typeof window === "undefined") return

  // Safety check - make sure THREE is available
  if (!window.THREE) {
    console.error("THREE.js not loaded yet. Waiting...")

    // Try again in 1 second
    setTimeout(initPeriodicTable, 1000)
    return
  }

  // Check if scene is already initialized
  if (window.scene && window.renderer) {
    console.log("Three.js scene already initialized, skipping...")
    return
  }

  try {
    console.log("THREE.js is available, initializing scene")
    const THREE = window.THREE

    // Make TWEEN available globally
    window.TWEEN = TWEEN

    // Create a scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x111827)

    // Create a camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 20

    // Create a renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    const canvasContainer = document.getElementById("canvas-container")
    if (canvasContainer) {
      // Clear any existing canvas
      while (canvasContainer.firstChild) {
        canvasContainer.removeChild(canvasContainer.firstChild)
      }
      canvasContainer.appendChild(renderer.domElement)
    } else {
      console.error("Canvas container not found")
      return
    }

    // Safety check - make sure OrbitControls is available
    if (!THREE.OrbitControls) {
      console.error("OrbitControls not loaded yet. Waiting...")

      // Try again in 1 second
      setTimeout(initPeriodicTable, 1000)
      return
    }

    // Add orbit controls
    const controls = new THREE.OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05

    // Create groups for organization
    const periodicTableGroup = new THREE.Group()
    const atomGroup = new THREE.Group()

    scene.add(periodicTableGroup)
    scene.add(atomGroup)
    atomGroup.visible = false

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(1, 1, 1)
    scene.add(directionalLight)

    // Handle window resize
    window.addEventListener("resize", onWindowResize, false)

    // Initialize raycaster and mouse
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()
    const elementBoxes = {}
    let INTERSECTED = null
    const previousScale = null

    // Store in window for access from other modules
    window.THREE = THREE
    window.scene = scene
    window.camera = camera
    window.renderer = renderer
    window.controls = controls
    window.periodicTableGroup = periodicTableGroup
    window.atomGroup = atomGroup
    window.elementBoxes = elementBoxes
    window.raycaster = raycaster
    window.mouse = mouse
    window.INTERSECTED = INTERSECTED

    // Add mouse event listeners for interaction
    renderer.domElement.addEventListener("mousemove", onMouseMove, false)
    renderer.domElement.addEventListener("click", onMouseClick, false)

    // Add touch event listeners for mobile devices
    renderer.domElement.addEventListener("touchstart", onTouchStart, false)
    renderer.domElement.addEventListener("touchend", onTouchEnd, false)

    // Start the animation loop
    animate()

    console.log("Three.js scene initialized successfully")

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    function onMouseClick(event: MouseEvent) {
      // Only handle clicks on periodic table when it's visible
      if (periodicTableGroup.visible && INTERSECTED) {
        const element = INTERSECTED.userData.element
        if (element) {
          // Update React state through a custom event
          const event = new CustomEvent("elementSelected", { detail: element })
          document.dispatchEvent(event)
        }
      }
    }

    // Touch start position for detecting taps
    let touchStartX = 0
    let touchStartY = 0
    const touchThreshold = 10 // Threshold in pixels to distinguish between tap and swipe

    function onTouchStart(event: TouchEvent) {
      event.preventDefault()

      if (event.touches.length === 1) {
        // Store the initial touch position
        touchStartX = event.touches[0].clientX
        touchStartY = event.touches[0].clientY

        // Update mouse position for raycaster
        updateMousePosition(event.touches[0].clientX, event.touches[0].clientY)
      }
    }

    function onTouchEnd(event: TouchEvent) {
      event.preventDefault()

      // Only process if we have touch information
      if (event.changedTouches.length === 1) {
        const touch = event.changedTouches[0]

        // Calculate distance moved
        const distX = Math.abs(touch.clientX - touchStartX)
        const distY = Math.abs(touch.clientY - touchStartY)

        // If it's a tap (not a swipe)
        if (distX < touchThreshold && distY < touchThreshold) {
          // Update mouse position for final check
          updateMousePosition(touch.clientX, touch.clientY)

          // Only handle clicks on periodic table when it's visible
          if (periodicTableGroup.visible && INTERSECTED) {
            const element = INTERSECTED.userData.element
            if (element) {
              // Update React state through a custom event
              const event = new CustomEvent("elementSelected", { detail: element })
              document.dispatchEvent(event)
            }
          }
        }
      }
    }

    // Helper function to update mouse position for raycaster
    function updateMousePosition(clientX: number, clientY: number) {
      // Get the canvas position and dimensions
      const canvas = renderer.domElement
      const rect = canvas.getBoundingClientRect()

      // Calculate mouse position in normalized device coordinates (-1 to +1)
      mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1

      // Update the raycaster
      raycaster.setFromCamera(mouse, camera)

      // Find intersections with element boxes
      const intersects = raycaster.intersectObjects(periodicTableGroup.children, true)

      if (intersects.length > 0) {
        // If we found an intersection
        const intersectedObject = intersects[0].object

        // Get the top-level parent with userData.element
        let targetObject = intersectedObject
        while (targetObject.parent && targetObject.parent !== periodicTableGroup && !targetObject.userData.element) {
          targetObject = targetObject.parent
        }

        // Only proceed if we found an object with element data
        if (targetObject.userData.element) {
          if (INTERSECTED !== targetObject) {
            // Reset previous intersection
            if (INTERSECTED) {
              INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex)
              INTERSECTED.scale.set(1, 1, 1)
            }

            // Store new intersection
            INTERSECTED = targetObject
            INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex()
            INTERSECTED.material.emissive.setHex(0x555555) // Brighter highlight
            INTERSECTED.scale.set(1.3, 1.3, 1.3)
          }
        }
      } else if (INTERSECTED) {
        // No intersection found, reset previous
        INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex)
        INTERSECTED.scale.set(1, 1, 1)
        INTERSECTED = null
      }
    }

    function onMouseMove(event: MouseEvent) {
      updateMousePosition(event.clientX, event.clientY)

      // Only check intersections with periodic table when it's visible
      if (periodicTableGroup.visible && INTERSECTED) {
        // Show tooltip
        const element = INTERSECTED.userData.element
        if (element) {
          const tooltip = document.getElementById("element-tooltip")
          if (tooltip) {
            tooltip.innerHTML = `
              <div>
                <div><strong>${element.name} (${element.symbol})</strong></div>
                <div>Atomic number: ${element.number}</div>
                <div>Atomic mass: ${element.atomic_mass}</div>
                <div>Category: ${element.category}</div>
              </div>
            `
            tooltip.style.left = event.clientX + 15 + "px"
            tooltip.style.top = event.clientY + 15 + "px"
            tooltip.style.display = "block"
          }
        }
      } else {
        // We're in atom view, make sure tooltip is hidden
        const tooltip = document.getElementById("element-tooltip")
        if (tooltip) {
          tooltip.style.display = "none"
        }
      }
    }

    function animate() {
      requestAnimationFrame(animate)

      // Update controls
      controls.update()

      // Animate electrons if atom view is active
      if (atomGroup.visible) {
        // Update each electron position with smooth animation
        atomGroup.traverse((child: any) => {
          if (child.userData && child.userData.isElectron) {
            // Calculate new position to maintain perfectly circular orbit
            const electron = child
            const time = Date.now() * 0.001
            const speed = electron.userData.rotationSpeed
            const radius = electron.userData.shellRadius
            const initialAngle = electron.userData.initialAngle

            // Calculate new angle based on time, speed, and initial offset
            const angle = initialAngle + time * speed

            // Update position to stay exactly on the orbital path
            electron.position.x = radius * Math.cos(angle)
            electron.position.y = radius * Math.sin(angle)
          }
        })
      }

      // Render the scene
      renderer.render(scene, camera)

      // Update TWEEN
      TWEEN.update()
    }
  } catch (error) {
    console.error("Error initializing Three.js scene:", error)
  }
}

export async function loadElementData() {
  try {
    console.log("Fetching element data...")
    // This dataset contains all elements with basic properties
    const response = await fetch(
      "https://raw.githubusercontent.com/Bowserinator/Periodic-Table-JSON/master/periodic-table-lookup.json",
    )
    const data = await response.json()

    console.log("Processing element data...")
    // Process and store the data
    const elementsData: any = {}
    Object.values(data).forEach((element: any) => {
      if (typeof element === "object" && element.number) {
        // Add applications data (this would normally come from an API but is mocked here)
        element.applications = getElementApplications(element.symbol)

        // We'll use the image URL from the element data if available,
        // otherwise it will be handled in the component

        elementsData[element.number] = element
      }
    })

    // Also fetch the complete JSON data which contains image URLs
    fetch("https://raw.githubusercontent.com/Bowserinator/Periodic-Table-JSON/master/PeriodicTableJSON.json")
      .then((response) => response.json())
      .then((fullData) => {
        if (fullData && fullData.elements) {
          // Update our elements data with image URLs from the full data
          fullData.elements.forEach((fullElement: any) => {
            if (elementsData[fullElement.number]) {
              // Add image data if available
              if (fullElement.image) {
                elementsData[fullElement.number].image = {
                  url: fullElement.image.url,
                  attribution: fullElement.image.attribution,
                }
              }
            }
          })
          console.log("Element images loaded successfully")
        }
      })
      .catch((error) => {
        console.error("Error loading full element data:", error)
      })

    // Store in window for access from other modules
    window.elementsData = elementsData

    console.log("Creating periodic table visualization...")
    // Create the periodic table visualization
    createPeriodicTable(elementsData)

    return elementsData
  } catch (error) {
    console.error("Error loading element data:", error)
    throw error
  }
}

function createPeriodicTable(elementsData: any) {
  // Safety check - make sure THREE is available
  if (typeof window === "undefined" || !window.THREE) {
    console.error("THREE.js not loaded yet")
    return
  }

  const THREE = window.THREE
  const periodicTableGroup = window.periodicTableGroup
  const elementBoxes = window.elementBoxes

  if (!periodicTableGroup) {
    console.error("periodicTableGroup not initialized")
    return
  }

  const boxSize = 0.9
  const spacing = 1
  const startX = -8.5 * spacing
  const startY = 5 * spacing

  // Standard periodic table layout
  const layout = [
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [3, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 6, 7, 8, 9, 10],
    [11, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 13, 14, 15, 16, 17, 18],
    [19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36],
    [37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54],
    [55, 56, "*", 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86],
    [87, 88, "**", 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, "*", 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71],
    [0, 0, "**", 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103],
  ]

  // Create element boxes
  for (let row = 0; row < layout.length; row++) {
    for (let col = 0; col < layout[row].length; col++) {
      const atomicNumber = layout[row][col]

      if (atomicNumber !== 0 && atomicNumber !== "*" && atomicNumber !== "**") {
        const element = elementsData[atomicNumber]

        if (element) {
          // Create element box
          createElementBox(element, startX + col * spacing, startY - row * spacing, boxSize)
        }
      }
    }
  }

  function createElementBox(element: any, x: number, y: number, size: number) {
    // Get color based on element category
    const color = getCategoryColor(element.category)

    // Create box geometry
    const geometry = new THREE.BoxGeometry(size, size, size * 0.25)
    const material = new THREE.MeshPhongMaterial({
      color: color,
      transparent: true,
      opacity: 0.9,
      specular: 0x111111,
    })

    const box = new THREE.Mesh(geometry, material)
    box.position.set(x, y, 0)
    box.userData.element = element

    // Add symbol text - LARGER and positioned further forward
    const symbolText = createTextSprite(element.symbol, 0.8, 0xffffff)
    symbolText.position.set(0, 0, 0.5) // Increased z-position even more to be visible from side angles
    box.add(symbolText)

    // Add atomic number text - LARGER and positioned further forward
    const atomicNumText = createTextSprite(element.number.toString(), 0.4, 0xffffff)
    atomicNumText.position.set(-0.25, 0.25, 0.5) // Increased z-position to match symbol text
    box.add(atomicNumText)

    // Store reference to the box
    elementBoxes[element.number] = box

    // Add to scene
    periodicTableGroup.add(box)
  }

  // Improved text sprite function for element symbols and numbers
  function createTextSprite(text: string, size: number, color: number) {
    const canvas = document.createElement("canvas")
    const context = canvas.getContext("2d")
    if (!context) return new THREE.Sprite()

    canvas.width = 256
    canvas.height = 256

    // Clear background
    context.clearRect(0, 0, canvas.width, canvas.height)

    // Add 2px black stroke to text
    context.font = "Bold 100px Arial" // Increased from 80px to 100px for better visibility
    context.strokeStyle = "black"
    context.lineWidth = 2
    context.textAlign = "center"
    context.textBaseline = "middle"
    context.strokeText(text, 128, 128)

    // Draw text with bold font
    context.fillStyle = "rgba(255, 255, 255, 1.0)"
    context.fillText(text, 128, 128)

    const texture = new THREE.CanvasTexture(canvas)

    // Use AlphaTest to prevent transparency issues
    const material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      alphaTest: 0.1, // This helps with rendering order
      depthTest: false, // This ensures text is always visible
      depthWrite: false, // This prevents text from being occluded
    })

    const sprite = new THREE.Sprite(material)
    sprite.scale.set(size, size, 1)

    // Make sure sprite always faces the camera
    sprite.userData = { alwaysFaceCamera: true }

    return sprite
  }

  function getCategoryColor(category: string) {
    const colorMap: Record<string, number> = {
      "alkali metal": 0xff8a80,
      "alkaline earth metal": 0xff80ab,
      "transition metal": 0xea80fc,
      "post-transition metal": 0xb388ff,
      metalloid: 0x8c9eff,
      nonmetal: 0x82b1ff,
      halogen: 0x80d8ff,
      "noble gas": 0x84ffff,
      lanthanide: 0xa7ffeb,
      actinide: 0xb9f6ca,
    }

    return colorMap[category.toLowerCase()] || 0xe6ee9c
  }
}

export function initElementHazards() {
  // Already handled in React component
}

// Helper function to get mock applications data
function getElementApplications(symbol: string) {
  const applicationsData: Record<string, string[]> = {
    H: ["Fuel for stars", "Hydrogen fuel cells", "Industrial processes"],
    He: ["Cooling superconducting magnets", "Lifting balloons", "Deep-sea diving mixtures"],
    Li: ["Lithium-ion batteries", "Psychiatric medications", "Aerospace alloys"],
    Be: ["Aerospace components", "X-ray windows", "Nuclear reactors"],
    C: ["Structural materials", "Organic chemistry", "Energy storage"],
    O: ["Respiration", "Combustion", "Industrial oxidation"],
    Na: ["Salt (NaCl)", "Street lighting", "Heat transfer in nuclear reactors"],
    Al: ["Lightweight structural materials", "Packaging", "Electrical transmission lines"],
    Si: ["Semiconductors", "Solar cells", "Glass production"],
    Fe: ["Structural steel", "Vehicles", "Machinery manufacturing"],
    Cu: ["Electrical wiring", "Plumbing", "Electronics"],
    Ag: ["Electronics", "Photography", "Antimicrobial applications"],
    Au: ["Electronics", "Jewelry", "Dentistry"],
    Hg: ["Thermometers", "Fluorescent lighting", "Dental amalgams"],
    Pb: ["Batteries", "Radiation shielding", "Historical plumbing"],
    U: ["Nuclear fuel", "Military applications", "Radiation shielding"],
  }

  return applicationsData[symbol] || ["Industrial applications", "Scientific research"]
}

