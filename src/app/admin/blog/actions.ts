'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { createSupabaseServer, getCurrentUser, isAdmin } from '@/lib/supabase/server';
import { mdToSafeHtml, generateExcerpt } from '@/lib/markdown';
import { generateUniqueSlug } from '@/lib/slug';
import { parseTagsFromInput } from '@/lib/blog-utils';
import type { PostStatus } from '@/lib/supabase/types';

// Validation schemas
const createPostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  slug: z.string().optional(),
  excerpt: z.string().max(300, 'Excerpt too long').optional(),
  content_md: z.string().min(1, 'Content is required'),
  cover_url: z.string().url().optional().or(z.literal('')),
  tags: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
});

const updatePostSchema = createPostSchema.extend({
  id: z.string().uuid(),
});

const deletePostSchema = z.object({
  id: z.string().uuid(),
});

// Helper to check if slug exists
async function checkSlugExists(slug: string, excludeId?: string): Promise<boolean> {
  const supabase = await createSupabaseServer();
  
  let query = supabase
    .from('posts')
    .select('id')
    .eq('slug', slug);
  
  if (excludeId) {
    query = query.neq('id', excludeId);
  }
  
  const { data } = await query.single();
  return !!data;
}

// Helper to upsert tags
async function upsertTags(tagNames: string[]): Promise<number[]> {
  if (tagNames.length === 0) return [];
  
  const supabase = await createSupabaseServer();
  const tagIds: number[] = [];
  
  for (const name of tagNames) {
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    
    // Try to get existing tag
    const { data: existingTag } = await supabase
      .from('tags')
      .select('id')
      .eq('slug', slug)
      .single();
    
    if (existingTag) {
      tagIds.push(existingTag.id);
    } else {
      // Create new tag
      const { data: newTag } = await supabase
        .from('tags')
        .insert({ name, slug })
        .select('id')
        .single();
      
      if (newTag) {
        tagIds.push(newTag.id);
      }
    }
  }
  
  return tagIds;
}

// Helper to update post tags
async function updatePostTags(postId: string, tagIds: number[]): Promise<void> {
  const supabase = await createSupabaseServer();
  
  // Remove existing tags
  await supabase
    .from('post_tags')
    .delete()
    .eq('post_id', postId);
  
  // Add new tags
  if (tagIds.length > 0) {
    const postTags = tagIds.map(tagId => ({ post_id: postId, tag_id: tagId }));
    await supabase.from('post_tags').insert(postTags);
  }
}

export async function createPost(formData: FormData) {
  // Check authentication
  const user = await getCurrentUser();
  if (!user || !(await isAdmin())) {
    throw new Error('Unauthorized');
  }

  // Validate input
  const rawData = {
    title: formData.get('title') as string,
    slug: formData.get('slug') as string,
    excerpt: formData.get('excerpt') as string,
    content_md: formData.get('content_md') as string,
    cover_url: formData.get('cover_url') as string,
    tags: formData.get('tags') as string,
    status: formData.get('status') as PostStatus,
  };

  const validatedData = createPostSchema.parse(rawData);

  const supabase = await createSupabaseServer();

  try {
    // Generate slug if not provided
    const slug = validatedData.slug || 
      await generateUniqueSlug(validatedData.title, checkSlugExists);

    // Generate HTML content
    const content_html = await mdToSafeHtml(validatedData.content_md);
    
    // Generate excerpt if not provided
    const excerpt = validatedData.excerpt || 
      generateExcerpt(validatedData.content_md);

    // Set published_at if publishing
    const published_at = validatedData.status === 'published' ? new Date().toISOString() : null;

    // Create post
    const { data: post, error } = await supabase
      .from('posts')
      .insert({
        author_id: user.id,
        title: validatedData.title,
        slug,
        excerpt,
        content_md: validatedData.content_md,
        content_html,
        cover_url: validatedData.cover_url || null,
        status: validatedData.status,
        published_at,
      })
      .select()
      .single();

    if (error) throw error;

    // Handle tags
    if (validatedData.tags) {
      const tagNames = parseTagsFromInput(validatedData.tags);
      const tagIds = await upsertTags(tagNames);
      await updatePostTags(post.id, tagIds);
    }

    // Revalidate paths
    revalidatePath('/admin/blog');
    if (validatedData.status === 'published') {
      revalidatePath('/blog');
      revalidatePath(`/blog/${slug}`);
    }

    return { success: true, postId: post.id };
  } catch (error) {
    console.error('Error creating post:', error);
    throw new Error('Failed to create post');
  }
}

export async function updatePost(formData: FormData) {
  // Check authentication
  const user = await getCurrentUser();
  if (!user || !(await isAdmin())) {
    throw new Error('Unauthorized');
  }

  // Validate input
  const rawData = {
    id: formData.get('id') as string,
    title: formData.get('title') as string,
    slug: formData.get('slug') as string,
    excerpt: formData.get('excerpt') as string,
    content_md: formData.get('content_md') as string,
    cover_url: formData.get('cover_url') as string,
    tags: formData.get('tags') as string,
    status: formData.get('status') as PostStatus,
  };

  const validatedData = updatePostSchema.parse(rawData);

  const supabase = await createSupabaseServer();

  try {
    // Check if post exists and user has permission
    const { data: existingPost } = await supabase
      .from('posts')
      .select('slug, status')
      .eq('id', validatedData.id)
      .single();

    if (!existingPost) {
      throw new Error('Post not found');
    }

    // Generate slug if changed
    const slug = validatedData.slug || 
      await generateUniqueSlug(validatedData.title, 
        (s) => checkSlugExists(s, validatedData.id)
      );

    // Generate HTML content
    const content_html = await mdToSafeHtml(validatedData.content_md);
    
    // Generate excerpt if not provided
    const excerpt = validatedData.excerpt || 
      generateExcerpt(validatedData.content_md);

    // Handle published_at
    let published_at = null;
    if (validatedData.status === 'published') {
      if (existingPost.status !== 'published') {
        // First time publishing
        published_at = new Date().toISOString();
      }
      // If already published, keep existing published_at
    }

    // Update post
    const { error } = await supabase
      .from('posts')
      .update({
        title: validatedData.title,
        slug,
        excerpt,
        content_md: validatedData.content_md,
        content_html,
        cover_url: validatedData.cover_url || null,
        status: validatedData.status,
        ...(published_at && { published_at }),
      })
      .eq('id', validatedData.id);

    if (error) throw error;

    // Handle tags
    if (validatedData.tags !== undefined) {
      const tagNames = parseTagsFromInput(validatedData.tags);
      const tagIds = await upsertTags(tagNames);
      await updatePostTags(validatedData.id, tagIds);
    }

    // Revalidate paths
    revalidatePath('/admin/blog');
    revalidatePath(`/admin/blog/${validatedData.id}`);
    
    if (validatedData.status === 'published') {
      revalidatePath('/blog');
      revalidatePath(`/blog/${slug}`);
    }
    
    // If slug changed, revalidate old path
    if (existingPost.slug !== slug) {
      revalidatePath(`/blog/${existingPost.slug}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating post:', error);
    throw new Error('Failed to update post');
  }
}

export async function deletePost(formData: FormData) {
  // Check authentication
  const user = await getCurrentUser();
  if (!user || !(await isAdmin())) {
    throw new Error('Unauthorized');
  }

  // Validate input
  const { id } = deletePostSchema.parse({
    id: formData.get('id') as string,
  });

  const supabase = await createSupabaseServer();

  try {
    // Get post slug for cache revalidation
    const { data: existingPost } = await supabase
      .from('posts')
      .select('slug')
      .eq('id', id)
      .single();

    // Delete post (cascading deletes will handle post_tags and post_views)
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);

    if (error) throw error;

    // Revalidate paths
    revalidatePath('/admin/blog');
    revalidatePath('/blog');
    
    if (existingPost?.slug) {
      revalidatePath(`/blog/${existingPost.slug}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting post:', error);
    throw new Error('Failed to delete post');
  }
}

export async function togglePostStatus(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || !(await isAdmin())) {
    throw new Error('Unauthorized');
  }

  const id = formData.get('id') as string;
  const newStatus = formData.get('status') as PostStatus;

  if (!id || !newStatus) {
    throw new Error('Missing required fields');
  }

  const supabase = await createSupabaseServer();

  try {
    const updateData: any = { status: newStatus };
    
    // If publishing for the first time, set published_at
    if (newStatus === 'published') {
      const { data: existingPost } = await supabase
        .from('posts')
        .select('status')
        .eq('id', id)
        .single();
      
      if (existingPost?.status !== 'published') {
        updateData.published_at = new Date().toISOString();
      }
    }

    const { error } = await supabase
      .from('posts')
      .update(updateData)
      .eq('id', id);

    if (error) throw error;

    revalidatePath('/admin/blog');
    revalidatePath('/blog');

    return { success: true };
  } catch (error) {
    console.error('Error toggling post status:', error);
    throw new Error('Failed to update post status');
  }
}

// Version management actions
export async function getPostVersions(postId: string) {
  const user = await getCurrentUser();
  if (!user || !(await isAdmin())) {
    throw new Error('Unauthorized');
  }

  const supabase = await createSupabaseServer();

  try {
    const { data: versions, error } = await supabase
      .from('post_version_history')
      .select('*')
      .eq('post_id', postId)
      .order('version_number', { ascending: false });

    if (error) throw error;

    return { versions };
  } catch (error) {
    console.error('Error fetching post versions:', error);
    throw new Error('Failed to fetch post versions');
  }
}

export async function rollbackToVersion(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || !(await isAdmin())) {
    throw new Error('Unauthorized');
  }

  const postId = formData.get('postId') as string;
  const versionNumber = parseInt(formData.get('versionNumber') as string);

  if (!postId || !versionNumber) {
    throw new Error('Missing required fields');
  }

  const supabase = await createSupabaseServer();

  try {
    // Call the rollback function
    const { data, error } = await supabase.rpc('rollback_to_version', {
      p_post_id: postId,
      p_version_number: versionNumber
    });

    if (error) throw error;

    if (!data) {
      throw new Error('Version not found');
    }

    // Get the post slug for revalidation
    const { data: post } = await supabase
      .from('posts')
      .select('slug')
      .eq('id', postId)
      .single();

    // Revalidate paths
    revalidatePath('/admin/blog');
    revalidatePath(`/admin/blog/${postId}`);
    revalidatePath('/blog');
    
    if (post?.slug) {
      revalidatePath(`/blog/${post.slug}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Error rolling back to version:', error);
    throw new Error('Failed to rollback to version');
  }
}

export async function duplicatePost(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || !(await isAdmin())) {
    throw new Error('Unauthorized');
  }

  const postId = formData.get('postId') as string;

  if (!postId) {
    throw new Error('Post ID is required');
  }

  const supabase = await createSupabaseServer();

  try {
    // Get the original post
    const { data: originalPost, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', postId)
      .single();

    if (error || !originalPost) {
      throw new Error('Post not found');
    }

    // Generate unique slug
    const baseSlug = originalPost.slug + '-copy';
    const slug = await generateUniqueSlug(baseSlug, checkSlugExists);

    // Create duplicate post
    const { data: newPost, error: createError } = await supabase
      .from('posts')
      .insert({
        author_id: user.id,
        title: `${originalPost.title} (Copy)`,
        slug,
        excerpt: originalPost.excerpt,
        content_md: originalPost.content_md,
        content_html: originalPost.content_html,
        cover_url: originalPost.cover_url,
        status: 'draft',
        published_at: null,
      })
      .select()
      .single();

    if (createError) throw createError;

    // Copy tags
    const { data: originalTags } = await supabase
      .from('post_tags')
      .select('tag_id')
      .eq('post_id', postId);

    if (originalTags && originalTags.length > 0) {
      const newPostTags = originalTags.map(tag => ({
        post_id: newPost.id,
        tag_id: tag.tag_id
      }));
      await supabase.from('post_tags').insert(newPostTags);
    }

    revalidatePath('/admin/blog');

    return { success: true, postId: newPost.id };
  } catch (error) {
    console.error('Error duplicating post:', error);
    throw new Error('Failed to duplicate post');
  }
}

export async function bulkDeletePosts(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || !(await isAdmin())) {
    throw new Error('Unauthorized');
  }

  const postIds = formData.getAll('postIds') as string[];

  if (!postIds || postIds.length === 0) {
    throw new Error('No posts selected');
  }

  const supabase = await createSupabaseServer();

  try {
    // Get post slugs for cache revalidation
    const { data: posts } = await supabase
      .from('posts')
      .select('slug')
      .in('id', postIds);

    // Delete posts
    const { error } = await supabase
      .from('posts')
      .delete()
      .in('id', postIds);

    if (error) throw error;

    // Revalidate paths
    revalidatePath('/admin/blog');
    revalidatePath('/blog');
    
    if (posts) {
      posts.forEach(post => {
        if (post.slug) {
          revalidatePath(`/blog/${post.slug}`);
        }
      });
    }

    return { success: true, deletedCount: postIds.length };
  } catch (error) {
    console.error('Error bulk deleting posts:', error);
    throw new Error('Failed to delete posts');
  }
}