import { NextResponse } from 'next/server';
import { BioService } from '@/lib/firebase/firestore';

const BIO_DOC_ID = 'singleton';

// GET the bio
export async function GET() {
  try {
    const bio = await BioService.getBio();
    
    if (bio) {
      return NextResponse.json(bio);
    } else {
      // Return a default structure if it doesn't exist
      return NextResponse.json({ 
        name: '', 
        fullName: '',
        title: '', 
        location: '', 
        summary: '',
        contact: {
          email: '',
          phone: '',
          github: '',
          linkedin: ''
        }
      });
    }
  } catch (error) {
    console.error('Error getting bio:', error);
    return NextResponse.json({ error: 'Failed to get bio' }, { status: 500 });
  }
}

// POST (update) the bio
export async function POST(req: Request) {
  try {
    const body = await req.json();
    await BioService.updateBio(body);
    return NextResponse.json({ message: 'Bio updated successfully' });
  } catch (error) {
    console.error('Error updating bio:', error);
    return NextResponse.json({ error: 'Failed to update bio' }, { status: 500 });
  }
}
