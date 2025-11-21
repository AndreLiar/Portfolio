import { NextResponse } from 'next/server';
import { EducationService } from '@/lib/firebase/firestore';

// GET a single education item
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const education = await EducationService.getEducation(id);

    if (education) {
      return NextResponse.json(education);
    } else {
      return NextResponse.json({ error: 'Education item not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error getting education item:', error);
    return NextResponse.json({ error: 'Failed to get education item' }, { status: 500 });
  }
}

// PUT to update a education item
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    await EducationService.updateEducation(id, body);
    return NextResponse.json({ message: 'Education item updated successfully' });
  } catch (error) {
    console.error('Error updating education item:', error);
    return NextResponse.json({ error: 'Failed to update education item' }, { status: 500 });
  }
}

// DELETE a education item
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await EducationService.deleteEducation(id);
    return NextResponse.json({ message: 'Education item deleted successfully' });
  } catch (error) {
    console.error('Error deleting education item:', error);
    return NextResponse.json({ error: 'Failed to delete education item' }, { status: 500 });
  }
}
