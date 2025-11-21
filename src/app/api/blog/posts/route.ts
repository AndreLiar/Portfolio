import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserServer } from '@/lib/firebase/server-auth';
import { PostsService, TagsService, PostTagsService } from '@/lib/firebase/firestore';
import { PostStatus } from '@/lib/firebase/types';
import { revalidatePath } from 'next/cache';

// Force Node.js runtime for Firebase Admin
export const runtime = 'nodejs';

// GET /api/blog/posts - Get all posts (with optional filters)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as PostStatus || undefined;
    const tagId = searchParams.get('tagId') || undefined;
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    const posts = await PostsService.getPosts({
      status,
      tagId,
      limit,
      offset,
      orderByField: 'created_at',
      orderDirection: 'desc'
    });

    return NextResponse.json({ posts }, { status: 200 });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

// POST /api/blog/posts - Create new post
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUserServer();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, slug, excerpt, content_md, status, featured_image, tagIds } = body;

    // Validate required fields
    if (!title || !slug || !content_md) {
      return NextResponse.json(
        { error: 'Missing required fields: title, slug, content_md' },
        { status: 400 }
      );
    }

    // Prepare post data
    const postData: any = {
      title,
      slug,
      excerpt: excerpt || '',
      content_md,
      status: status || 'draft',
      featured_image: featured_image || null,
      author_id: user.uid
    };

    // Set published_at if creating with published status
    if (status === 'published') {
      postData.published_at = new Date();
    } else {
      postData.published_at = null;
    }

    // Create the post
    const postId = await PostsService.createPost(postData);

    // Handle tags if provided
    if (tagIds && Array.isArray(tagIds)) {
      for (const tagId of tagIds) {
        await PostTagsService.createPostTag(postId, tagId);
      }
    }

    // Revalidate blog pages
    revalidatePath('/admin/blog');
    revalidatePath('/[lang]/blog', 'page');

    return NextResponse.json(
      { success: true, postId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}