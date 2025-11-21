import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserServer } from '@/lib/firebase/server-auth';
import { PostsService, PostTagsService } from '@/lib/firebase/firestore';
import { revalidatePath } from 'next/cache';

// Force Node.js runtime for Firebase Admin
export const runtime = 'nodejs';

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/blog/posts/[id] - Get single post
export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const post = await PostsService.getPostById(id);
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ post }, { status: 200 });
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

// PUT /api/blog/posts/[id] - Update post
export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    const user = await getCurrentUserServer();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { title, slug, excerpt, content_md, status, featured_image, tagIds } = body;

    // Get current post to check status change
    const currentPost = await PostsService.getPost(id);
    if (!currentPost) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: any = {
      title,
      slug,
      excerpt,
      content_md,
      status,
      featured_image,
      updated_at: new Date()
    };

    // Handle published_at timestamp when status changes to published
    if (status === 'published' && currentPost.status !== 'published') {
      updateData.published_at = new Date();
    } else if (status !== 'published' && currentPost.status === 'published') {
      // When unpublishing, keep the original published_at timestamp
      // This preserves the original publication date if the post is republished
    }

    // Update the post
    await PostsService.updatePost(id, updateData);

    // Update tags if provided
    if (tagIds && Array.isArray(tagIds)) {
      // Remove existing post-tag relationships
      await PostTagsService.removePostTags(id);
      
      // Add new relationships
      for (const tagId of tagIds) {
        await PostTagsService.createPostTag(id, tagId);
      }
    }

    // Revalidate blog pages
    revalidatePath('/admin/blog');
    revalidatePath('/[lang]/blog', 'page');
    revalidatePath(`/[lang]/blog/${slug}`, 'page');

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

// DELETE /api/blog/posts/[id] - Delete post
export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    const user = await getCurrentUserServer();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Remove post-tag relationships first
    await PostTagsService.removePostTags(id);
    
    // Delete the post
    await PostsService.deletePost(id);

    // Revalidate blog pages
    revalidatePath('/admin/blog');
    revalidatePath('/[lang]/blog', 'page');

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}