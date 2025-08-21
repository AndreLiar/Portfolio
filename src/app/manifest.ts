import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Laurel Kanmegne - Fullstack Software Engineer Portfolio",
    short_name: "Laurel Portfolio",
    description: "Portfolio of Laurel Kanmegne, Fullstack Software Engineer specializing in TypeScript, React, Next.js, and AI integration.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#3b82f6",
    orientation: "portrait-primary",
    categories: ["business", "productivity", "portfolio"],
    lang: "en",
    dir: "ltr",
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable"
      },
      {
        src: "/favicon.ico",
        sizes: "16x16 32x32",
        type: "image/x-icon"
      }
    ],
    related_applications: [],
    prefer_related_applications: false,
    scope: "/",
    screenshots: [
      {
        src: "/images/screenshot-wide.png",
        sizes: "1280x720",
        type: "image/png",
        form_factor: "wide",
        label: "Portfolio homepage featuring projects and skills"
      },
      {
        src: "/images/screenshot-narrow.png", 
        sizes: "640x1136",
        type: "image/png",
        form_factor: "narrow",
        label: "Mobile view of the portfolio"
      }
    ]
  }
}