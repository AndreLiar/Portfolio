import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Andre Kanmegne - Fullstack Software Engineer Portfolio",
    short_name: "Andre Portfolio",
    description: "Portfolio of Andre Kanmegne, Fullstack Software Engineer specializing in TypeScript, React, Next.js, and AI integration.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#3b82f6",
    orientation: "portrait-primary",
    categories: ["business", "productivity", "portfolio"],
    lang: "en",
    dir: "ltr",
    // Only reference assets that actually exist in /public. Pointing at missing
    // PNG icons caused a 404 that Lighthouse logs as a console error (Best
    // Practices → errors-in-console).
    icons: [
      {
        src: "/favicon.ico",
        sizes: "16x16 32x32 48x48",
        type: "image/x-icon"
      }
    ],
    related_applications: [],
    prefer_related_applications: false,
    scope: "/"
  }
}