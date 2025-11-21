import { NextResponse } from 'next/server';
import { ProjectsService } from '@/lib/firebase/firestore';

// GET all projects
export async function GET() {
  try {
    const projects = await ProjectsService.getProjects();
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error getting projects:', error);
    return NextResponse.json({ error: 'Failed to get projects' }, { status: 500 });
  }
}

// POST a new project
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const projectId = await ProjectsService.createProject(body);
    return NextResponse.json({ id: projectId }, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
