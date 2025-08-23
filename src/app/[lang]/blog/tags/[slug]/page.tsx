import { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Tag as TagIcon, ArrowLeft, Calendar, Clock } from 'lucide-react';
import { createSupabaseServer } from '@/lib/supabase/server';
import { formatBlogDate, calculateReadingTime } from '@/lib/blog-utils';
import { getDictionary } from '@/lib/dictionaries';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import type { PostWithAuthor, Tag } from '@/lib/supabase/types';
import type { Metadata } from 'next';

interface TagPageProps {
  params: Promise<{ 
    lang: string;
    slug: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
}

const POSTS_PER_PAGE = 9;

async function getTagWithPosts(tagSlug: string, page: number = 1): Promise<{
  tag: Tag | null;
  posts: PostWithAuthor[];
  totalCount: number;
}> {
  const supabase = await createSupabaseServer();
  const offset = (page - 1) * POSTS_PER_PAGE;

  // Get the tag
  const { data: tag } = await supabase
    .from('tags')
    .select('*')
    .eq('slug', tagSlug)
    .single();

  if (!tag) {
    return { tag: null, posts: [], totalCount: 0 };
  }

  // Get posts with this tag
  const { data: postTags, count } = await supabase
    .from('post_tags')
    .select(`
      posts_with_author!inner(*)
    `, { count: 'exact' })
    .eq('tag_id', tag.id)
    .eq('posts_with_author.status', 'published')
    .order('posts_with_author.published_at', { ascending: false })
    .range(offset, offset + POSTS_PER_PAGE - 1);

  const posts = postTags?.map(pt => (pt as any).posts_with_author).filter(Boolean) || [];

  return {
    tag,
    posts,
    totalCount: count || 0,
  };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  const { tag } = await getTagWithPosts(slug);
  
  if (!tag) {
    return {
      title: 'Tag Not Found',
    };
  }

  const dictionary = await getDictionary(lang);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://laurel-portfolio.vercel.app';

  return {
    title: `${tag.name} | ${dictionary?.Page?.blog?.title || 'Blog'}`,
    description: `Browse all posts tagged with ${tag.name}`,
    keywords: [
      'blog',
      'tag',
      tag.name,
      'software development',
      'programming',
    ],
    openGraph: {
      title: `Posts tagged "${tag.name}"`,
      description: `Browse all posts tagged with ${tag.name}`,
      type: 'website',
      url: `${baseUrl}/${lang}/blog/tags/${slug}`,
    },
    alternates: {
      canonical: `${baseUrl}/${lang}/blog/tags/${slug}`,
    },
  };
}

function TagPostCard({ post, lang }: { post: PostWithAuthor; lang: string }) {
  const readingTime = calculateReadingTime(post.content_md);

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-border/50">
      <CardHeader className="pb-3">
        {post.cover_url && (
          <div className="aspect-video relative overflow-hidden rounded-lg mb-4">
            <img
              src={post.cover_url}
              alt={post.title}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <div className="space-y-2">
          <h3 className="text-lg font-bold leading-tight group-hover:text-primary transition-colors">
            <Link href={`/${lang}/blog/${post.slug}`} className="stretched-link">
              {post.title}
            </Link>
          </h3>
          {post.excerpt && (
            <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
              {post.excerpt}
            </p>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            {post.published_at && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{formatBlogDate(post.published_at)}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{readingTime} min read</span>
            </div>
          </div>
          {post.author_name && (
            <span className="font-medium">by {post.author_name}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function TagPostsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="aspect-video rounded-lg mb-4" />
            <Skeleton className="h-5 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </CardHeader>
          <CardContent>
            <div className="flex justify-between">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-16" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default async function TagPage({ params, searchParams }: TagPageProps) {
  const { lang, slug } = await params;
  const { page: pageParam } = await searchParams;
  
  const currentPage = parseInt(pageParam || '1', 10);

  // Validate language
  const supportedLanguages = ['en', 'fr', 'de'];
  if (!supportedLanguages.includes(lang)) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link href={`/${lang}/blog`}>
              <Button variant="ghost" size="sm" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to blog
              </Button>
            </Link>
          </div>

          {/* Content */}
          <Suspense fallback={<TagPostsSkeleton />}>
            <TagContent
              lang={lang}
              tagSlug={slug}
              currentPage={currentPage}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

async function TagContent({
  lang,
  tagSlug,
  currentPage,
}: {
  lang: string;
  tagSlug: string;
  currentPage: number;
}) {
  const { tag, posts, totalCount } = await getTagWithPosts(tagSlug, currentPage);

  if (!tag) {
    notFound();
  }

  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE);

  return (
    <div className="space-y-8">
      {/* Tag header */}
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <Badge variant="default" className="text-lg px-4 py-2">
            <TagIcon className="w-5 h-5 mr-2" />
            {tag.name}
          </Badge>
        </div>
        <h1 className="text-3xl font-bold mb-2">
          Posts tagged "{tag.name}"
        </h1>
        <p className="text-muted-foreground">
          {totalCount > 0 ? (
            <>Found {totalCount} post{totalCount !== 1 ? 's' : ''}</>
          ) : (
            'No posts found with this tag'
          )}
        </p>
      </div>

      {/* Posts grid */}
      {posts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <TagPostCard key={post.id} post={post} lang={lang} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2">
              {currentPage > 1 && (
                <Link
                  href={`/${lang}/blog/tags/${tagSlug}?page=${currentPage - 1}`}
                >
                  <Button variant="outline">Previous</Button>
                </Link>
              )}
              
              <span className="text-sm text-muted-foreground px-3">
                Page {currentPage} of {totalPages}
              </span>

              {currentPage < totalPages && (
                <Link
                  href={`/${lang}/blog/tags/${tagSlug}?page=${currentPage + 1}`}
                >
                  <Button variant="outline">Next</Button>
                </Link>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No posts found with this tag.{' '}
            <Link
              href={`/${lang}/blog`}
              className="text-primary hover:underline"
            >
              View all posts
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}