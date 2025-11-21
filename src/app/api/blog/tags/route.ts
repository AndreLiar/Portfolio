import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserServer } from '@/lib/firebase/server-auth';
import { TagsService } from '@/lib/firebase/firestore';

// Force Node.js runtime for Firebase Admin
export const runtime = 'nodejs';

// GET /api/blog/tags - Get all tags
export async function GET() {
  try {
    const tags = await TagsService.getTags();
    return NextResponse.json({ tags }, { status: 200 });
  } catch (error) {
    console.error('Error fetching tags:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tags' },
      { status: 500 }
    );
  }
}

// POST /api/blog/tags - Create new tag
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
    const { name, description } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Tag name is required' },
        { status: 400 }
      );
    }

    // Create slug from name
    const slug = name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const tagId = await TagsService.createTag({
      name,
      slug,
      description: description || ''
    });

    return NextResponse.json(
      { success: true, tagId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating tag:', error);
    return NextResponse.json(
      { error: 'Failed to create tag' },
      { status: 500 }
    );
  }
}