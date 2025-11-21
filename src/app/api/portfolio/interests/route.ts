import { NextResponse } from 'next/server';
import { InterestsService } from '@/lib/firebase/firestore';

// GET all interests
export async function GET() {
  try {
    const interests = await InterestsService.getInterests();
    return NextResponse.json(interests);
  } catch (error) {
    console.error('Error getting interests:', error);
    return NextResponse.json({ error: 'Failed to get interests' }, { status: 500 });
  }
}

// POST a new interest
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const interestId = await InterestsService.createInterest(body);
    return NextResponse.json({ id: interestId }, { status: 201 });
  } catch (error) {
    console.error('Error creating interest:', error);
    return NextResponse.json({ error: 'Failed to create interest' }, { status: 500 });
  }
}
