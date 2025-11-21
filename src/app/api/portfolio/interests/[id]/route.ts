import { NextResponse } from 'next/server';
import { InterestsService } from '@/lib/firebase/firestore';

// GET a single interest
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const interest = await InterestsService.getInterest(id);

    if (interest) {
      return NextResponse.json(interest);
    } else {
      return NextResponse.json({ error: 'Interest not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error getting interest:', error);
    return NextResponse.json({ error: 'Failed to get interest' }, { status: 500 });
  }
}

// PUT to update an interest
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    await InterestsService.updateInterest(id, body);
    return NextResponse.json({ message: 'Interest updated successfully' });
  } catch (error) {
    console.error('Error updating interest:', error);
    return NextResponse.json({ error: 'Failed to update interest' }, { status: 500 });
  }
}

// DELETE an interest
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await InterestsService.deleteInterest(id);
    return NextResponse.json({ message: 'Interest deleted successfully' });
  } catch (error) {
    console.error('Error deleting interest:', error);
    return NextResponse.json({ error: 'Failed to delete interest' }, { status: 500 });
  }
}
