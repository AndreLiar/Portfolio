import { NextRequest, NextResponse } from 'next/server';
import { PostsService } from '@/lib/firebase/firestore';
import { getDictionary } from '@/lib/dictionaries';

export const dynamic = 'force-dynamic';
// Force Node.js runtime for Firebase Admin
export const runtime = 'nodejs';

interface RouteContext {
  params: Promise<{ lang: string }>;
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const { lang } = await params;
    const dictionary = await getDictionary(lang);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://laurel-portfolio.vercel.app';
    
    // Get published posts
    const posts = await PostsService.getPosts({
      status: 'published',
      limit: 50,
      orderByField: 'published_at',
      orderDirection: 'desc'
    });

    const rssItems = posts.map(post => {
      const pubDate = (post.published_at || post.created_at).toUTCString();
      const link = `${baseUrl}/${lang}/blog/${post.slug}`;
      
      return `
        <item>
          <title><![CDATA[${post.title}]]></title>
          <description><![CDATA[${post.excerpt || post.title}]]></description>
          <link>${link}</link>
          <guid isPermaLink="true">${link}</guid>
          <pubDate>${pubDate}</pubDate>
          <author>kanmegneandre@gmail.com (Laurel Kanmegne)</author>
        </item>
      `.trim();
    }).join('\n');

    const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title><![CDATA[${dictionary.Metadata.title} - Blog]]></title>
    <description><![CDATA[Latest blog posts from Laurel Kanmegne, a Fullstack Software Engineer]]></description>
    <link>${baseUrl}/${lang}/blog</link>
    <atom:link href="${baseUrl}/api/rss/${lang}" rel="self" type="application/rss+xml" />
    <language>${lang}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <managingEditor>kanmegneandre@gmail.com (Laurel Kanmegne)</managingEditor>
    <webMaster>kanmegneandre@gmail.com (Laurel Kanmegne)</webMaster>
    <ttl>60</ttl>
    <image>
      <url>${baseUrl}/favicon.ico</url>
      <title>${dictionary.Metadata.title}</title>
      <link>${baseUrl}/${lang}</link>
    </image>
${rssItems}
  </channel>
</rss>`.trim();

    return new NextResponse(rss, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('Error generating RSS feed:', error);
    return new NextResponse('Error generating RSS feed', { status: 500 });
  }
}