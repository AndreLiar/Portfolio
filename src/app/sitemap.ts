import { MetadataRoute } from 'next'
import { createSupabaseServer } from '@/lib/supabase/server'

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

  // Add blog routes
  const blogRoutes = languages.flatMap(lang => [
    {
      url: `${baseUrl}/${lang}/blog`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/${lang}/rss.xml`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.3,
    },
  ])

  // Get published blog posts
  let postRoutes: MetadataRoute.Sitemap = []
  let tagRoutes: MetadataRoute.Sitemap = []
  
  try {
    const supabase = await createSupabaseServer()
    
    // Get published posts
    const { data: posts } = await supabase
      .from('posts')
      .select('slug, updated_at, published_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false })

    if (posts && posts.length > 0) {
      postRoutes = languages.flatMap(lang => 
        posts.map(post => ({
          url: `${baseUrl}/${lang}/blog/${post.slug}`,
          lastModified: new Date(post.updated_at),
          changeFrequency: 'monthly' as const,
          priority: 0.7,
        }))
      )
    }

    // Get tags with posts
    const { data: tags } = await supabase
      .from('tags')
      .select('slug')
      .order('name')

    if (tags && tags.length > 0) {
      // Only include tags that have published posts
      const { data: tagsWithPosts } = await supabase
        .from('post_tags')
        .select(`
          tags!inner(slug),
          posts!inner(status)
        `)
        .eq('posts.status', 'published')

      const uniqueTagSlugs = Array.from(
        new Set(
          tagsWithPosts?.map(tp => (tp as any).tags.slug).filter(Boolean) || []
        )
      )

      tagRoutes = languages.flatMap(lang => 
        uniqueTagSlugs.map(tagSlug => ({
          url: `${baseUrl}/${lang}/blog/tags/${tagSlug}`,
          lastModified: currentDate,
          changeFrequency: 'monthly' as const,
          priority: 0.5,
        }))
      )
    }
  } catch (error) {
    console.error('Error generating blog sitemap entries:', error)
    // Continue without blog entries if there's an error
  }

  // Combine all routes
  const routes = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 1,
    },
    ...languageRoutes,
    ...blogRoutes,
    ...postRoutes,
    ...tagRoutes,
  ]

  return routes
}