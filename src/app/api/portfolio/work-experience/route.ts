import { NextResponse } from 'next/server';
import { WorkExperienceService } from '@/lib/firebase/firestore';

// GET all work experiences
export async function GET() {
  try {
    const workExperience = await WorkExperienceService.getWorkExperiences();
    return NextResponse.json(workExperience);
  } catch (error) {
    console.error('Error getting work experiences:', error);
    return NextResponse.json({ error: 'Failed to get work experiences' }, { status: 500 });
  }
}

// POST a new work experience
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const workExpId = await WorkExperienceService.createWorkExperience(body);
    return NextResponse.json({ id: workExpId }, { status: 201 });
  } catch (error) {
    console.error('Error creating work experience:', error);
    return NextResponse.json({ error: 'Failed to create work experience' }, { status: 500 });
  }
}
