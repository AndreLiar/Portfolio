import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://laurel-portfolio.vercel.app'
  const currentDate = new Date()
  
  // Define supported languages
  const languages = ['en', 'fr', 'de']
  
  // Create sitemap entries for each language
  const languageRoutes = languages.map(lang => ({
    url: `${baseUrl}/${lang}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: lang === 'en' ? 1 : 0.8, // English as primary language
  }))

  // Add root URL redirect
  const routes = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 1,
    },
    ...languageRoutes,
  ]

  return routes
}