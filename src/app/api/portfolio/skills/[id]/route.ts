import { NextResponse } from 'next/server';
import { SkillsService } from '@/lib/firebase/firestore';

// GET a single skill
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const skill = await SkillsService.getSkill(id);

    if (skill) {
      return NextResponse.json(skill);
    } else {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error getting skill:', error);
    return NextResponse.json({ error: 'Failed to get skill' }, { status: 500 });
  }
}

// PUT to update a skill
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    await SkillsService.updateSkill(id, body);
    return NextResponse.json({ message: 'Skill updated successfully' });
  } catch (error) {
    console.error('Error updating skill:', error);
    return NextResponse.json({ error: 'Failed to update skill' }, { status: 500 });
  }
}

// DELETE a skill
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await SkillsService.deleteSkill(id);
    return NextResponse.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    console.error('Error deleting skill:', error);
    return NextResponse.json({ error: 'Failed to delete skill' }, { status: 500 });
  }
}
