import { NextResponse } from 'next/server';
import { LanguagesService } from '@/lib/firebase/firestore';

// GET a single language
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const language = await LanguagesService.getLanguage(id);

    if (language) {
      return NextResponse.json(language);
    } else {
      return NextResponse.json({ error: 'Language not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error getting language:', error);
    return NextResponse.json({ error: 'Failed to get language' }, { status: 500 });
  }
}

// PUT to update a language
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    await LanguagesService.updateLanguage(id, body);
    return NextResponse.json({ message: 'Language updated successfully' });
  } catch (error) {
    console.error('Error updating language:', error);
    return NextResponse.json({ error: 'Failed to update language' }, { status: 500 });
  }
}

// DELETE a language
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await LanguagesService.deleteLanguage(id);
    return NextResponse.json({ message: 'Language deleted successfully' });
  } catch (error) {
    console.error('Error deleting language:', error);
    return NextResponse.json({ error: 'Failed to delete language' }, { status: 500 });
  }
}
