import { NextResponse } from 'next/server';
import { ProjectsService } from '@/lib/firebase/firestore';

// GET a single project
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const project = await ProjectsService.getProject(id);

    if (project) {
      return NextResponse.json(project);
    } else {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error getting project:', error);
    return NextResponse.json({ error: 'Failed to get project' }, { status: 500 });
  }
}

// PUT to update a project
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    await ProjectsService.updateProject(id, body);
    return NextResponse.json({ message: 'Project updated successfully' });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

// DELETE a project
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await ProjectsService.deleteProject(id);
    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
