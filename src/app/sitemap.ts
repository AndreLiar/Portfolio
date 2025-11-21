import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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

  // Static routes
  const staticRoutes = [
    {
      url: `${baseUrl}`,
      lastModified: currentDate,
      changeFrequency: 'yearly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/auth/login`,
      lastModified: currentDate,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
  ]

  return [
    ...staticRoutes,
    ...languageRoutes,
  ]
}