import { NextResponse } from 'next/server';
import { JourneyService } from '@/lib/firebase/firestore';

// GET all journey items
export async function GET() {
  try {
    const journey = await JourneyService.getJourneyEntries();
    return NextResponse.json(journey);
  } catch (error) {
    console.error('Error getting journey items:', error);
    return NextResponse.json({ error: 'Failed to get journey items' }, { status: 500 });
  }
}

// POST a new journey item
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const journeyId = await JourneyService.createJourneyEntry(body);
    return NextResponse.json({ id: journeyId }, { status: 201 });
  } catch (error) {
    console.error('Error creating journey item:', error);
    return NextResponse.json({ error: 'Failed to create journey item' }, { status: 500 });
  }
}
