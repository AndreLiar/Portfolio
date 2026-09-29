import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.devandre.sbs'
  const currentDate = new Date()

  const languages = ['en', 'fr', 'de']
  // Sub-pages that exist per language (real pages on this domain).
  const sections = ['', '/blog', '/skills', '/resume'] as const

  const localizedRoutes = languages.flatMap(lang =>
    sections.map(section => ({
      url: `${baseUrl}/${lang}${section}`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      // home per-lang = highest; english slightly above fr/de; sub-pages a notch lower
      priority: section === '' ? (lang === 'en' ? 1 : 0.8) : (lang === 'en' ? 0.7 : 0.6),
    }))
  )

  const rootRoute = {
    url: baseUrl,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 1,
  }

  return [rootRoute, ...localizedRoutes]
}
