import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "3D Interactive Periodic Table",
    short_name: "Periodic Table",
    description: "An interactive 3D Periodic Table with detailed element information",
    start_url: "/",
    display: "standalone",
    background_color: "#111827",
    theme_color: "#111827",
    icons: [
      {
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/atom-svgrepo-com%20%283%29-MK2DlKL1twVe7gnbm7BSxsMIzBnxHX.svg",
        type: "image/svg+xml",
        sizes: "any",
      },
      {
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/favicon-32x32-j0oqqyAVs7swHgC2efPdGytH2uJNwM.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/favicon-16x16-ehS6Y7f82LvvGhWQYyNqt9iLkSpNOL.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/apple-touch-icon-tDTXgV2HwQD5JlK02TawAOQG8ew8xx.png",
        sizes: "180x180",
        type: "image/png",
      },
      {
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/android-chrome-192x192-vYH4LMqFYUr292s4OTeaZL14EFDbxh.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/android-chrome-512x512-QwquxlOhwgp9A6ebRvYE1ub5wEUAmh.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  }
}

