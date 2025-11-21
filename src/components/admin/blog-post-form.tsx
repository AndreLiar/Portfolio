'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, Eye, FileText, Loader2, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { blogApi } from '@/lib/api/blog-client';
import type { Post, Tag, PostStatus } from '@/lib/firebase/types';

const postSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  slug: z.string().min(1, 'Slug is required').max(200, 'Slug too long'),
  excerpt: z.string().max(300, 'Excerpt too long').optional(),
  content_md: z.string().min(1, 'Content is required'),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  tags: z.array(z.string()).optional(),
});

type PostFormData = z.infer<typeof postSchema>;

interface BlogPostFormProps {
  post?: Post & { tags?: Tag[] };
  tags: Tag[];
  mode: 'create' | 'edit';
}

export function BlogPostForm({ post, tags, mode }: BlogPostFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [selectedTags, setSelectedTags] = useState<string[]>(
    post?.tags?.map(tag => tag?.id).filter(Boolean) || []
  );
  const [newTagName, setNewTagName] = useState('');
  const [isCreatingTag, setIsCreatingTag] = useState(false);

  const form = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: post?.title || '',
      slug: post?.slug || '',
      excerpt: post?.excerpt || '',
      content_md: post?.content_md || '',
      status: post?.status || 'draft',
      tags: post?.tags?.map(tag => tag?.id).filter(Boolean) || [],
    },
  });

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (title: string) => {
    form.setValue('title', title);
    if (!post) { // Only auto-generate for new posts
      const slug = generateSlug(title);
      form.setValue('slug', slug);
    }
  };

  const handleTagToggle = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;
    
    setIsCreatingTag(true);
    try {
      const slug = generateSlug(newTagName);
      const result = await blogApi.createTag(newTagName.trim(), slug);
      if (result.error) throw new Error(result.error);
      const tagId = result.tagId!;
      
      // Add the new tag to selected tags
      setSelectedTags(prev => [...prev, tagId]);
      setNewTagName('');
      
      toast({
        title: 'Tag created',
        description: `"${newTagName}" has been created and added to this post.`,
      });
      
      // Refresh the page to get updated tags list
      router.refresh();
    } catch (error) {
      toast({
        title: 'Error creating tag',
        description: 'Failed to create the tag. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsCreatingTag(false);
    }
  };

  const onSubmit = (data: PostFormData) => {
    startTransition(async () => {
      try {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined) {
            formData.append(key, value.toString());
          }
        });
        
        // Add selected tags
        selectedTags.forEach(tagId => {
          formData.append('tagIds', tagId);
        });

        let result;
        if (mode === 'create') {
          result = await blogApi.createPost(formData);
        } else if (post) {
          formData.append('id', post.id);
          result = await blogApi.updatePost(formData);
        }

        if (result?.error) {
          throw new Error(result.error);
        }

        toast({
          title: mode === 'create' ? 'Post created' : 'Post updated',
          description: `Your post has been ${mode === 'create' ? 'created' : 'updated'} successfully.`,
        });

        router.push('/admin/blog');
      } catch (error) {
        toast({
          title: 'Error',
          description: `Failed to ${mode} post. Please try again.`,
          variant: 'destructive',
        });
      }
    });
  };

  const previewContent = form.watch('content_md');

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <Card>
            <CardHeader>
              <CardTitle>Post Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter post title..."
                  {...form.register('title')}
                  onChange={(e) => handleTitleChange(e.target.value)}
                />
                {form.formState.errors.title && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  placeholder="post-url-slug"
                  {...form.register('slug')}
                />
                {form.formState.errors.slug && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.slug.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  placeholder="Brief description of the post..."
                  rows={3}
                  {...form.register('excerpt')}
                />
                {form.formState.errors.excerpt && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.excerpt.message}
                  </p>
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
              <Tabs defaultValue="write" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="write">
                    <FileText className="w-4 h-4 mr-2" />
                    Write
                  </TabsTrigger>
                  <TabsTrigger value="preview">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="write" className="mt-4">
                  <Textarea
                    placeholder="Write your post content in Markdown..."
                    rows={20}
                    className="font-mono"
                    {...form.register('content_md')}
                  />
                  {form.formState.errors.content_md && (
                    <p className="text-sm text-destructive mt-1">
                      {form.formState.errors.content_md.message}
                    </p>
                  )}
                </TabsContent>
                
                <TabsContent value="preview" className="mt-4">
                  <div className="border rounded-md p-4 min-h-[500px] bg-muted/10">
                    {previewContent ? (
                      <div className="prose max-w-none">
                        {previewContent.split('\n').map((line, index, array) => (
                          <div key={`preview-line-${index}`}>
                            {line || '\u00A0'}
                            {index < array.length - 1 && <br />}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">
                        Write some content to see the preview...
                      </p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status & Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Publish</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={form.watch('status')}
                  onValueChange={(value) => form.setValue('status', value as PostStatus)}
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

              <div className="flex gap-2">
                <Button type="submit" disabled={isPending} className="flex-1">
                  {isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {mode === 'create' ? 'Create Post' : 'Update Post'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Existing Tags */}
              <div className="flex flex-wrap gap-2">
                {tags.filter(tag => tag && tag.id && tag.name).map((tag) => {
                  const isSelected = selectedTags.includes(tag.id);
                  return (
                    <Badge
                      key={tag.id}
                      variant={isSelected ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => handleTagToggle(tag.id)}
                    >
                      {tag.name}
                    </Badge>
                  );
                })}
              </div>

              {/* Create New Tag */}
              <div className="border-t pt-4">
                <Label>Create New Tag</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    placeholder="Tag name"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleCreateTag();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCreateTag}
                    disabled={!newTagName.trim() || isCreatingTag}
                  >
                    {isCreatingTag ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Hash className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Selected Tags */}
              {selectedTags.length > 0 && (
                <div className="border-t pt-4">
                  <Label>Selected Tags</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedTags.filter(Boolean).map((tagId) => {
                      const tag = tags.find(t => t && t.id === tagId);
                      return tag ? (
                        <Badge key={`selected-${tagId}`} variant="secondary">
                          {tag.name}
                        </Badge>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}