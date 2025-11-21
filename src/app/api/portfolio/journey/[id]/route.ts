import { NextResponse } from 'next/server';
import { JourneyService } from '@/lib/firebase/firestore';

// GET a single journey item
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const journey = await JourneyService.getJourneyEntry(id);

    if (journey) {
      return NextResponse.json(journey);
    } else {
      return NextResponse.json({ error: 'Journey item not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error getting journey item:', error);
    return NextResponse.json({ error: 'Failed to get journey item' }, { status: 500 });
  }
}

// PUT to update a journey item
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    await JourneyService.updateJourneyEntry(id, body);
    return NextResponse.json({ message: 'Journey item updated successfully' });
  } catch (error) {
    console.error('Error updating journey item:', error);
    return NextResponse.json({ error: 'Failed to update journey item' }, { status: 500 });
  }
}

// DELETE a journey item
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await JourneyService.deleteJourneyEntry(id);
    return NextResponse.json({ message: 'Journey item deleted successfully' });
  } catch (error) {
    console.error('Error deleting journey item:', error);
    return NextResponse.json({ error: 'Failed to delete journey item' }, { status: 500 });
  }
}
