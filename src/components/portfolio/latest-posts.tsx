import Link from 'next/link';
import { Calendar, ArrowRight, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PostsService, PostTagsService } from '@/lib/firebase/firestore';
import type { Post, Tag } from '@/lib/firebase/types';

interface PostWithTags extends Post {
  tags: Tag[];
}

interface LatestPostsProps {
  lang: string;
  dictionary: any;
  posts?: any[];
  postTags?: { [postId: string]: any[] };
}

async function getLatestPosts(): Promise<PostWithTags[]> {
  try {
    const posts = await PostsService.getPosts({
      status: 'published',
      limit: 3,
      orderByField: 'published_at',
      orderDirection: 'desc'
    });

    const postsWithTags = await Promise.all(
      posts.map(async (post) => {
        const tags = await PostTagsService.getTagsForPost(post.id);
        return { ...post, tags };
      })
    );

    return postsWithTags;
  } catch (error) {
    console.error('Error fetching latest posts:', error);
    return [];
  }
}

export async function LatestPosts({ lang, dictionary }: LatestPostsProps) {
  const posts = await getLatestPosts();

  if (!posts || posts.length === 0) {
    return null; // Don't render the section if no posts
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(lang, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Latest Blog Posts</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Sharing insights, learnings, and thoughts on software engineering and technology
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {posts.map((post) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="line-clamp-2">
                  <Link 
                    href={`/${lang}/blog/${post.slug}`}
                    className="hover:text-primary transition-colors"
                  >
                    {post.title}
                  </Link>
                </CardTitle>
                {post.excerpt && (
                  <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
                )}
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(post.published_at || post.created_at)}
                  </div>
                </div>
                
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.slice(0, 3).map((tag) => (
                      <Link key={tag.id} href={`/${lang}/blog/tags/${tag.slug}`}>
                        <Badge variant="secondary" className="text-xs hover:bg-primary hover:text-primary-foreground transition-colors">
                          {tag.name}
                        </Badge>
                      </Link>
                    ))}
                    {post.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{post.tags.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link href={`/${lang}/blog`}>
            <Button variant="outline" size="lg">
              <FileText className="w-4 h-4 mr-2" />
              View All Posts
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}