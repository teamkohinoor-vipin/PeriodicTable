import favicons from "favicons"
import fs from "fs"
import path from "path"

// SVG content from your blob URL
const svgContent = `<svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<!-- Your SVG content here -->
</svg>`

// Configuration
const configuration = {
  path: "/favicon", // Path for generated files
  appName: "3D Interactive Periodic Table",
  appShortName: "Periodic Table",
  appDescription: "An interactive 3D Periodic Table",
  background: "#111827",
  theme_color: "#111827",
  icons: {
    android: true,
    appleIcon: true,
    appleStartup: false,
    favicons: true,
    windows: false,
    yandex: false,
  },
}

// Create the public/favicon directory if it doesn't exist
const faviconDir = path.resolve(process.cwd(), "public/favicon")
if (!fs.existsSync(faviconDir)) {
  fs.mkdirSync(faviconDir, { recursive: true })
}

// Generate favicons
favicons(svgContent, configuration)
  .then((response) => {
    // Save each file
    response.images.forEach((image) => {
      fs.writeFileSync(path.resolve(faviconDir, image.name), image.contents)
    })

    response.files.forEach((file) => {
      fs.writeFileSync(path.resolve(faviconDir, file.name), file.contents)
    })

    console.log("Favicons generated successfully!")
  })
  .catch((error) => {
    console.error("Error generating favicons:", error)
  })

