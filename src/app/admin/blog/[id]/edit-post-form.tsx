'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Eye, Trash2, ExternalLink } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { updatePost, deletePost } from '../actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { useToast } from '@/hooks/use-toast';
import { formatBlogDate } from '@/lib/blog-utils';
import type { Post, Tag, PostStatus } from '@/lib/supabase/types';

const updatePostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  slug: z.string().min(1, 'Slug is required'),
  excerpt: z.string().max(300, 'Excerpt too long').optional(),
  content_md: z.string().min(1, 'Content is required'),
  cover_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  tags: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']),
});

type UpdatePostForm = z.infer<typeof updatePostSchema>;

interface EditPostFormProps {
  post: Post;
  tags: Tag[];
}

export function EditPostForm({ post, tags }: EditPostFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<UpdatePostForm>({
    resolver: zodResolver(updatePostSchema),
    defaultValues: {
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || '',
      content_md: post.content_md,
      cover_url: post.cover_url || '',
      tags: tags.map(tag => tag.name).join(', '),
      status: post.status,
    },
  });

  const content_md = watch('content_md');
  const status = watch('status');

  const onSubmit = async (data: UpdatePostForm) => {
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('id', post.id);
      
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          formData.append(key, value.toString());
        }
      });

      await updatePost(formData);
      
      toast({
        title: 'Success!',
        description: 'Post updated successfully.',
      });
      
      // Don't redirect, just refresh the form state
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update post. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    
    try {
      const formData = new FormData();
      formData.append('id', post.id);
      
      await deletePost(formData);
      
      toast({
        title: 'Success!',
        description: 'Post deleted successfully.',
      });
      
      router.push('/admin/blog');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete post. Please try again.',
        variant: 'destructive',
      });
      setIsDeleting(false);
    }
  };

  const handleStatusChange = (newStatus: PostStatus) => {
    setValue('status', newStatus, { shouldDirty: true });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin/blog">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to posts
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Edit Post</h1>
            <div className="text-sm text-muted-foreground">
              Created: {formatBlogDate(post.created_at)}
              {post.updated_at !== post.created_at && (
                <> • Updated: {formatBlogDate(post.updated_at)}</>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {post.status === 'published' && (
            <Link href={`/en/blog/${post.slug}`} target="_blank">
              <Button variant="outline" size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                View Live
              </Button>
            </Link>
          )}
          
          <Button
            variant="outline"
            onClick={() => setPreviewMode(!previewMode)}
          >
            <Eye className="w-4 h-4 mr-2" />
            {previewMode ? 'Edit' : 'Preview'}
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the post
                  and all associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground"
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete Post'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Post Details */}
            <Card>
              <CardHeader>
                <CardTitle>Post Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    {...register('title')}
                    placeholder="Enter post title..."
                  />
                  {errors.title && (
                    <p className="text-sm text-destructive mt-1">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="slug">URL Slug *</Label>
                  <Input
                    id="slug"
                    {...register('slug')}
                    placeholder="url-slug"
                  />
                  {errors.slug && (
                    <p className="text-sm text-destructive mt-1">{errors.slug.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    {...register('excerpt')}
                    placeholder="Brief description of the post (optional)"
                    rows={3}
                  />
                  {errors.excerpt && (
                    <p className="text-sm text-destructive mt-1">{errors.excerpt.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Content */}
            <Card>
              <CardHeader>
                <CardTitle>Content</CardTitle>
              </CardHeader>
              <CardContent>
                {previewMode ? (
                  <div className="min-h-96 p-4 border rounded-md bg-muted/50">
                    <div className="prose dark:prose-invert max-w-none">
                      {content_md ? (
                        <div dangerouslySetInnerHTML={{ 
                          __html: content_md.replace(/\n/g, '<br>') 
                        }} />
                      ) : (
                        <p className="text-muted-foreground italic">
                          No content to preview...
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <>
                    <Label htmlFor="content_md">Markdown Content *</Label>
                    <Textarea
                      id="content_md"
                      {...register('content_md')}
                      placeholder="Write your post content in Markdown..."
                      rows={20}
                      className="font-mono"
                    />
                    {errors.content_md && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.content_md.message}
                      </p>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish */}
            <Card>
              <CardHeader>
                <CardTitle>Publish</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={status}
                    onValueChange={handleStatusChange}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting || !isDirty}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>

                {!isDirty && (
                  <p className="text-xs text-muted-foreground text-center">
                    No changes to save
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Featured Image */}
            <Card>
              <CardHeader>
                <CardTitle>Featured Image</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="cover_url">Image URL</Label>
                  <Input
                    id="cover_url"
                    {...register('cover_url')}
                    placeholder="https://example.com/image.jpg"
                  />
                  {errors.cover_url && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.cover_url.message}
                    </p>
                  )}
                </div>
                
                {watch('cover_url') && (
                  <div className="aspect-video relative overflow-hidden rounded-lg border">
                    <img
                      src={watch('cover_url')}
                      alt="Cover preview"
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    {...register('tags')}
                    placeholder="javascript, react, tutorial"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Separate multiple tags with commas
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}