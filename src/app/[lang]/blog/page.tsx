import { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Search, Tag as TagIcon, Calendar, Clock, ArrowRight } from 'lucide-react';
import { createSupabaseServer } from '@/lib/supabase/server';
import { formatBlogDate, calculateReadingTime } from '@/lib/blog-utils';
import { getDictionary } from '@/lib/dictionaries';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import type { PostWithAuthor, Tag } from '@/lib/supabase/types';

interface BlogPageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ 
    tag?: string;
    search?: string;
    page?: string;
  }>;
}

const POSTS_PER_PAGE = 6;

async function getBlogPosts(
  page: number = 1,
  tagSlug?: string,
  searchQuery?: string
): Promise<{
  posts: PostWithAuthor[];
  totalCount: number;
  tags: Tag[];
}> {
  const supabase = await createSupabaseServer();
  const offset = (page - 1) * POSTS_PER_PAGE;

  // Build the query for posts
  let postsQuery = supabase
    .from('posts_with_author')
    .select('*', { count: 'exact' })
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .range(offset, offset + POSTS_PER_PAGE - 1);

  // Filter by tag if specified
  if (tagSlug) {
    const { data: tag } = await supabase
      .from('tags')
      .select('id')
      .eq('slug', tagSlug)
      .single();

    if (tag) {
      const { data: postIds } = await supabase
        .from('post_tags')
        .select('post_id')
        .eq('tag_id', tag.id);

      if (postIds && postIds.length > 0) {
        postsQuery = postsQuery.in('id', postIds.map(p => p.post_id));
      } else {
        // No posts with this tag
        return { posts: [], totalCount: 0, tags: [] };
      }
    }
  }

  // Filter by search query if specified
  if (searchQuery) {
    postsQuery = postsQuery.or(`title.ilike.%${searchQuery}%,excerpt.ilike.%${searchQuery}%`);
  }

  const [{ data: posts, count }, { data: tags }] = await Promise.all([
    postsQuery,
    supabase
      .from('tags')
      .select('*')
      .order('name')
  ]);

  return {
    posts: posts || [],
    totalCount: count || 0,
    tags: tags || [],
  };
}

function BlogPostCard({ post }: { post: PostWithAuthor }) {
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
          <h2 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors">
            <Link href={`blog/${post.slug}`} className="stretched-link">
              {post.title}
            </Link>
          </h2>
          {post.excerpt && (
            <p className="text-muted-foreground text-sm leading-relaxed">
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

function BlogFilters({ 
  tags, 
  currentTag, 
  currentSearch,
  lang 
}: { 
  tags: Tag[];
  currentTag?: string;
  currentSearch?: string;
  lang: string;
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Link href={`/${lang}/blog`}>
          <Badge 
            variant={!currentTag ? "default" : "secondary"}
            className="hover:bg-primary/90 cursor-pointer"
          >
            All Posts
          </Badge>
        </Link>
        {tags.map((tag) => (
          <Link key={tag.id} href={`/${lang}/blog?tag=${tag.slug}`}>
            <Badge 
              variant={currentTag === tag.slug ? "default" : "secondary"}
              className="hover:bg-primary/90 cursor-pointer"
            >
              <TagIcon className="w-3 h-3 mr-1" />
              {tag.name}
            </Badge>
          </Link>
        ))}
      </div>
      
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search posts..."
          defaultValue={currentSearch}
          className="pl-10"
          name="search"
        />
      </div>
    </div>
  );
}

function BlogPostsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="aspect-video rounded-lg mb-4" />
            <Skeleton className="h-6 w-3/4 mb-2" />
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

export default async function BlogPage({ params, searchParams }: BlogPageProps) {
  const { lang } = await params;
  const { tag, search, page: pageParam } = await searchParams;
  
  const dictionary = await getDictionary(lang);
  const currentPage = parseInt(pageParam || '1', 10);

  // Validate language
  const supportedLanguages = ['en', 'fr', 'de'];
  if (!supportedLanguages.includes(lang)) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            {dictionary?.Page?.blog?.title || 'Blog'}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {dictionary?.Page?.blog?.subtitle || 'Thoughts, tutorials, and insights on software development'}
          </p>
        </div>

        {/* Content */}
        <Suspense fallback={<BlogPostsSkeleton />}>
          <BlogContent
            lang={lang}
            currentPage={currentPage}
            tagSlug={tag}
            searchQuery={search}
          />
        </Suspense>
      </div>
    </div>
  );
}

async function BlogContent({
  lang,
  currentPage,
  tagSlug,
  searchQuery,
}: {
  lang: string;
  currentPage: number;
  tagSlug?: string;
  searchQuery?: string;
}) {
  const { posts, totalCount, tags } = await getBlogPosts(currentPage, tagSlug, searchQuery);
  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE);

  return (
    <div className="space-y-8">
      {/* Filters */}
      <BlogFilters 
        tags={tags}
        currentTag={tagSlug}
        currentSearch={searchQuery}
        lang={lang}
      />

      {/* Results info */}
      <div className="text-sm text-muted-foreground">
        {totalCount > 0 ? (
          <>
            Showing {posts.length} of {totalCount} posts
            {tagSlug && ` tagged with "${tags.find(t => t.slug === tagSlug)?.name}"`}
            {searchQuery && ` matching "${searchQuery}"`}
          </>
        ) : (
          'No posts found'
        )}
      </div>

      {/* Posts grid */}
      {posts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2">
              {currentPage > 1 && (
                <Link
                  href={`/${lang}/blog?${new URLSearchParams({
                    ...(tagSlug && { tag: tagSlug }),
                    ...(searchQuery && { search: searchQuery }),
                    page: (currentPage - 1).toString(),
                  })}`}
                >
                  <Button variant="outline">Previous</Button>
                </Link>
              )}
              
              <span className="text-sm text-muted-foreground px-3">
                Page {currentPage} of {totalPages}
              </span>

              {currentPage < totalPages && (
                <Link
                  href={`/${lang}/blog?${new URLSearchParams({
                    ...(tagSlug && { tag: tagSlug }),
                    ...(searchQuery && { search: searchQuery }),
                    page: (currentPage + 1).toString(),
                  })}`}
                >
                  <Button variant="outline">
                    Next
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No posts found. 
            {(tagSlug || searchQuery) && (
              <Link
                href={`/${lang}/blog`}
                className="text-primary hover:underline ml-1"
              >
                View all posts
              </Link>
            )}
          </p>
        </div>
      )}
    </div>
  );
}