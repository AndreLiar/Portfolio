import { NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://laurel-portfolio.vercel.app';
  const currentDate = new Date().toISOString();
  
  // Define supported languages
  const languages = ['en', 'fr', 'de'];
  
  // Create sitemap entries
  let sitemapEntries = [
    // Root entry
    `<url>
      <loc>${baseUrl}</loc>
      <lastmod>${currentDate}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>1.0</priority>
    </url>`,
    
    // Language-specific entries
    ...languages.map(lang => `<url>
      <loc>${baseUrl}/${lang}</loc>
      <lastmod>${currentDate}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>${lang === 'en' ? '1.0' : '0.8'}</priority>
    </url>`),
    
    // Blog index pages
    ...languages.map(lang => `<url>
      <loc>${baseUrl}/${lang}/blog</loc>
      <lastmod>${currentDate}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>`),
  ];

  // Add blog posts
  try {
    const supabase = await createSupabaseServer();
    
    // Get published posts
    const { data: posts } = await supabase
      .from('posts')
      .select('slug, updated_at, published_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (posts && posts.length > 0) {
      const postEntries = languages.flatMap(lang => 
        posts.map(post => `<url>
          <loc>${baseUrl}/${lang}/blog/${post.slug}</loc>
          <lastmod>${new Date(post.updated_at).toISOString()}</lastmod>
          <changefreq>monthly</changefreq>
          <priority>0.7</priority>
        </url>`)
      );
      
      sitemapEntries.push(...postEntries);
    }

    // Get tags with posts
    const { data: tagsWithPosts } = await supabase
      .from('post_tags')
      .select(`
        tags!inner(slug),
        posts!inner(status)
      `)
      .eq('posts.status', 'published');

    if (tagsWithPosts && tagsWithPosts.length > 0) {
      const uniqueTagSlugs = Array.from(
        new Set(
          tagsWithPosts.map((tp: any) => tp.tags.slug).filter(Boolean)
        )
      );

      const tagEntries = languages.flatMap(lang => 
        uniqueTagSlugs.map(tagSlug => `<url>
          <loc>${baseUrl}/${lang}/blog/tags/${tagSlug}</loc>
          <lastmod>${currentDate}</lastmod>
          <changefreq>monthly</changefreq>
          <priority>0.5</priority>
        </url>`)
      );
      
      sitemapEntries.push(...tagEntries);
    }
  } catch (error) {
    console.error('Error generating blog sitemap entries:', error);
    // Continue without blog entries if there's an error
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${sitemapEntries.join('\n  ')}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=43200',
    },
  });
}