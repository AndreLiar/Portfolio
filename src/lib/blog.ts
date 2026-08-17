import 'server-only';
import { JSDOM } from 'jsdom';

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  readTime: number;
  url: string;
  image?: string;
}

const FEED_URL =
  'https://andrelair-platform.github.io/minicloud-platform-docs/blog/rss.xml';

function estimateReadTime(html: string): number {
  const text = html.replace(/<[^>]+>/g, ' ');
  const words = text.trim().split(/\s+/).filter((w) => w.length > 0).length;
  return Math.max(1, Math.ceil(words / 200));
}

function parseRssDate(raw: string): string {
  try {
    return new Date(raw).toISOString().slice(0, 10);
  } catch {
    return raw.slice(0, 10);
  }
}

export async function getBlogPosts(fallback: BlogPost[] = []): Promise<BlogPost[]> {
  try {
    const res = await fetch(FEED_URL, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`Feed returned ${res.status}`);

    const xml = await res.text();
    const dom = new JSDOM(xml, { contentType: 'text/xml' });
    const doc = dom.window.document;
    const items = Array.from(doc.querySelectorAll('item'));

    return items.map((item) => {
      const url = item.querySelector('link')?.textContent?.trim() ?? '';
      const slug = url.split('/').filter(Boolean).pop() ?? '';
      const title = item.querySelector('title')?.textContent ?? '';
      const description = item.querySelector('description')?.textContent ?? '';
      const pubDate = item.querySelector('pubDate')?.textContent ?? '';
      const tags = Array.from(item.querySelectorAll('category')).map(
        (c) => c.textContent ?? ''
      );
      const contentEncoded =
        item.getElementsByTagNameNS('http://purl.org/rss/1.0/modules/content/', 'encoded')[0]
          ?.textContent ?? description;

      return {
        slug,
        title,
        description,
        date: parseRssDate(pubDate),
        tags,
        readTime: estimateReadTime(contentEncoded),
        url,
      };
    });
  } catch {
    return fallback;
  }
}
