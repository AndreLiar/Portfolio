import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdminProjectsClient } from '@/components/admin/projects-client';
import { projectApi } from '@/lib/api/project-client';

export default async function AdminProjectsPage() {
  const projects = await projectApi.getProjects();

  return (
    <div className="h-full flex flex-col space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-gray-200/50">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-lg text-muted-foreground mt-1">Manage your portfolio projects and showcase your work.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/projects/new">
            <Button size="lg" className="shadow-sm">
              <Plus className="w-5 h-5 mr-2" />
              New Project
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1">
        <AdminProjectsClient initialProjects={projects} />
      </div>
    </div>
  );
}
