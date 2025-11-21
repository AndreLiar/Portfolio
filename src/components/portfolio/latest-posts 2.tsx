import Link from 'next/link';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { formatBlogDate, calculateReadingTime } from '@/lib/blog-utils';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { PostWithAuthor, Tag } from '@/lib/supabase/types';

interface LatestPostsProps {
  lang: string;
  dictionary: any;
  posts: PostWithAuthor[];
  postTags: { [postId: string]: Tag[] };
}

function LatestPostCard({ 
  post, 
  tags, 
  lang 
}: { 
  post: PostWithAuthor; 
  tags: Tag[]; 
  lang: string; 
}) {
  const readingTime = calculateReadingTime(post.content_md);

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 h-full">
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
          <h3 className="text-lg font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
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
      <CardContent className="pt-0 space-y-3">
        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 3).map((tag) => (
              <Badge key={tag.id} variant="secondary" className="text-xs">
                {tag.name}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Meta */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
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
        </div>
      </CardContent>
    </Card>
  );
}

export function LatestPosts({ 
  lang, 
  dictionary, 
  posts,
  postTags
}: LatestPostsProps) {
  // Don't render the section if there are no posts
  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            {dictionary?.Page?.blog?.latestTitle || 'Latest Blog Posts'}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {dictionary?.Page?.blog?.latestSubtitle || 'Recent thoughts, tutorials, and insights on software development'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {posts.map((post) => (
            <LatestPostCard
              key={post.id}
              post={post}
              tags={postTags[post.id] || []}
              lang={lang}
            />
          ))}
        </div>

        <div className="text-center">
          <Link href={`/${lang}/blog`}>
            <Button variant="outline" size="lg">
              {dictionary?.Page?.blog?.viewAll || 'View All Posts'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}