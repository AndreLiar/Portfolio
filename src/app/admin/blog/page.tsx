import { Suspense } from 'react';
import Link from 'next/link';
import { Plus, Search } from 'lucide-react';
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
import type { PostStatus } from '@/lib/firebase/types';
import { AdminPostsClient } from '@/components/admin/admin-posts-client';

interface AdminBlogPageProps {
  searchParams: Promise<{
    status?: PostStatus;
    search?: string;
    page?: string;
  }>;
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
    <div className="h-full flex flex-col space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-gray-200/50">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Blog Posts</h1>
          <p className="text-lg text-muted-foreground mt-1">
            Manage your blog posts and content creation
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/blog/new">
            <Button size="lg" className="shadow-sm">
              <Plus className="w-5 h-5 mr-2" />
              New Post
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-white/80 backdrop-blur-sm border shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Filters & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search posts..."
                defaultValue={search}
                className="pl-10 h-10"
                name="search"
              />
            </div>
            <Select defaultValue={status || 'all'} name="status">
              <SelectTrigger className="w-full sm:w-48 h-10">
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
      <div className="flex-1">
        <Suspense fallback={<AdminPostsSkeleton />}>
          <AdminPostsContent
            currentPage={currentPage}
            status={status as PostStatus}
            searchQuery={search}
          />
        </Suspense>
      </div>
    </div>
  );
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
  // For now, show empty state since API endpoints aren't set up yet
  const mockPosts: any[] = [];

  return (
    <div className="space-y-4">
      <AdminPostsClient
        initialPosts={mockPosts}
        totalCount={0}
        currentPage={currentPage}
        totalPages={0}
      />

      {/* Empty state */}
      <div className="text-center py-8">
        <p className="text-muted-foreground">No posts found. Create your first blog post!</p>
        <Link href="/admin/blog/new" className="mt-4 inline-block">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create First Post
          </Button>
        </Link>
      </div>
    </div>
  );
}