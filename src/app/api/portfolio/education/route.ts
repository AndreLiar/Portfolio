import { NextResponse } from 'next/server';
import { EducationService } from '@/lib/firebase/firestore';

// GET all education items
export async function GET() {
  try {
    const education = await EducationService.getEducations();
    return NextResponse.json(education);
  } catch (error) {
    console.error('Error getting education items:', error);
    return NextResponse.json({ error: 'Failed to get education items' }, { status: 500 });
  }
}

// POST a new education item
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const educationId = await EducationService.createEducation(body);
    return NextResponse.json({ id: educationId }, { status: 201 });
  } catch (error) {
    console.error('Error creating education item:', error);
    return NextResponse.json({ error: 'Failed to create education item' }, { status: 500 });
  }
}
