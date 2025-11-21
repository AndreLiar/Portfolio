import { NextResponse } from 'next/server';
import { LanguagesService } from '@/lib/firebase/firestore';

// GET all languages
export async function GET() {
  try {
    const languages = await LanguagesService.getLanguages();
    return NextResponse.json(languages);
  } catch (error) {
    console.error('Error getting languages:', error);
    return NextResponse.json({ error: 'Failed to get languages' }, { status: 500 });
  }
}

// POST a new language
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const languageId = await LanguagesService.createLanguage(body);
    return NextResponse.json({ id: languageId }, { status: 201 });
  } catch (error) {
    console.error('Error creating language:', error);
    return NextResponse.json({ error: 'Failed to create language' }, { status: 500 });
  }
}
