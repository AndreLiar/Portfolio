/**
 * Client-side API service for blog operations
 * Handles communication with the new /api/blog endpoints
 */

import type { Post, Tag, PostStatus } from '@/lib/firebase/types';

export interface CreatePostData {
  title: string;
  slug: string;
  excerpt?: string;
  content_md: string;
  status?: PostStatus;
  featured_image?: string | null;
  tagIds?: string[];
}

export interface UpdatePostData extends CreatePostData {
  updated_at: Date;
}

export interface GetPostsParams {
  status?: PostStatus;
  tagId?: string;
  limit?: number;
  offset?: number;
}

export class BlogApiClient {
  private static async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || `HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  }

  // Posts API
  static async getPosts(params: GetPostsParams = {}): Promise<{ posts: Post[] }> {
    const searchParams = new URLSearchParams();
    if (params.status) searchParams.set('status', params.status);
    if (params.tagId) searchParams.set('tagId', params.tagId);
    if (params.limit) searchParams.set('limit', params.limit.toString());
    if (params.offset) searchParams.set('offset', params.offset.toString());

    const response = await fetch(`/api/blog/posts?${searchParams}`);
    return this.handleResponse(response);
  }

  static async getPost(id: string): Promise<{ post: Post }> {
    const response = await fetch(`/api/blog/posts/${id}`);
    return this.handleResponse(response);
  }

  static async createPost(data: CreatePostData): Promise<{ success: boolean; postId: string }> {
    const response = await fetch('/api/blog/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  static async updatePost(id: string, data: UpdatePostData): Promise<{ success: boolean }> {
    const response = await fetch(`/api/blog/posts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  static async deletePost(id: string): Promise<{ success: boolean }> {
    const response = await fetch(`/api/blog/posts/${id}`, {
      method: 'DELETE',
    });
    return this.handleResponse(response);
  }

  // Tags API
  static async getTags(): Promise<{ tags: Tag[] }> {
    const response = await fetch('/api/blog/tags');
    return this.handleResponse(response);
  }

  static async createTag(data: { name: string; description?: string }): Promise<{ success: boolean; tagId: string }> {
    const response = await fetch('/api/blog/tags', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }
}

// Helper functions for form handling
export const blogApi = {
  // Form-compatible functions that match the old server action signatures
  async createPost(formData: FormData): Promise<{ success?: boolean; error?: string; postId?: string }> {
    try {
      const data: CreatePostData = {
        title: formData.get('title') as string,
        slug: formData.get('slug') as string,
        excerpt: formData.get('excerpt') as string || undefined,
        content_md: formData.get('content_md') as string,
        status: (formData.get('status') as PostStatus) || 'draft',
        featured_image: formData.get('featured_image') as string || null,
        tagIds: formData.getAll('tagIds') as string[],
      };

      const result = await BlogApiClient.createPost(data);
      return { success: true, postId: result.postId };
    } catch (error) {
      console.error('Create post error:', error);
      return { error: error instanceof Error ? error.message : 'Failed to create post' };
    }
  },

  async updatePost(formData: FormData): Promise<{ success?: boolean; error?: string }> {
    try {
      const id = formData.get('id') as string;
      if (!id) throw new Error('Post ID is required');

      const data: UpdatePostData = {
        title: formData.get('title') as string,
        slug: formData.get('slug') as string,
        excerpt: formData.get('excerpt') as string || undefined,
        content_md: formData.get('content_md') as string,
        status: (formData.get('status') as PostStatus) || 'draft',
        featured_image: formData.get('featured_image') as string || null,
        tagIds: formData.getAll('tagIds') as string[],
        updated_at: new Date(),
      };

      await BlogApiClient.updatePost(id, data);
      return { success: true };
    } catch (error) {
      console.error('Update post error:', error);
      return { error: error instanceof Error ? error.message : 'Failed to update post' };
    }
  },

  async deletePost(id: string): Promise<{ success?: boolean; error?: string }> {
    try {
      await BlogApiClient.deletePost(id);
      return { success: true };
    } catch (error) {
      console.error('Delete post error:', error);
      return { error: error instanceof Error ? error.message : 'Failed to delete post' };
    }
  },

  async createTag(name: string, description?: string): Promise<{ success?: boolean; error?: string; tagId?: string }> {
    try {
      const result = await BlogApiClient.createTag({ name, description });
      return { success: true, tagId: result.tagId };
    } catch (error) {
      console.error('Create tag error:', error);
      return { error: error instanceof Error ? error.message : 'Failed to create tag' };
    }
  },

  async bulkDeletePosts(postIds: string[]): Promise<{ success?: boolean; error?: string }> {
    try {
      // Delete posts one by one (could be optimized with a bulk endpoint later)
      await Promise.all(postIds.map(id => BlogApiClient.deletePost(id)));
      return { success: true };
    } catch (error) {
      console.error('Bulk delete error:', error);
      return { error: error instanceof Error ? error.message : 'Failed to delete posts' };
    }
  },

  async updatePostStatus(postId: string, status: PostStatus): Promise<{ success?: boolean; error?: string }> {
    try {
      // We need to get the current post data first, then update with new status
      const { post } = await BlogApiClient.getPost(postId);
      const updateData: UpdatePostData = {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt || undefined,
        content_md: post.content_md,
        status,
        featured_image: post.featured_image || null,
        updated_at: new Date(),
      };
      
      await BlogApiClient.updatePost(postId, updateData);
      return { success: true };
    } catch (error) {
      console.error('Update post status error:', error);
      return { error: error instanceof Error ? error.message : 'Failed to update post status' };
    }
  },
};