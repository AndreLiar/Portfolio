import { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, Clock, Eye, ArrowLeft, Tag as TagIcon } from 'lucide-react';
import { createSupabaseServer } from '@/lib/supabase/server';
import { formatBlogDate, calculateReadingTime } from '@/lib/blog-utils';
import { getDictionary } from '@/lib/dictionaries';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { PostWithAuthor, Tag, PostView } from '@/lib/supabase/types';
import type { Metadata } from 'next';

interface BlogPostPageProps {
  params: Promise<{ 
    lang: string;
    slug: string;
  }>;
}

async function getBlogPost(slug: string): Promise<{
  post: PostWithAuthor | null;
  tags: Tag[];
  views: number;
}> {
  const supabase = await createSupabaseServer();

  // Get the post
  const { data: post } = await supabase
    .from('posts_with_author')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (!post) {
    return { post: null, tags: [], views: 0 };
  }

  // Get post tags
  const { data: postTags } = await supabase
    .from('post_tags')
    .select(`
      tags (
        id,
        name,
        slug
      )
    `)
    .eq('post_id', post.id);

  const tags = postTags?.map(pt => (pt as any).tags).filter(Boolean) || [];

  // Get view count
  const { data: viewData } = await supabase
    .from('post_views')
    .select('views')
    .eq('post_id', post.id)
    .single();

  const views = viewData?.views || 0;

  // Increment view count
  await supabase.rpc('increment_post_view', { p_post_id: post.id });

  return { post, tags, views: views + 1 };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  const { post } = await getBlogPost(slug);
  
  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const dictionary = await getDictionary(lang);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://laurel-portfolio.vercel.app';

  return {
    title: `${post.title} | ${dictionary?.Page?.blog?.title || 'Blog'}`,
    description: post.excerpt || `Read ${post.title} on the blog`,
    keywords: [
      'blog',
      'software development',
      'programming',
      'tech',
      ...(post.title.split(' ').slice(0, 5)), // Add title words as keywords
    ],
    authors: [{ name: post.author_name || 'Author' }],
    openGraph: {
      title: post.title,
      description: post.excerpt || `Read ${post.title} on the blog`,
      type: 'article',
      modifiedTime: post.updated_at,
      authors: [post.author_name || 'Author'],
      url: `${baseUrl}/${lang}/blog/${slug}`,
      images: post.cover_url ? [
        {
          url: post.cover_url,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || `Read ${post.title} on the blog`,
      images: post.cover_url ? [post.cover_url] : undefined,
    },
    alternates: {
      canonical: `${baseUrl}/${lang}/blog/${slug}`,
    },
  };
}

function BlogPostHeader({ 
  post, 
  tags, 
  views, 
  lang 
}: { 
  post: PostWithAuthor;
  tags: Tag[];
  views: number;
  lang: string;
}) {
  const readingTime = calculateReadingTime(post.content_md);

  return (
    <header className="space-y-6">
      {/* Back to blog */}
      <div>
        <Link href={`/${lang}/blog`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to blog
          </Button>
        </Link>
      </div>

      {/* Cover image */}
      {post.cover_url && (
        <div className="aspect-video relative overflow-hidden rounded-lg">
          <img
            src={post.cover_url}
            alt={post.title}
            className="object-cover w-full h-full"
          />
        </div>
      )}

      {/* Title and meta */}
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          {post.title}
        </h1>
        
        {post.excerpt && (
          <p className="text-xl text-muted-foreground leading-relaxed">
            {post.excerpt}
          </p>
        )}

        {/* Meta information */}
        <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
          {post.author_name && (
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground">
                by {post.author_name}
              </span>
            </div>
          )}
          
          {post.published_at && (
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{formatBlogDate(post.published_at)}</span>
            </div>
          )}
          
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{readingTime} min read</span>
          </div>

          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            <span>{views.toLocaleString()} views</span>
          </div>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link key={tag.id} href={`/${lang}/blog?tag=${tag.slug}`}>
                <Badge variant="secondary" className="hover:bg-primary/90 cursor-pointer">
                  <TagIcon className="w-3 h-3 mr-1" />
                  {tag.name}
                </Badge>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Separator />
    </header>
  );
}

function BlogPostContent({ content }: { content: string }) {
  return (
    <article 
      className="prose prose-lg dark:prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { lang, slug } = await params;
  
  // Validate language
  const supportedLanguages = ['en', 'fr', 'de'];
  if (!supportedLanguages.includes(lang)) {
    notFound();
  }

  const { post, tags, views } = await getBlogPost(slug);

  if (!post || !post.content_html) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <BlogPostHeader 
            post={post} 
            tags={tags} 
            views={views}
            lang={lang}
          />
          
          <div className="mt-8">
            <BlogPostContent content={post.content_html} />
          </div>

          {/* Footer with back to blog link */}
          <footer className="mt-12 pt-8 border-t border-border">
            <div className="flex justify-between items-center">
              <Link href={`/${lang}/blog`}>
                <Button variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to all posts
                </Button>
              </Link>
              
              <div className="text-sm text-muted-foreground">
                Last updated: {formatBlogDate(post.updated_at)}
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}