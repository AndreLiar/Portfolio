'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Edit, Trash2, MoreHorizontal, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { projectApi } from '@/lib/api/project-client';

// Define the Project type based on your data structure
interface Project {
  id: string;
  title: string;
  role: string;
  impact: string;
}

interface AdminProjectsClientProps {
  initialProjects: Project[];
}

export function AdminProjectsClient({ initialProjects }: AdminProjectsClientProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  const handleDeleteProject = (projectId: string) => {
    setProjectToDelete(projectId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteProject = async () => {
    if (!projectToDelete) return;

    try {
      await projectApi.deleteProject(projectToDelete);
      toast({
        title: 'Project deleted',
        description: 'The project has been successfully deleted.',
      });
      router.refresh();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete the project. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setDeleteDialogOpen(false);
      setProjectToDelete(null);
    }
  };

  if (initialProjects.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 bg-white/50 backdrop-blur-sm rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-center">
          <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-6" />
          <h3 className="text-xl font-semibold mb-3">No projects found</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            Start building your portfolio by adding your first project. Showcase your work and skills to potential clients.
          </p>
          <Link href="/admin/projects/new">
            <Button size="lg" className="shadow-sm">
              <FileText className="w-5 h-5 mr-2" />
              Create First Project
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Projects Grid/Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/80">
            <TableRow>
              <TableHead className="font-semibold text-gray-900">Title</TableHead>
              <TableHead className="font-semibold text-gray-900">Role</TableHead>
              <TableHead className="font-semibold text-gray-900">Impact</TableHead>
              <TableHead className="text-right font-semibold text-gray-900">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialProjects.map((project) => (
              <TableRow key={project.id} className="hover:bg-gray-50/50 transition-colors">
                <TableCell className="font-medium text-gray-900">{project.title}</TableCell>
                <TableCell className="text-gray-700">{project.role}</TableCell>
                <TableCell className="text-gray-700">{project.impact}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/projects/${project.id}`} className="cursor-pointer">
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit Project</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteProject(project.id)} className="text-destructive cursor-pointer">
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete Project</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the project.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteProject} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
