import { NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import { formatRSSDate } from '@/lib/blog-utils';

export async function GET(
  request: Request,
  { params }: { params: { lang: string } }
) {
  const { lang } = await params;
  
  const supabase = await createSupabaseServer();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://laurel-portfolio.vercel.app';
  
  try {
    // Get published posts
    const { data: posts } = await supabase
      .from('posts_with_author')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(50);

    if (!posts) {
      throw new Error('Failed to fetch posts');
    }

    // Build RSS items
    const items = posts.map(post => {
      const postUrl = `${baseUrl}/${lang}/blog/${post.slug}`;
      const publishedAt = post.published_at || post.created_at;
      
      return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${postUrl}</link>
      <guid>${postUrl}</guid>
      <pubDate>${formatRSSDate(publishedAt)}</pubDate>
      <description><![CDATA[${post.excerpt || ''}]]></description>
      <content:encoded><![CDATA[${post.content_html || ''}]]></content:encoded>
      ${post.author_name ? `<author>noreply@laurel-portfolio.com (${post.author_name})</author>` : ''}
      ${post.cover_url ? `<enclosure url="${post.cover_url}" type="image/jpeg" />` : ''}
    </item>`;
    }).join('');

    // Build RSS feed
    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Laurel Kanmegne Blog</title>
    <link>${baseUrl}/${lang}/blog</link>
    <description>Thoughts, tutorials, and insights on software development by Laurel Kanmegne</description>
    <language>${lang}</language>
    <lastBuildDate>${formatRSSDate(new Date().toISOString())}</lastBuildDate>
    <atom:link href="${baseUrl}/${lang}/rss.xml" rel="self" type="application/rss+xml" />
    <generator>Next.js Blog</generator>
    <webMaster>noreply@laurel-portfolio.com (Laurel Kanmegne)</webMaster>
    <managingEditor>noreply@laurel-portfolio.com (Laurel Kanmegne)</managingEditor>
    <copyright>Copyright ${new Date().getFullYear()} Laurel Kanmegne</copyright>
    <category>Technology</category>
    <category>Software Development</category>
    <category>Programming</category>
    ${items}
  </channel>
</rss>`;

    return new NextResponse(rss.trim(), {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error('Error generating RSS feed:', error);
    
    // Return a minimal RSS feed on error
    const errorRss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Laurel Kanmegne Blog</title>
    <link>${baseUrl}/${lang}/blog</link>
    <description>Blog RSS feed temporarily unavailable</description>
    <language>${lang}</language>
    <lastBuildDate>${formatRSSDate(new Date().toISOString())}</lastBuildDate>
  </channel>
</rss>`;

    return new NextResponse(errorRss.trim(), {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=300', // Short cache on error
      },
    });
  }
}