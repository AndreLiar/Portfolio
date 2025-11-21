import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, Clock, Tag, ArrowLeft, Share2 } from 'lucide-react';
import { getDictionary } from '@/lib/dictionaries';
import { PostsService, PostTagsService } from '@/lib/firebase/firestore';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { Post, Tag as TagType } from '@/lib/firebase/types';

interface BlogPostPageProps {
  params: Promise<{ lang: string; slug: string }>;
}

interface PostWithTags extends Post {
  tags: TagType[];
}

async function getPostBySlug(slug: string): Promise<PostWithTags | null> {
  try {
    const post = await PostsService.getPostBySlug(slug);
    if (!post) return null;

    const tags = await PostTagsService.getTagsForPost(post.id);
    
    // Increment view count
    await PostsService.incrementViews(post.id);
    
    return { ...post, tags };
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  
  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.excerpt || undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      type: 'article',
      publishedTime: post.published_at?.toISOString(),
      modifiedTime: post.updated_at.toISOString(),
      authors: ['Laurel Kanmegne'],
      tags: post.tags?.map(tag => tag.name),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || undefined,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { lang, slug } = await params;
  const dictionary = await getDictionary(lang);
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(lang, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const estimatedReadTime = Math.ceil(post.content_md.split(' ').length / 200);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="mb-8">
          <Link href={`/${lang}/blog`}>
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>

        {/* Article */}
        <article className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-4 leading-tight">
              {post.title}
            </h1>
            
            {post.excerpt && (
              <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
                {post.excerpt}
              </p>
            )}

            {/* Meta information */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <time dateTime={post.published_at?.toISOString()}>
                  {formatDate(post.published_at || post.created_at)}
                </time>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {estimatedReadTime} min read
              </div>
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                <button 
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: post.title,
                        url: window.location.href,
                      });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                    }
                  }}
                  className="hover:text-foreground transition-colors"
                >
                  Share
                </button>
              </div>
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {post.tags.map((tag) => (
                  <Link key={tag.id} href={`/${lang}/blog/tags/${tag.slug}`}>
                    <Badge variant="secondary" className="hover:bg-primary hover:text-primary-foreground transition-colors">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag.name}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}

            <Separator className="mb-8" />
          </header>

          {/* Content */}
          <div 
            className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-pre:bg-muted prose-pre:border prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none"
            dangerouslySetInnerHTML={{ 
              __html: post.content_html || post.content_md.replace(/\n/g, '<br>') 
            }}
          />

          {/* Footer */}
          <footer className="mt-12 pt-8 border-t">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Last updated on {formatDate(post.updated_at)}
              </div>
              <div className="flex gap-2">
                <Link href={`/${lang}/blog`}>
                  <Button variant="outline">More Posts</Button>
                </Link>
                <Link href={`/${lang}`}>
                  <Button>Back to Portfolio</Button>
                </Link>
              </div>
            </div>
          </footer>
        </article>
      </div>
    </div>
  );
}