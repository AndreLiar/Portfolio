import { NextRequest, NextResponse } from 'next/server';
import { createPost } from '../actions';
import { getCurrentUser, isAdmin } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = await getCurrentUser();
    if (!user || !(await isAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    
    // Use the existing createPost action
    const result = await createPost(formData);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json(
      { error: 'Failed to import post' },
      { status: 500 }
    );
  }
}