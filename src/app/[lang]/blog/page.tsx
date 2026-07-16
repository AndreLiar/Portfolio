import Link from "next/link";
import { ArrowLeft, Rss } from "lucide-react";
import { getDictionary } from "@/lib/dictionaries";
import { getBlogPosts } from "@/lib/blog";
import { BlogCard } from "@/components/portfolio/blog-card";
import { Button } from "@/components/ui/button";

export default async function BlogPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const t = dict.BlogPage;
  const posts = await getBlogPosts(dict.blogPosts ?? []);

  const sorted = [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Page header */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-screen-xl">
          <div className="flex items-center gap-4">
            <Link href={`/${lang}`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t.backToPortfolio}
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">{t.title}</h1>
              <p className="text-sm text-muted-foreground hidden sm:block">
                {t.subtitle}
              </p>
            </div>
          </div>
          <a
            href="https://andrelair-platform.github.io/minicloud-platform-docs/blog/rss.xml"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="RSS Feed"
          >
            <Button variant="outline" size="sm">
              <Rss className="w-4 h-4 mr-2" />
              RSS
            </Button>
          </a>
        </div>
      </div>

      {/* Hero banner */}
      <div className="bg-gradient-to-b from-primary/5 to-transparent border-b border-border/30">
        <div className="container mx-auto px-4 py-12 max-w-screen-xl text-center">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">
            {t.allPosts}
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">{t.title}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg">
            {t.subtitle}
          </p>
        </div>
      </div>

      {/* Cards grid */}
      <div className="container mx-auto px-4 py-12 max-w-screen-xl">
        {sorted.length === 0 ? (
          <p className="text-center text-muted-foreground py-24">{t.noPostsFound}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sorted.map((post, i) => (
              <BlogCard
                key={post.slug}
                {...post}
                index={i}
                t={{ readPost: t.readPost, minRead: t.minRead, postedOn: t.postedOn }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
