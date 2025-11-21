import { NextRequest, NextResponse } from 'next/server';
import { generateBlogPost, BlogGenerationInputType } from '@/ai/openai-blog-generator';
import { GitHubService } from '@/lib/github';
import { z } from 'zod';

// Request body schema
const RequestSchema = z.object({
  githubUsername: z.string().min(1, 'GitHub username is required'),
  repositoryName: z.string().min(1, 'Repository name is required'),
  tone: z.enum(['technical', 'casual', 'professional', 'storytelling']).optional(),
  focus: z.enum(['overview', 'technical-deep-dive', 'learning-journey', 'showcase', 'tutorial']).optional(),
  targetAudience: z.enum(['developers', 'business', 'general', 'recruiters', 'students']).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validatedData = RequestSchema.parse(body);
    
    console.log('🚀 Starting AI blog generation for:', validatedData);

    // Generate blog post using Enhanced Genkit flow
    const blogPost = await generateBlogPost({
      githubUsername: validatedData.githubUsername,
      repositoryName: validatedData.repositoryName,
      tone: validatedData.tone || 'professional',
      focus: validatedData.focus || 'overview', 
      targetAudience: validatedData.targetAudience || 'developers',
    });

    console.log('✅ Blog post generated successfully');

    return NextResponse.json({
      success: true,
      data: blogPost,
    });

  } catch (error) {
    console.error('❌ Error generating blog post:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request data',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate blog post',
      },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch user repositories
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json(
        {
          success: false,
          error: 'Username parameter is required',
        },
        { status: 400 }
      );
    }

    console.log('📂 Fetching repositories for:', username);

    const repositories = await GitHubService.getUserRepos(username);

    return NextResponse.json({
      success: true,
      data: repositories,
    });

  } catch (error) {
    console.error('❌ Error fetching repositories:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch repositories',
      },
      { status: 500 }
    );
  }
}