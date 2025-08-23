import { Suspense } from 'react';
import Link from 'next/link';
import { Plus, Search } from 'lucide-react';
import { createSupabaseServer } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { PostWithAuthor, PostStatus } from '@/lib/supabase/types';
import { AdminPostsClient } from '@/components/admin/admin-posts-client';
import { PostImportExport } from '@/components/admin/post-import-export';

interface AdminBlogPageProps {
  searchParams: Promise<{
    status?: PostStatus;
    search?: string;
    page?: string;
  }>;
}

const POSTS_PER_PAGE = 10;

async function getAdminPosts(
  page: number = 1,
  status?: PostStatus,
  searchQuery?: string
): Promise<{
  posts: PostWithAuthor[];
  totalCount: number;
}> {
  const supabase = await createSupabaseServer();
  const offset = (page - 1) * POSTS_PER_PAGE;

  let query = supabase
    .from('posts_with_author')
    .select('*', { count: 'exact' })
    .order('updated_at', { ascending: false })
    .range(offset, offset + POSTS_PER_PAGE - 1);

  if (status && status !== 'all' as PostStatus) {
    query = query.eq('status', status);
  }

  if (searchQuery) {
    query = query.or(`title.ilike.%${searchQuery}%,excerpt.ilike.%${searchQuery}%`);
  }

  const { data: posts, count } = await query;

  return {
    posts: posts || [],
    totalCount: count || 0,
  };
}



function AdminPostsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Published</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default async function AdminBlogPage({ searchParams }: AdminBlogPageProps) {
  const { status, search, page: pageParam } = await searchParams;
  const currentPage = parseInt(pageParam || '1', 10);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Blog Posts</h1>
          <p className="text-muted-foreground">
            Manage your blog posts and content
          </p>
        </div>
        <div className="flex gap-2">
          <Suspense fallback={<div>Loading...</div>}>
            <PostImportExportWrapper />
          </Suspense>
          <Link href="/admin/blog/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Post
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search posts..."
                defaultValue={search}
                className="pl-10"
                name="search"
              />
            </div>
            <Select defaultValue={status || 'all'} name="status">
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Posts Table */}
      <Suspense fallback={<AdminPostsSkeleton />}>
        <AdminPostsContent
          currentPage={currentPage}
          status={status as PostStatus}
          searchQuery={search}
        />
      </Suspense>
    </div>
  );
}

async function PostImportExportWrapper() {
  const { posts } = await getAdminPosts(1, undefined, undefined);
  
  // Transform posts for import/export component
  const exportPosts = posts.map(post => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt || '',
    content_md: post.content_md,
    status: post.status,
    published_at: post.published_at,
    created_at: post.created_at,
    updated_at: post.updated_at,
    tags: [], // TODO: Add tags if needed
  }));

  return <PostImportExport posts={exportPosts} />;
}

async function AdminPostsContent({
  currentPage,
  status,
  searchQuery,
}: {
  currentPage: number;
  status?: PostStatus;
  searchQuery?: string;
}) {
  const { posts, totalCount } = await getAdminPosts(currentPage, status, searchQuery);
  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE);

  return (
    <div className="space-y-4">
      <AdminPostsClient
        initialPosts={posts}
        totalCount={totalCount}
        currentPage={currentPage}
        totalPages={totalPages}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          {currentPage > 1 && (
            <Link
              href={`/admin/blog?${new URLSearchParams({
                ...(status && { status }),
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
              href={`/admin/blog?${new URLSearchParams({
                ...(status && { status }),
                ...(searchQuery && { search: searchQuery }),
                page: (currentPage + 1).toString(),
              })}`}
            >
              <Button variant="outline">Next</Button>
            </Link>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="text-sm text-muted-foreground text-center">
        Showing {posts.length} of {totalCount} posts
      </div>
    </div>
  );
}