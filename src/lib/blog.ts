import 'server-only';

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
  'https://andrelair-platform.github.io/minicloud-platform-docs/blog/feed.json';

function estimateReadTime(html: string): number {
  const text = html.replace(/<[^>]+>/g, ' ');
  const words = text.trim().split(/\s+/).filter((w) => w.length > 0).length;
  return Math.max(1, Math.ceil(words / 200));
}

export async function getBlogPosts(fallback: BlogPost[] = []): Promise<BlogPost[]> {
  try {
    const res = await fetch(FEED_URL, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`Feed returned ${res.status}`);

    const feed = await res.json();
    const items: any[] = feed.items ?? [];

    return items.map((item) => {
      const url: string = item.url ?? item.id ?? '';
      const slug = url.split('/').filter(Boolean).pop() ?? '';
      const html: string = item.content_html ?? item.content_text ?? item.summary ?? '';

      return {
        slug,
        title: item.title ?? '',
        description: item.summary ?? '',
        date: (item.date_published ?? '').slice(0, 10),
        tags: Array.isArray(item.tags) ? item.tags : [],
        readTime: estimateReadTime(html),
        url,
      };
    });
  } catch {
    return fallback;
  }
}
