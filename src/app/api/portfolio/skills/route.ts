import { NextResponse } from 'next/server';
import { SkillsService } from '@/lib/firebase/firestore';

// GET all skills
export async function GET() {
  try {
    const skills = await SkillsService.getSkills();
    return NextResponse.json(skills);
  } catch (error) {
    console.error('Error getting skills:', error);
    return NextResponse.json({ error: 'Failed to get skills' }, { status: 500 });
  }
}

// POST a new skill
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const skillId = await SkillsService.createSkill(body);
    return NextResponse.json({ id: skillId }, { status: 201 });
  } catch (error) {
    console.error('Error creating skill:', error);
    return NextResponse.json({ error: 'Failed to create skill' }, { status: 500 });
  }
}
