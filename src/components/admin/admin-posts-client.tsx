'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { 
  Edit, 
  Trash2, 
  Eye, 
  Calendar,
  MoreHorizontal,
  FileText,
  CheckSquare,
  Square
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { blogApi } from '@/lib/api/blog-client';
import type { Post, PostStatus } from '@/lib/firebase/types';

interface AdminPostsClientProps {
  initialPosts: Post[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export function AdminPostsClient({
  initialPosts,
  totalCount,
  currentPage,
  totalPages,
}: AdminPostsClientProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);

  const handleSelectAll = () => {
    if (selectedPosts.length === initialPosts.length) {
      setSelectedPosts([]);
    } else {
      setSelectedPosts(initialPosts.map(post => post.id));
    }
  };

  const handleSelectPost = (postId: string) => {
    setSelectedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const handleDeletePost = (postId: string) => {
    setPostToDelete(postId);
    setDeleteDialogOpen(true);
  };

  const confirmDeletePost = () => {
    if (!postToDelete) return;

    startTransition(async () => {
      try {
        const result = await blogApi.deletePost(postToDelete);
        if (result.error) throw new Error(result.error);
        toast({
          title: 'Post deleted',
          description: 'The post has been permanently deleted.',
        });
        router.refresh();
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete the post. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setDeleteDialogOpen(false);
        setPostToDelete(null);
      }
    });
  };

  const handleBulkDelete = () => {
    setBulkDeleteDialogOpen(true);
  };

  const confirmBulkDelete = () => {
    startTransition(async () => {
      try {
        const result = await blogApi.bulkDeletePosts(selectedPosts);
        if (result.error) throw new Error(result.error);
        toast({
          title: 'Posts deleted',
          description: `${selectedPosts.length} posts have been deleted.`,
        });
        setSelectedPosts([]);
        router.refresh();
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete posts. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setBulkDeleteDialogOpen(false);
      }
    });
  };

  const handleStatusChange = (postId: string, status: PostStatus) => {
    startTransition(async () => {
      try {
        const result = await blogApi.updatePostStatus(postId, status);
        if (result.error) throw new Error(result.error);
        toast({
          title: 'Status updated',
          description: `Post status changed to ${status}.`,
        });
        router.refresh();
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to update post status.',
          variant: 'destructive',
        });
      }
    });
  };

  const getStatusBadge = (status: PostStatus) => {
    switch (status) {
      case 'published':
        return <Badge variant="default">Published</Badge>;
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>;
      case 'archived':
        return <Badge variant="outline">Archived</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (initialPosts.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No posts found</h3>
        <p className="text-muted-foreground mb-4">
          Get started by creating your first blog post.
        </p>
        <Link href="/admin/blog/new">
          <Button>Create Post</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Bulk Actions */}
      {selectedPosts.length > 0 && (
        <div className="flex items-center gap-2 p-4 bg-muted/50 rounded-lg">
          <span className="text-sm font-medium">
            {selectedPosts.length} post{selectedPosts.length !== 1 ? 's' : ''} selected
          </span>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleBulkDelete}
            disabled={isPending}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Selected
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedPosts([])}
          >
            Clear Selection
          </Button>
        </div>
      )}

      {/* Posts Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={
                    initialPosts.length > 0 && selectedPosts.length === initialPosts.length
                  }
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Published</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialPosts.map((post) => (
              <TableRow key={post.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedPosts.includes(post.id)}
                    onCheckedChange={() => handleSelectPost(post.id)}
                  />
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium">{post.title}</div>
                    {post.excerpt && (
                      <div className="text-sm text-muted-foreground line-clamp-1">
                        {post.excerpt}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(post.status)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {post.published_at
                      ? format(post.published_at, 'MMM d, yyyy')
                      : 'Not published'
                    }
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-muted-foreground">
                    {format(post.updated_at, 'MMM d, yyyy')}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/blog/${post.id}`}>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/en/blog/${post.slug}`} target="_blank">
                            <Eye className="w-4 h-4 mr-2" />
                            View Post
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(post.id, 'published')}
                          disabled={post.status === 'published'}
                        >
                          Publish
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(post.id, 'draft')}
                          disabled={post.status === 'draft'}
                        >
                          Move to Draft
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(post.id, 'archived')}
                          disabled={post.status === 'archived'}
                        >
                          Archive
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDeletePost(post.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this post? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeletePost}
              disabled={isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Confirmation Dialog */}
      <AlertDialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selectedPosts.length} Posts</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedPosts.length} selected posts? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmBulkDelete}
              disabled={isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending ? 'Deleting...' : 'Delete All'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}