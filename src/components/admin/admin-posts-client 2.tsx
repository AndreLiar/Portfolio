'use client';

import { useState, useTransition, useCallback } from 'react';
import Link from 'next/link';
import { Edit, Trash2, Eye, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { BulkOperations } from './bulk-operations';
import { PostVersionHistory } from './post-version-history';
import { deletePost, getPostVersions } from '@/app/admin/blog/actions';
import { formatBlogDate, getRelativeTime } from '@/lib/blog-utils';
import { useToast } from '@/hooks/use-toast';
import type { PostWithAuthor, PostStatus } from '@/lib/supabase/types';

interface PostVersion {
  id: string;
  version_number: number;
  title: string;
  change_summary: string;
  status: string;
  created_at: string;
  created_by_name: string;
}

interface AdminPostsClientProps {
  initialPosts: PostWithAuthor[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

function PostStatusBadge({ status }: { status: PostStatus }) {
  const variants = {
    draft: 'secondary',
    published: 'default',
    archived: 'outline',
  } as const;

  return (
    <Badge variant={variants[status]}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}

export function AdminPostsClient({ 
  initialPosts, 
  totalCount, 
  currentPage, 
  totalPages 
}: AdminPostsClientProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const [postVersions, setPostVersions] = useState<Record<string, PostVersion[]>>({});
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const refreshPosts = useCallback(() => {
    startTransition(() => {
      // Force page refresh to get updated data
      window.location.reload();
    });
  }, []);

  const handleDeletePost = async (postId: string) => {
    try {
      const formData = new FormData();
      formData.append('id', postId);
      
      await deletePost(formData);
      toast({ title: 'Success', description: 'Post deleted successfully' });
      refreshPosts();
    } catch (error) {
      console.error('Delete error:', error);
      toast({ title: 'Error', description: 'Failed to delete post', variant: 'destructive' });
    }
  };

  const loadVersions = async (postId: string) => {
    if (postVersions[postId]) return postVersions[postId];
    
    try {
      const result = await getPostVersions(postId);
      const versions = result.versions || [];
      setPostVersions(prev => ({ ...prev, [postId]: versions }));
      return versions;
    } catch (error) {
      console.error('Failed to load versions:', error);
      return [];
    }
  };

  const handleVersionChange = (postId: string) => {
    // Clear cached versions for this post to force reload
    setPostVersions(prev => {
      const newVersions = { ...prev };
      delete newVersions[postId];
      return newVersions;
    });
    refreshPosts();
  };

  return (
    <div className="space-y-4">
      {/* Bulk Operations */}
      <BulkOperations
        posts={posts.map(p => ({ id: p.id, title: p.title, status: p.status, slug: p.slug }))}
        selectedPosts={selectedPosts}
        onSelectionChange={setSelectedPosts}
        onRefresh={refreshPosts}
      />

      {/* Posts Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={posts.length > 0 && selectedPosts.length === posts.length}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedPosts(posts.map(p => p.id));
                    } else {
                      setSelectedPosts([]);
                    }
                  }}
                />
              </TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Published</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No posts found.
                </TableCell>
              </TableRow>
            ) : (
              posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedPosts.includes(post.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedPosts(prev => [...prev, post.id]);
                        } else {
                          setSelectedPosts(prev => prev.filter(id => id !== post.id));
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="space-y-1">
                      <div>{post.title}</div>
                      {post.excerpt && (
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {post.excerpt}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <PostStatusBadge status={post.status} />
                  </TableCell>
                  <TableCell>{post.author_name || 'Unknown'}</TableCell>
                  <TableCell>
                    {post.published_at ? (
                      <div className="space-y-1">
                        <div className="text-sm">
                          {formatBlogDate(post.published_at)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {getRelativeTime(post.published_at)}
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Not published</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm">
                        {formatBlogDate(post.updated_at)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {getRelativeTime(post.updated_at)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {post.status === 'published' && (
                        <Link href={`/en/blog/${post.slug}`} target="_blank">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                      )}
                      
                      <PostVersionHistory
                        postId={post.id}
                        versions={postVersions[post.id] || []}
                        onVersionChange={() => handleVersionChange(post.id)}
                      />
                      
                      <Link href={`/admin/blog/${post.id}`}>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Post</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{post.title}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeletePost(post.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Stats */}
      <div className="text-sm text-muted-foreground text-center">
        Showing {posts.length} of {totalCount} posts
      </div>
    </div>
  );
}