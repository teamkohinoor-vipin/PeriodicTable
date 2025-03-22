// This file contains the Three.js code for creating and displaying the atomic model

export function createAtomicModel(element: any) {
  if (typeof window === "undefined") return

  // Safety check - make sure THREE is available
  if (!window.THREE) {
    console.error("THREE.js not loaded yet")
    return
  }

  const THREE = window.THREE
  const scene = window.scene
  const camera = window.camera
  const controls = window.controls
  const atomGroup = window.atomGroup
  const periodicTableGroup = window.periodicTableGroup

  // Safety check - make sure all required objects are available
  if (!scene || !camera || !controls || !atomGroup || !periodicTableGroup) {
    console.error("Required Three.js objects not initialized")
    return
  }

  try {
    console.log("Creating atomic model for:", element.name)

    // Hide periodic table and show atom group
    periodicTableGroup.visible = false
    atomGroup.visible = true

    // Clear previous atom model
    while (atomGroup.children.length > 0) {
      const object = atomGroup.children[0]
      if (object.geometry) object.geometry.dispose()
      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach((m: any) => m.dispose())
        } else {
          object.material.dispose()
        }
      }
      atomGroup.remove(object)
    }

    // Reset camera position
    camera.position.set(0, 0, 40)
    controls.target.set(0, 0, 0)
    controls.update()

    // Create nucleus with appropriate color for Bohr-style representation
    const nucleusGeometry = new THREE.SphereGeometry(2.5, 32, 32)
    const nucleusMaterial = new THREE.MeshPhongMaterial({
      color: 0xff9999, // Pink color similar to the Bohr model
      emissive: 0x441111,
      specular: 0xffffff,
      shininess: 30,
    })
    const nucleus = new THREE.Mesh(nucleusGeometry, nucleusMaterial)
    atomGroup.add(nucleus)

    // Add element symbol using a transparent sprite with no background
    const symbolSprite = createElementSymbolSprite(element.symbol, 2.5)
    if (symbolSprite) {
      symbolSprite.position.set(0, 0, 3) // Position in front of nucleus
      nucleus.add(symbolSprite)
    }

    // Get accurate electron configuration for this element
    const electronConfig = getElementElectronConfig(element)

    // Create electron shells with Bohr-style appearance
    let shellRadius = 5 // Start radius
    const shellIncrement = 3 // Space between shells

    // Create shells and electrons
    let shellNumber = 0
    const shellKeys = Object.keys(electronConfig).sort((a, b) => Number.parseInt(a) - Number.parseInt(b))

    for (const shell of shellKeys) {
      const electrons = electronConfig[shell]
      shellNumber = Number.parseInt(shell)

      // Skip empty shells
      if (electrons <= 0) continue

      // Create visible shell (orbit ring)
      const orbitGeometry = new THREE.TorusGeometry(shellRadius, 0.12, 16, 100)
      const orbitMaterial = new THREE.MeshBasicMaterial({
        color: 0x00aaff, // Brighter blue color for better visibility
        transparent: false,
        opacity: 1.0,
      })
      const orbitRing = new THREE.Mesh(orbitGeometry, orbitMaterial)
      orbitRing.rotation.x = Math.PI / 2 // Lay flat on XY plane
      atomGroup.add(orbitRing)

      // Create electrons
      const electronGeometry = new THREE.SphereGeometry(0.4, 16, 16)
      const electronMaterial = new THREE.MeshPhongMaterial({
        color: 0x00ccff, // Bright cyan for electrons
        emissive: 0x0088aa,
        specular: 0xffffff,
        shininess: 30,
      })

      // Create a group for the shell
      const electronShellGroup = new THREE.Group()
      electronShellGroup.rotation.x = Math.PI / 2 // Same orientation as orbit ring
      atomGroup.add(electronShellGroup)

      // Add electrons to the shell evenly distributed
      for (let i = 0; i < electrons; i++) {
        // Calculate angle for even distribution
        const angle = (i / electrons) * Math.PI * 2

        // Position electron directly on the orbital path
        const x = shellRadius * Math.cos(angle)
        const y = shellRadius * Math.sin(angle)

        const electron = new THREE.Mesh(electronGeometry, electronMaterial)
        electron.position.set(x, y, 0)

        // Store animation data for each electron
        electron.userData = {
          isElectron: true,
          shellNumber: shellNumber,
          shellRadius: shellRadius,
          initialAngle: angle,
          // Outer shells move slower (like planets)
          rotationSpeed: 0.5 / (0.8 + shellNumber * 0.2),
        }

        electronShellGroup.add(electron)
      }

      // Increase radius for next shell
      shellRadius += shellIncrement
    }

    // Add element name text
    const nameSprite = createElementNameSprite(`${element.name} (${element.symbol})`, 10, 1800)
    if (nameSprite) {
      nameSprite.position.set(0, 10, 0)
      atomGroup.add(nameSprite)
    }

    // Add atomic number and composition information below the model
    const numProtons = element.number
    const atomicMass = Number.parseFloat(element.atomic_mass) || numProtons
    const numNeutrons = Math.round(atomicMass) - numProtons

    // Format electron shell configuration with proper spacing
    const shellConfig = Object.entries(electronConfig).sort((a, b) => Number.parseInt(a[0]) - Number.parseInt(b[0]))

    // First line - composition info
    const compositionText = createElementNameSprite(
      `Protons: ${numProtons} | Neutrons: ${numNeutrons} | Electrons: ${numProtons}`,
      6.0,
      3000,
    )
    if (compositionText) {
      compositionText.position.set(0, -10, 0)
      atomGroup.add(compositionText)
    }

    // Split shell configuration into smaller chunks for better readability
    const shellTexts = shellConfig.map(([shell, count]) => `Shell ${shell}: ${count} electrons`)

    // Create one line for each pair of shells, or just show all on one line if only 2-3 shells
    const totalShells = shellTexts.length
    let shellsPerLine = 2

    if (totalShells <= 2) {
      shellsPerLine = totalShells // All on one line if 2 or fewer
    }

    // Create lines of shell configuration text
    const linesOfText = []
    for (let i = 0; i < shellTexts.length; i += shellsPerLine) {
      linesOfText.push(shellTexts.slice(i, i + shellsPerLine).join(" | "))
    }

    // Position each line with minimal vertical spacing
    linesOfText.forEach((line, index) => {
      const configTextLine = createElementNameSprite(line, 6.0, 3000)
      if (configTextLine) {
        // Position lines closer together - only 3 units apart instead of 5
        configTextLine.position.set(0, -15 - index * 3, 0)
        atomGroup.add(configTextLine)
      }
    })

    // Force a render to update the scene
    if (window.renderer) {
      window.renderer.render(scene, camera)
    }

    console.log("Atomic model created successfully")
  } catch (error) {
    console.error("Error creating atomic model:", error)
  }
}

export function showPeriodicTable() {
  if (typeof window === "undefined") return

  // Safety check - make sure required objects are available
  if (!window.periodicTableGroup || !window.atomGroup) {
    console.error("Required Three.js objects not initialized")
    return
  }

  try {
    console.log("Showing periodic table")

    const periodicTableGroup = window.periodicTableGroup
    const atomGroup = window.atomGroup

    // Make sure the periodic table is visible and atom is hidden
    periodicTableGroup.visible = true
    atomGroup.visible = false

    // Reset camera position if camera and controls are available
    if (window.camera && window.controls) {
      window.camera.position.set(0, 0, 20)
      window.controls.target.set(0, 0, 0)
      window.controls.update()
    }

    // Force a render to update the scene
    if (window.renderer && window.scene && window.camera) {
      console.log("Forcing render of periodic table")
      window.renderer.render(window.scene, window.camera)
    }

    // Schedule another render after a short delay to ensure everything is updated
    setTimeout(() => {
      if (window.renderer && window.scene && window.camera) {
        console.log("Rendering periodic table again after delay")
        window.renderer.render(window.scene, window.camera)
      }
    }, 100)
  } catch (error) {
    console.error("Error showing periodic table:", error)
  }
}

// Helper function to create element symbol sprites
function createElementSymbolSprite(text: string, size: number) {
  if (typeof window === "undefined" || !window.THREE) return null

  const THREE = window.THREE

  const canvas = document.createElement("canvas")
  const context = canvas.getContext("2d")
  if (!context) return new THREE.Sprite()

  canvas.width = 256
  canvas.height = 256

  // Clear background to transparent
  context.clearRect(0, 0, canvas.width, canvas.height)

  // Draw text with clean white appearance
  context.font = "Bold 128px Arial"
  context.fillStyle = "rgba(255, 255, 255, 1.0)"
  context.textAlign = "center"
  context.textBaseline = "middle"
  context.fillText(text, 128, 128)

  const texture = new THREE.CanvasTexture(canvas)
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    opacity: 0.9,
  })
  const sprite = new THREE.Sprite(material)
  sprite.scale.set(size, size, 1)

  return sprite
}

// Special function just for element names to prevent cutting
function createElementNameSprite(text: string, size: number, canvasWidth = 1024) {
  if (typeof window === "undefined" || !window.THREE) return null

  const THREE = window.THREE

  const canvas = document.createElement("canvas")
  const context = canvas.getContext("2d")
  if (!context) return new THREE.Sprite()

  canvas.width = canvasWidth
  canvas.height = 512 // Increased height for text clarity

  // Clear background
  context.clearRect(0, 0, canvas.width, canvas.height)

  // Draw text with more padding
  context.font = "Bold 90px Arial"
  context.fillStyle = "rgba(255, 255, 255, 1.0)"
  context.textAlign = "center"
  context.fillText(text, canvas.width / 2, canvas.height / 2)

  const texture = new THREE.CanvasTexture(canvas)
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
  })
  const sprite = new THREE.Sprite(material)

  // Scale based on canvas dimensions
  const aspectRatio = canvasWidth / 512 // Match the new height
  sprite.scale.set(size * aspectRatio, size, 1)

  return sprite
}

// Function to get electron configuration for an element
function getElementElectronConfig(element: any) {
  // If element has electron configuration data, use that
  if (element.electron_configuration || element.electron_configuration_semantic) {
    return parseElectronConfiguration(
      element.electron_configuration_semantic || element.electron_configuration,
      element.number,
    )
  }

  // Otherwise, determine by atomic number
  return getElectronShellsByNumber(element.number)
}

// Parse electron configuration string into shells
function parseElectronConfiguration(config: string, atomicNumber: number) {
  // Initialize shells object to store electrons per shell
  const shells: Record<string, number> = {}

  // Default shell assignments based on orbital notation
  const shellMap: Record<string, number> = {
    "1s": 1,
    "2s": 2,
    "2p": 2,
    "3s": 3,
    "3p": 3,
    "3d": 3,
    "4s": 4,
    "4p": 4,
    "4d": 4,
    "4f": 4,
    "5s": 5,
    "5p": 5,
    "5d": 5,
    "5f": 5,
    "6s": 6,
    "6p": 6,
    "6d": 6,
    "7s": 7,
    "7p": 7,
  }

  if (!config || typeof config !== "string") {
    return getElectronShellsByNumber(atomicNumber || 1)
  }

  try {
    // Remove noble gas notation if present and expand it
    let fullConfig = config
    const nobleGasMatch = config.match(/\[(.*?)\]/)

    if (nobleGasMatch) {
      const nobleGasSymbol = nobleGasMatch[1]
      let baseConfig = ""

      // Expand noble gas notation
      switch (nobleGasSymbol) {
        case "He":
          baseConfig = "1s2"
          break
        case "Ne":
          baseConfig = "1s2 2s2 2p6"
          break
        case "Ar":
          baseConfig = "1s2 2s2 2p6 3s2 3p6"
          break
        case "Kr":
          baseConfig = "1s2 2s2 2p6 3s2 3p6 4s2 3d10 4p6"
          break
        case "Xe":
          baseConfig = "1s2 2s2 2p6 3s2 3p6 4s2 3d10 4p6 5s2 4d10 5p6"
          break
        case "Rn":
          baseConfig = "1s2 2s2 2p6 3s2 3p6 4s2 3d10 4p6 5s2 4d10 5p6 6s2 4f14 5d10 6p6"
          break
      }

      fullConfig = baseConfig + " " + config.replace(/\[.*?\]\s?/, "")
    }

    // Split into individual orbital components
    const configParts = fullConfig.trim().split(/\s+/)

    // Process each part
    for (const part of configParts) {
      // Match patterns like "1s2", "2p6", etc.
      const match = part.match(/^(\d[spdf])(\d+)$/)

      if (match) {
        const orbital = match[1] // e.g., "1s", "2p"
        const electrons = Number.parseInt(match[2]) // e.g., 2, 6
        const shell = shellMap[orbital] || Number.parseInt(orbital[0])

        if (shells[shell]) {
          shells[shell] += electrons
        } else {
          shells[shell] = electrons
        }
      }
    }
  } catch (error) {
    console.error("Error parsing electron configuration:", error)
  }

  // If no shells were parsed or there was an error,
  // create a correct distribution based on atomic number
  if (Object.keys(shells).length === 0) {
    return getElectronShellsByNumber(atomicNumber || 1)
  }

  return shells
}

// Helper function to get correct shells by atomic number
function getElectronShellsByNumber(atomicNumber: number) {
  const shells: Record<string, number> = {}
  let remaining = atomicNumber

  // Standard shell capacities (2n²)
  const shellCapacities = [0, 2, 8, 18, 32, 32, 18, 8]

  // Fill shells according to capacity
  for (let shell = 1; shell <= 7; shell++) {
    if (remaining <= 0) break

    const shellCapacity = shellCapacities[shell]
    const electrons = Math.min(remaining, shellCapacity)

    if (electrons > 0) {
      shells[shell] = electrons
    }

    remaining -= electrons
  }

  return shells
}

